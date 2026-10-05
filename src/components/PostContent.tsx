import Link from "next/link";
import type { ReactNode } from "react";
import { documentToReactComponents, type Options } from "@contentful/rich-text-react-renderer";
import { BLOCKS, INLINES, MARKS, type Block, type Document, type Inline } from "@contentful/rich-text-types";
import ScrollAutoplayVideo from "@/components/ScrollAutoplayVideo";
import YouTubeEmbed from "@/components/YouTubeEmbed";
import ImageGallery from "@/components/gallery/ImageGallery";
import Callout, { toCalloutVariant } from "@/components/blocks/Callout";
import Divider, { DIVIDER_STYLES, type DividerStyle } from "@/components/blocks/Divider";
import StyledText from "@/components/blocks/StyledText";
import {
  GALLERY_CONTENT_TYPE,
  assetToGalleryImage,
  groupConsecutiveImages,
  toGalleryLayout,
  type GalleryImage,
} from "@/lib/gallery";
import { getEmbeddableYouTube, paragraphHasYouTubeEmbed } from "@/lib/youtube";
import { renderColoredText, stripColorSyntax } from "@/lib/textColor";

// Rich-text renderer for a post body: styled built-in nodes/marks, embedded
// assets (images, video, audio), galleries and custom content blocks.
const options: Options = {
  renderText: renderColoredText,
  renderMark: {
    [MARKS.CODE]: (text) => (
      <code className="px-1.5 py-0.5 rounded bg-cream text-[0.9em] font-mono text-forest">{text}</code>
    ),
    [MARKS.STRIKETHROUGH]: (text) => <s className="text-forest/60">{text}</s>,
    [MARKS.SUPERSCRIPT]: (text) => <sup>{text}</sup>,
    [MARKS.SUBSCRIPT]: (text) => <sub>{text}</sub>,
    [MARKS.UNDERLINE]: (text) => (
      <u className="underline decoration-sage decoration-2 underline-offset-4">{text}</u>
    ),
  },
  renderNode: {
    [BLOCKS.PARAGRAPH]: (
      node: Block | Inline,
      children: ReactNode
    ) =>
      paragraphHasYouTubeEmbed(node) ? (
        <div className="mb-6">{children}</div>
      ) : (
        <p className="mb-6">{children}</p>
      ),
    [BLOCKS.HEADING_1]: (
      _node: Block | Inline,
      children: ReactNode
    ) => (
      <h1 className="text-3xl font-bold mb-4 mt-8">{children}</h1>
    ),
    [BLOCKS.HEADING_2]: (
      _node: Block | Inline,
      children: ReactNode
    ) => (
      <h2 className="text-2xl font-bold mb-4 mt-6">{children}</h2>
    ),
    [BLOCKS.HEADING_3]: (
      _node: Block | Inline,
      children: ReactNode
    ) => (
      <h3 className="text-xl font-bold mb-3 mt-4">{children}</h3>
    ),
    [BLOCKS.HEADING_4]: (_node: Block | Inline, children: ReactNode) => (
      <h4 className="text-lg font-bold mb-3 mt-4">{children}</h4>
    ),
    [BLOCKS.HEADING_5]: (_node: Block | Inline, children: ReactNode) => (
      <h5 className="text-base font-bold uppercase tracking-wide text-moss mb-2 mt-4">{children}</h5>
    ),
    [BLOCKS.HEADING_6]: (_node: Block | Inline, children: ReactNode) => (
      <h6 className="text-sm font-semibold uppercase tracking-widest text-sage mb-2 mt-4">{children}</h6>
    ),
    [BLOCKS.HR]: () => <Divider />,
    [BLOCKS.TABLE]: (_node: Block | Inline, children: ReactNode) => (
      <div className="my-8 overflow-x-auto rounded-xl border border-sage/30">
        <table className="w-full text-base border-collapse [&_p]:mb-0">
          <tbody>{children}</tbody>
        </table>
      </div>
    ),
    [BLOCKS.TABLE_ROW]: (_node: Block | Inline, children: ReactNode) => (
      <tr className="border-b border-sage/20 last:border-b-0 even:bg-cream/40">{children}</tr>
    ),
    [BLOCKS.TABLE_HEADER_CELL]: (_node: Block | Inline, children: ReactNode) => (
      <th className="px-4 py-3 text-left font-semibold text-forest bg-cream">{children}</th>
    ),
    [BLOCKS.TABLE_CELL]: (_node: Block | Inline, children: ReactNode) => (
      <td className="px-4 py-3 align-top">{children}</td>
    ),
    [BLOCKS.QUOTE]: (
      _node: Block | Inline,
      children: ReactNode
    ) => (
      <blockquote className="blog-quote">
        <div className="quote-content">{children}</div>
      </blockquote>
    ),
    [BLOCKS.UL_LIST]: (
      _node: Block | Inline,
      children: ReactNode
    ) => <ul className="list-disc ml-6 mb-6">{children}</ul>,
    [BLOCKS.OL_LIST]: (
      _node: Block | Inline,
      children: ReactNode
    ) => <ol className="list-decimal ml-6 mb-6">{children}</ol>,
    [BLOCKS.LIST_ITEM]: (
      _node: Block | Inline,
      children: ReactNode
    ) => <li className="mb-2">{children}</li>,
    [BLOCKS.EMBEDDED_ASSET]: (node: any) => {
      const { file, title, description } = node.data.target.fields;
      const assetUrl = file?.url ? `https:${file.url}` : "";
      const contentType: string = file?.contentType || "";
      const caption = title || description || "";

      if (contentType.startsWith("video/")) {
        return (
          <ScrollAutoplayVideo
            src={assetUrl}
            type={contentType}
            caption={caption || undefined}
          />
        );
      }

      if (contentType.startsWith("audio/")) {
        return (
          <div className="my-8 flex flex-col items-center">
            <audio controls src={assetUrl} className="w-full max-w-2xl" />
            {caption && (
              <p className="text-sm text-sage text-center mt-2 italic">
                {caption}
              </p>
            )}
          </div>
        );
      }

      const width = file?.details?.image?.width;

      return (
        <div className="my-8 flex flex-col items-center">
          <img
            src={assetUrl}
            alt={title || description || ""}
            className="rounded-lg"
            style={{
              width: width ? `${Math.min(width, 896)}px` : "auto",
              height: "auto",
              maxWidth: "100%",
            }}
          />
          {(title || description) && (
            <p className="text-sm text-sage text-center mt-2 italic">
              {title || description}
            </p>
          )}
        </div>
      );
    },
    [BLOCKS.EMBEDDED_ENTRY]: (node: any) => {
      const contentType = node.data.target.sys.contentType?.sys?.id;
      const fields = node.data.target.fields;

      // Content blocks authors embed from Contentful (see CLAUDE.md "Content blocks").
      if (contentType === "callout") {
        return (
          <Callout variant={toCalloutVariant(fields.variant)} title={fields.title}>
            {fields.body && documentToReactComponents(fields.body, options)}
          </Callout>
        );
      }

      if (contentType === "divider") {
        const variant = DIVIDER_STYLES.includes(fields.variant) ? (fields.variant as DividerStyle) : "leaf";
        return <Divider variant={variant} />;
      }

      if (contentType === "styledText") {
        return (
          <StyledText options={fields}>
            {fields.body && documentToReactComponents(fields.body, options)}
          </StyledText>
        );
      }

      if (contentType === GALLERY_CONTENT_TYPE) {
        const images = (fields.images ?? [])
          .map(assetToGalleryImage)
          .filter((img: GalleryImage | null): img is GalleryImage => img !== null);
        if (images.length === 0) return null;
        return (
          <ImageGallery
            images={images}
            layout={toGalleryLayout(fields.layout, images.length)}
            title={fields.title}
          />
        );
      }

      if (contentType === "blogPost") {
        return (
          <div className="my-8 p-6 bg-cream rounded-lg border-l-4 border-moss">
            <h4 className="text-lg font-bold text-forest mb-2">
              🍃 Related Post: {fields.title}
            </h4>
            <p className="text-sage mb-3">
              {stripColorSyntax(fields.excerpt?.content?.[0]?.content?.[0]?.value || "")}
            </p>
            <Link
              href={`/post/${fields.slug || node.data.target.sys.id}`}
              className="text-moss hover:text-forest font-medium"
            >
              Đọc tiếp nè →
            </Link>
          </div>
        );
      }

      return (
        <div className="my-8 p-6 bg-cream rounded-lg">
          <p className="text-sm text-sage italic">
            Embedded content: {contentType || "Unknown type"}
          </p>
          {fields.title && (
            <h4 className="font-bold text-forest mt-2">
              {fields.title}
            </h4>
          )}
          {fields.description && (
            <p className="text-sage mt-2">{fields.description}</p>
          )}
        </div>
      );
    },
    [INLINES.HYPERLINK]: (
      node: Block | Inline,
      children: ReactNode
    ) => {
      const uri = (node as Inline).data.uri as string;
      const yt = getEmbeddableYouTube(node as Inline);
      if (yt) {
        return <YouTubeEmbed videoId={yt.videoId} start={yt.start} />;
      }
      return (
        <a
          href={uri}
          target="_blank"
          rel="noopener noreferrer"
          className="text-moss underline underline-offset-2 cursor-pointer hover:text-forest transition-colors break-words"
        >
          {children}
        </a>
      );
    },
    [INLINES.ENTRY_HYPERLINK]: (node: any, children: ReactNode) => {
      const target = node.data.target;
      const type = target?.sys?.contentType?.sys?.id;
      const slug = target?.fields?.slug;
      const href =
        type === "blogPost" && slug ? `/post/${slug}` : type === "category" && slug ? `/category/${slug}` : null;
      if (!href) return <span>{children}</span>;
      return (
        <Link href={href} className="text-moss underline underline-offset-2 hover:text-forest transition-colors">
          {children}
        </Link>
      );
    },
    [INLINES.ASSET_HYPERLINK]: (node: any, children: ReactNode) => {
      const url = node.data.target?.fields?.file?.url;
      if (!url) return <span>{children}</span>;
      return (
        <a
          href={`https:${url}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-moss underline underline-offset-2 hover:text-forest transition-colors"
        >
          {children}
        </a>
      );
    },
    [INLINES.EMBEDDED_ENTRY]: (node: any) => {
      const contentType = node.data.target.sys.contentType?.sys?.id;
      const fields = node.data.target.fields;

      if (contentType === "blogPost" && fields.title) {
        return (
          <Link
            href={`/post/${fields.slug || node.data.target.sys.id}`}
            className="inline-flex items-center gap-1 text-moss hover:text-forest font-medium transition-colors border-b-2 border-moss/30 hover:border-moss"
          >
            <span>🍃</span>
            <span>{fields.title}</span>
          </Link>
        );
      }

      return (
        <span className="inline-flex items-center gap-1 text-moss font-medium italic">
          <span>✨</span>
          <span>{fields.title || fields.name || "content"}</span>
        </span>
      );
    },
  },
};

export default function PostContent({ document }: { document: Document }) {
  return (
    <div className="text-lg leading-relaxed text-forest">
      {documentToReactComponents(groupConsecutiveImages(document), options)}
    </div>
  );
}
