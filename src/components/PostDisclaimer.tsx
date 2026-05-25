import { PiLeafDuotone } from "react-icons/pi";

export default function PostDisclaimer() {
  return (
    <aside
      aria-label="Lưu ý của tác giả"
      className="not-prose mt-16 mb-4 rounded-3xl border border-moss/20 bg-gradient-to-br from-cream/60 via-warm-white to-sage/10 p-6 sm:p-8 md:p-10"
    >
      <div>
        <div className="flex items-center gap-3 mb-4">
          <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-moss/15 text-moss text-xl">
            <PiLeafDuotone />
          </span>
          <h3 className="text-xl sm:text-2xl font-bold text-forest m-0">
            Đôi lời ngỏ
          </h3>
        </div>

        <p className="text-sm sm:text-base text-forest/80 leading-relaxed mb-3">
          Chào bạn, cảm ơn bạn đã ghé thăm góc nhỏ của mình — nơi mình lưu giữ
          những câu chuyện, trải nghiệm và những chiêm nghiệm trên hành trình
          khám phá bản thân.
        </p>
        <p className="text-sm sm:text-base text-forest/80 leading-relaxed mb-6">
          Mình có vài lưu ý nhỏ sau, để chúng ta có thể đồng hành cùng nhau một
          cách trọn vẹn nhất nhe:
        </p>

        <dl className="space-y-5">
          <div>
            <dt className="text-sm sm:text-base font-semibold text-moss mb-1">
              Về những câu chuyện
            </dt>
            <dd className="text-sm sm:text-base text-forest/75 leading-relaxed">
              Tất cả nội dung tại đây (dù là bài viết, âm thanh hay hình ảnh)
              đều là những góc nhìn cá nhân, những nghiên cứu và trải nghiệm
              thực tế mà mình đã đi qua. Đây là không gian để chúng ta cùng suy
              ngẫm, không phải là một kênh cung cấp lời khuyên y tế hay tư vấn
              tâm lý chuyên nghiệp.
            </dd>
          </div>

          <div>
            <dt className="text-sm sm:text-base font-semibold text-moss mb-1">
              Về sức khỏe và sự an yên của bạn
            </dt>
            <dd className="text-sm sm:text-base text-forest/75 leading-relaxed">
              Những gì mình chia sẻ không nhằm mục đích chẩn đoán, điều trị hay
              thay thế bất kỳ phác đồ y khoa nào. Mỗi người là một cá thể duy
              nhất với những phản ứng và cảm nhận khác biệt. Vì vậy, nếu bạn
              đang gặp vấn đề về sức khỏe thể chất hay tâm lý, hãy luôn ưu tiên
              tham vấn ý kiến từ các bác sĩ hoặc chuyên gia có chuyên môn.
            </dd>
          </div>

          <div>
            <dt className="text-sm sm:text-base font-semibold text-moss mb-1">
              Về các phương pháp năng lượng
            </dt>
            <dd className="text-sm sm:text-base text-forest/75 leading-relaxed">
              Những trải nghiệm về năng lượng hay tinh thần mà mình nhắc đến
              mang tính cá nhân và có thể mang lại kết quả khác nhau tùy mỗi
              người. Bạn là người hiểu rõ bản thân mình nhất, vì vậy hãy luôn
              lắng nghe cơ thể và chủ động chịu trách nhiệm cho mọi quyết định
              chăm sóc sức khỏe của chính mình.
            </dd>
          </div>
        </dl>

        <div className="mt-6 pt-5 border-t border-moss/15">
          <p className="text-sm sm:text-base italic text-forest/70 leading-relaxed">
            Mình luôn khuyến khích bạn kết hợp việc tìm hiểu cá nhân với sự hỗ
            trợ từ các đơn vị y tế chuyên nghiệp để có một hành trình chữa lành
            bền vững nhất nhé. 🌿
          </p>
        </div>
      </div>
    </aside>
  );
}
