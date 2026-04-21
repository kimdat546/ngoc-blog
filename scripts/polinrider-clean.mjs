#!/usr/bin/env node
// PolinRider remediation tool. Cleans infected files in your GitHub repos
// directly via the REST API — no local clone required.
//
// Requires Node 18+ (uses native fetch). No npm install needed.
//
// 1. Create a fine-grained PAT at https://github.com/settings/tokens?type=beta
//    Repository access: All repositories you own (or pick the affected ones)
//    Permissions: Contents (Read & write), Metadata (Read)
// 2. Run dry-run first to review what will change:
//      GITHUB_TOKEN=ghp_xxx node scripts/polinrider-clean.mjs
// 3. Apply the fixes:
//      GITHUB_TOKEN=ghp_xxx APPLY=1 node scripts/polinrider-clean.mjs
//
// Optional env vars:
//   REPO=owner/name        Limit to a single repo
//   ORG=my-org             Scan an org's repos instead of yours
//   BRANCH=main            Override the branch (defaults to each repo's default)

const TOKEN = process.env.GITHUB_TOKEN;
const APPLY = process.env.APPLY === "1";
const REPO_FILTER = process.env.REPO;
const ORG = process.env.ORG;
const BRANCH_OVERRIDE = process.env.BRANCH;

if (!TOKEN) {
  console.error("Set GITHUB_TOKEN. See header for token setup.");
  process.exit(1);
}

const API = "https://api.github.com";
const HEADERS = {
  Authorization: `Bearer ${TOKEN}`,
  Accept: "application/vnd.github+json",
  "X-GitHub-Api-Version": "2022-11-28",
  "User-Agent": "polinrider-cleaner",
};

const MARKERS = ["rmcej%otb%", "Cot%3t=shtP"];
const INJECTION_STARTS = ["global['!']", 'global["!"]', "var _$_"];
const ARTIFACT_FILES = ["temp_auto_push.bat"];

async function ghFetch(path, init = {}) {
  const url = path.startsWith("http") ? path : `${API}${path}`;
  const r = await fetch(url, { ...init, headers: { ...HEADERS, ...(init.headers || {}) } });
  if (r.status === 403 && r.headers.get("x-ratelimit-remaining") === "0") {
    const reset = +r.headers.get("x-ratelimit-reset") * 1000;
    const wait = Math.max(reset - Date.now() + 1000, 1000);
    console.warn(`  rate-limited; sleeping ${(wait / 1000) | 0}s`);
    await new Promise((res) => setTimeout(res, wait));
    return ghFetch(path, init);
  }
  return r;
}

async function gh(path, init = {}) {
  const r = await ghFetch(path, init);
  if (!r.ok) {
    const body = await r.text();
    const err = new Error(`GitHub ${r.status} ${r.statusText} for ${path}: ${body}`);
    err.status = r.status;
    throw err;
  }
  return r.json();
}

async function paginate(path) {
  const sep = path.includes("?") ? "&" : "?";
  let url = `${API}${path}${sep}per_page=100`;
  const out = [];
  while (url) {
    const r = await ghFetch(url);
    if (!r.ok) throw new Error(`GitHub ${r.status} for ${url}: ${await r.text()}`);
    out.push(...(await r.json()));
    const m = (r.headers.get("link") || "").match(/<([^>]+)>;\s*rel="next"/);
    url = m ? m[1] : null;
  }
  return out;
}

function cleanPayload(content) {
  if (!MARKERS.some((m) => content.includes(m))) return null;
  let earliest = -1;
  for (const sig of INJECTION_STARTS) {
    const i = content.indexOf(sig);
    if (i !== -1 && (earliest === -1 || i < earliest)) earliest = i;
  }
  if (earliest === -1) return null;
  return content.slice(0, earliest).trimEnd() + "\n";
}

