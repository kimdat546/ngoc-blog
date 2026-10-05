// Example page showing every rich-text format, content block and colour syntax (kept for reference; remove when no longer needed).
import PostContent from "@/components/PostContent";
import type { Document } from "@contentful/rich-text-types";

const t = (value: string, marks: string[] = []) => ({ nodeType: "text", value, marks: marks.map((type) => ({ type })), data: {} });
const p = (...content: any[]) => ({ nodeType: "paragraph", data: {}, content });
const h = (level: number, text: string) => ({ nodeType: `heading-${level}`, data: {}, content: [t(text)] });
const doc = (...content: any[]) => ({ nodeType: "document", data: {}, content });
const entry = (type: string, fields: any) => ({
  nodeType: "embedded-entry-block", content: [],
  data: { target: { sys: { id: type + Math.random(), type: "Entry", contentType: { sys: { id: type } } }, fields } },
});
const cell = (header: boolean, text: string) => ({ nodeType: header ? "table-header-cell" : "table-cell", data: {}, content: [p(t(text))] });
const row = (header: boolean, ...cells: string[]) => ({ nodeType: "table-row", data: {}, content: cells.map((c) => cell(header, c)) });

const body = (text: string) => doc(p(t(text)));

const demo = doc(
  h(2, "Tô màu chữ trong đoạn"),
  p(t("Màu chữ: (rừng)[rừng], (rêu)[rêu], (xanh nhạt)[xanh nhạt], (nâu)[nâu], (vàng)[vàng], (hồng)[hồng], (đỏ)[đỏ], (xanh dương)[xanh dương], (tím)[tím], (cam)[cam], mã hex (#8a3ffc)[#8a3ffc].")),
  p(t("Tô nền: (bút dạ vàng)[nền vàng], (nền hồng)[nền hồng], (nền rêu)[nền rêu], (nền xanh dương)[nền xanh dương], (nền tím)[nền tím].")),
  p(t("Kết hợp: (chữ đỏ trên nền vàng)[đỏ, nền vàng]; không dấu: (hong)[hong]; tiếng Anh: (pink)[pink]; in đậm cả cụm: "), t("(rất quan trọng)[đỏ]", ["bold"]), t(".")),
  p(t("Không phải màu nên giữ nguyên: (xem thêm)[1], (ghi chú)[abc], mảng [1, 2] và (ngoặc đơn) bình thường.")),
  { nodeType: "heading-3", data: {}, content: [t("Tiêu đề có (chữ hồng)[hồng]")] },
  h(2, "Định dạng có sẵn"),
  p(t("Chữ "), t("đậm", ["bold"]), t(", "), t("nghiêng", ["italic"]), t(", "), t("gạch chân", ["underline"]), t(", "), t("gạch ngang", ["strikethrough"]), t(", H"), t("2", ["subscript"]), t("O, x"), t("2", ["superscript"]), t(" và "), t("code", ["code"]), t(".")),
  h(4, "Tiêu đề H4"), p(t("Đoạn văn dưới H4.")),
  h(5, "Tiêu đề H5"), h(6, "Tiêu đề H6"),
  { nodeType: "table", data: {}, content: [row(true, "Ngày", "Hoạt động", "Cảm nhận"), row(false, "Thứ Hai", "Thiền buổi sáng", "Bình an"), row(false, "Thứ Ba", "Đi bộ trong rừng", "Nhẹ nhõm"), row(false, "Thứ Tư", "Viết nhật ký", "Biết ơn")] },
  { nodeType: "hr", data: {}, content: [] },
  h(2, "Khối Ghi chú"),
  entry("callout", { variant: "note", title: "Ghi chú", body: body("Đây là một ghi chú nhỏ dành cho bạn đọc.") }),
  entry("callout", { variant: "leaf", body: body("Hãy hít thở thật sâu và cảm nhận khoảnh khắc này.") }),
  entry("callout", { variant: "heart", title: "Từ trái tim", body: body("Cảm ơn bạn đã ở đây, cùng mình đi qua những ngày bình thường.") }),
  entry("callout", { variant: "important", title: "Lưu ý", body: body("Những trải nghiệm này mang tính cá nhân.") }),
  h(2, "Khối Đường phân cách"),
  ...["leaf", "flower", "sparkle", "dots", "line"].map((variant) => entry("divider", { variant })),
  h(2, "Khối Văn bản tùy chỉnh"),
  entry("styledText", { font: "handwriting", color: "moss", align: "center", size: "large", body: body("Mỗi ngày là một món quà") }),
  entry("styledText", { font: "notebook", color: "brown", align: "left", size: "normal", body: body("Viết như trong cuốn sổ tay nhỏ, giản dị và gần gũi.") }),
  entry("styledText", { font: "elegant", color: "forest", align: "center", size: "large", body: doc(p(t("Ở đâu có tình yêu, ở đó có sự sống", ["italic"]))) }),
  entry("styledText", { font: "sans", color: "sage", align: "right", size: "small", body: body("— Font không chân, hiện đại, căn phải") }),
  entry("styledText", { font: "serif", color: "rose", align: "center", size: "normal", body: body("Font mặc định của blog, màu hồng nhẹ") }),
) as Document;

export default function DevPreview() {
  return (
    <main className="container mx-auto px-6 py-12 max-w-4xl bg-warm-white">
      <PostContent document={demo} />
    </main>
  );
}
