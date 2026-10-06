import { PiLeafDuotone } from "react-icons/pi";
import { FiChevronDown } from "react-icons/fi";

// An end-of-post note, kept quiet (small, muted, collapsed) so it doesn't pull
// attention away from the post itself. Uses native <details>, no client JS.
export default function PostDisclaimer() {
  return (
    <aside
      aria-label="Lưu ý của tác giả"
      className="not-prose mt-20 mb-6 mx-auto max-w-xl text-center"
    >
      <div className="flex items-center justify-center gap-3 text-moss" aria-hidden="true">
        <span className="h-px w-16 bg-gradient-to-r from-transparent to-moss/30" />
        <PiLeafDuotone className="text-base" />
        <span className="h-px w-16 bg-gradient-to-l from-transparent to-moss/30" />
      </div>

      <details className="group mt-4">
        <summary className="list-none cursor-pointer [&::-webkit-details-marker]:hidden">
          <span className="block text-[0.7rem] uppercase tracking-[0.2em] font-semibold text-forest">
            Đôi lời ngỏ
          </span>
          <span className="mt-2 block text-sm italic leading-relaxed text-forest/80">
            Những gì mình chia sẻ là góc nhìn và trải nghiệm cá nhân, không
            thay thế lời khuyên y tế hay tư vấn tâm lý chuyên nghiệp.
          </span>
          <span className="mt-3 inline-flex items-center gap-1 text-xs text-moss hover:text-forest transition-colors">
            <span className="group-open:hidden">Đọc thêm</span>
            <span className="hidden group-open:inline">Thu gọn</span>
            <FiChevronDown className="transition-transform duration-300 group-open:rotate-180" />
          </span>
        </summary>

        <div className="mt-5 rounded-2xl bg-cream/60 px-5 py-6 sm:px-8 text-left text-sm leading-relaxed text-forest/80 space-y-4">
          <p>
            Chào bạn, cảm ơn bạn đã ghé thăm góc nhỏ của mình — nơi mình lưu giữ
            những câu chuyện, trải nghiệm và những chiêm nghiệm trên hành trình
            khám phá bản thân. Mình có vài lưu ý nhỏ sau, để chúng ta có thể
            đồng hành cùng nhau một cách trọn vẹn nhất nhe:
          </p>

          <div>
            <p className="font-semibold text-moss">Về những câu chuyện</p>
            <p>
              Tất cả nội dung tại đây (dù là bài viết, âm thanh hay hình ảnh)
              đều là những góc nhìn cá nhân, những nghiên cứu và trải nghiệm
              thực tế mà mình đã đi qua. Đây là không gian để chúng ta cùng suy
              ngẫm, không phải là một kênh cung cấp lời khuyên y tế hay tư vấn
              tâm lý chuyên nghiệp.
            </p>
          </div>

          <div>
            <p className="font-semibold text-moss">Về sức khỏe và sự an yên của bạn</p>
            <p>
              Những gì mình chia sẻ không nhằm mục đích chẩn đoán, điều trị hay
              thay thế bất kỳ phác đồ y khoa nào. Mỗi người là một cá thể duy
              nhất với những phản ứng và cảm nhận khác biệt. Vì vậy, nếu bạn
              đang gặp vấn đề về sức khỏe thể chất hay tâm lý, hãy luôn ưu tiên
              tham vấn ý kiến từ các bác sĩ hoặc chuyên gia có chuyên môn.
            </p>
          </div>

          <div>
            <p className="font-semibold text-moss">Về các phương pháp năng lượng</p>
            <p>
              Những trải nghiệm về năng lượng hay tinh thần mà mình nhắc đến
              mang tính cá nhân và có thể mang lại kết quả khác nhau tùy mỗi
              người. Bạn là người hiểu rõ bản thân mình nhất, vì vậy hãy luôn
              lắng nghe cơ thể và chủ động chịu trách nhiệm cho mọi quyết định
              chăm sóc sức khỏe của chính mình.
            </p>
          </div>

          <p className="pt-4 border-t border-moss/15 italic text-center text-forest/70">
            Mình luôn khuyến khích bạn kết hợp việc tìm hiểu cá nhân với sự hỗ
            trợ từ các đơn vị y tế chuyên nghiệp để có một hành trình chữa lành
            bền vững nhất nhé. 🌿
          </p>
        </div>
      </details>
    </aside>
  );
}