async function processRepo(repo) {
  const branch = BRANCH_OVERRIDE || repo.default_branch;
  const summary = { scanned: true, changes: [] };
  console.log(`\n[repo] ${repo.full_name}  branch=${branch}`);

  const seen = new Set();
  for (const marker of MARKERS) {
    let result;
    try {
      const q = encodeURIComponent(`"${marker}" repo:${repo.full_name}`);
      result = await gh(`/search/code?q=${q}`);
    } catch (e) {
      if (e.status === 422) {
        console.warn(`  search unavailable on ${repo.full_name} (empty repo or disabled)`);
        continue;
      }
      console.warn(`  search failed: ${e.message.split("\n")[0]}`);
      continue;
    }
    for (const item of result.items || []) {
      if (seen.has(item.path)) continue;
      seen.add(item.path);

      let file;
      try {
        file = await gh(`/repos/${repo.full_name}/contents/${encodeURIComponent(item.path)}?ref=${branch}`);
      } catch (e) {
        console.warn(`  fetch ${item.path} failed: ${e.message.split("\n")[0]}`);
        continue;
      }
      if (Array.isArray(file) || !file.content) {
        console.warn(`  skip ${item.path} (not a regular file)`);
        continue;
      }
      const content = Buffer.from(file.content, "base64").toString("utf8");
      const cleaned = cleanPayload(content);
      if (!cleaned) {
        console.log(`  ?  ${item.path}: marker found but boundary unclear — manual review needed`);
        summary.changes.push({ path: item.path, action: "manual" });
        continue;
      }
      if (cleaned === content) continue;
      console.log(`  -  ${item.path}: ${content.length} -> ${cleaned.length} bytes${APPLY ? "" : " (dry-run)"}`);
      summary.changes.push({ path: item.path, action: "clean", before: content.length, after: cleaned.length });
      if (APPLY) {
        await gh(`/repos/${repo.full_name}/contents/${encodeURIComponent(item.path)}`, {
          method: "PUT",
          body: JSON.stringify({
            message: "security: remove PolinRider malware payload",
            content: Buffer.from(cleaned).toString("base64"),
            sha: file.sha,
            branch,
          }),
        });
      }
    }
  }

  for (const path of ARTIFACT_FILES) {
    let file;
    try {
      file = await gh(`/repos/${repo.full_name}/contents/${path}?ref=${branch}`);
    } catch (e) {
      if (e.status !== 404) console.warn(`  probe ${path} failed: ${e.message.split("\n")[0]}`);
      continue;
    }
    console.log(`  x  ${path}: deleting${APPLY ? "" : " (dry-run)"}`);
    summary.changes.push({ path, action: "delete" });
    if (APPLY) {
      await gh(`/repos/${repo.full_name}/contents/${path}`, {
        method: "DELETE",
        body: JSON.stringify({
          message: "security: remove PolinRider artifact",
          sha: file.sha,
          branch,
        }),
      });
    }
  }

  if (summary.changes.length === 0) console.log("  ok (no PolinRider markers found)");
  return summary;
}

async function listRepos() {
  if (REPO_FILTER) {
    const [owner, name] = REPO_FILTER.split("/");
    return [await gh(`/repos/${owner}/${name}`)];
  }
  if (ORG) return paginate(`/orgs/${ORG}/repos?type=all`);
  return paginate(`/user/repos?affiliation=owner`);
}

async function main() {
  console.log(`Mode: ${APPLY ? "APPLY (changes will be committed)" : "DRY-RUN"}`);
  console.log("Listing repositories...");
  const repos = await listRepos();
  console.log(`Found ${repos.length} repo(s).`);

  const reports = [];
  for (const repo of repos) {
    if (repo.archived || repo.disabled) {
      console.log(`\n[skip] ${repo.full_name} (archived/disabled)`);
      continue;
    }
    try {
      reports.push({ repo: repo.full_name, ...(await processRepo(repo)) });
    } catch (e) {
      console.error(`\n[fail] ${repo.full_name}: ${e.message}`);
    }
  }

  console.log("\n=== Summary ===");
  let total = 0;
  for (const r of reports) {
    if (r.changes.length === 0) continue;
    console.log(`${r.repo}:`);
    for (const c of r.changes) {
      console.log(`  ${c.action.padEnd(7)} ${c.path}`);
      total++;
    }
  }
  console.log(`\n${total} change(s) ${APPLY ? "applied" : "would be applied"} across ${reports.length} repo(s).`);
  if (!APPLY && total > 0) console.log("Re-run with APPLY=1 to commit fixes.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
