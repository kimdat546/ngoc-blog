export function formatDateVN(iso: string): string {
  const d = new Date(iso);
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
}

// "ngocmy@gmail.com" -> "ng****@gmail.com"
export function maskEmail(email: string): string {
  const at = email.indexOf("@");
  if (at < 0) return email;
  const user = email.slice(0, at);
  const domain = email.slice(at);
  if (user.length <= 2) return `${user}****${domain}`;
  return `${user.slice(0, 2)}****${domain}`;
}
