# Tài liệu Cấu trúc Dữ liệu Transcript (ListeningTranscript.json)

Tài liệu này mô tả chi tiết schema JSON được tạo ra từ công cụ AI Extract Transcript, nhằm hỗ trợ lập trình viên Frontend xây dựng interface (TypeScript) và lên ý tưởng thiết kế giao diện (UI) cho Web App.

## 1. TypeScript Interface

Để render giao diện hiệu quả trong ứng dụng React/Next.js, bạn có thể khai báo kiểu dữ liệu như sau:

```typescript
// Định nghĩa một dòng thoại đơn lẻ
export interface DialogueLine {
  /**
   * Tên của người nói. 
   * Có thể mang giá trị null nếu dòng đó là tiêu đề, dẫn truyện (narrator), 
   * hoặc chỉ dẫn của hệ thống băng thu âm.
   * Ví dụ: "SARAH", "FATHER", null
   */
  speaker: string | null;

  /**
   * Nội dung câu nói dạng HTML.
   * LƯU Ý: Chuỗi này ĐÃ BAO GỒM các thẻ HTML nội tuyến như <strong> hoặc <b> 
   * để in đậm từ vựng đáp án và số thứ tự câu hỏi. 
   * Vì vậy, ở Frontend cần phải render bằng `dangerouslySetInnerHTML` (React).
   * Ví dụ: "All sorts. For example, design a special cover for an <strong>egg (Q1)</strong>."
   */
  text: string;
}

// Định nghĩa dữ liệu của 1 Part (ví dụ Part 1, Part 2...)
export interface TranscriptPart {
  partNumber: number; // Đánh số từ 1 đến 4
  dialogues: DialogueLine[]; // Danh sách tuần tự các câu thoại
}

// Root Schema của toàn bộ 1 bài Transcript
export interface ListeningTranscript {
  testCode: string; // Mã bài thi (VD: "CAMBRIDGE_IELTS_16_LISTENING_TEST_1")
  parts: TranscriptPart[]; // Mảng chứa 4 phần hội thoại
}
```

## 2. Dữ liệu JSON Mẫu (Snippet)

```json
{
  "testCode": "CAMBRIDGE_IELTS_16_LISTENING_TEST_1",
  "parts": [
    {
      "partNumber": 1,
      "dialogues": [
        {
          "text": "Hello. Children’s Engineering Workshops.",
          "speaker": "SARAH"
        },
        {
          "text": "Oh hello. I wanted some information about the workshops in the school holidays.",
          "speaker": "FATHER"
        },
        {
          "text": "All sorts. For example, they work together to design a special cover that goes round an <strong>egg (Q1)</strong>, so that when it’s inside they can drop it from a height and it doesn’t break. Well, sometimes it does break but that’s part of the fun!",
          "speaker": "SARAH"
        }
      ]
    }
  ]
}
```

## 3. Ý tưởng Thiết kế UI (Split-Screen Layout)

Để tối ưu hóa trải nghiệm học tập và thực hành, giao diện ứng dụng nên được thiết kế theo dạng **Chia Đôi Màn Hình (Split-Screen)**. Người dùng có thể vừa nghe, vừa đọc transcript, và vừa điền đáp án cùng một lúc mà không cần phải chuyển tab.

### 3.1. Layout Tổng Quan
*   **Màn hình được chia làm 2 cột (ví dụ tỉ lệ 40:60 hoặc 50:50):**
    *   **Cột Trái (Transcript / Khung Chat):** Nơi hiển thị nội dung hội thoại đang diễn ra dưới dạng khung chat.
    *   **Cột Phải (Bài Test):** Nơi hiển thị các câu hỏi (Multiple Choice, Map Labelling, Fill in the Blanks...) để người dùng tương tác và điền đáp án.
*   **Thanh điều khiển Audio (Player):** Đặt ở dưới cùng (Sticky Footer) hoặc cố định trên cùng để tiện tua đi tua lại bất kể đang cuộn ở cột nào.

### 3.2. Thiết Kế Cột Trái: Transcript dạng Khung Chat
Thay vì hiển thị văn bản kéo dài như trang blog nhàm chán, hãy dùng UI giống iMessage hoặc Messenger:
1. **Bong bóng Chat (Chat Bubbles):**
   * Xác định xen kẽ hai người nói (VD: `SARAH` ở bên trái, `FATHER` ở bên phải).
   * Có thể đính kèm các Icon/Avatar giả định (ví dụ avatar Nam/Nữ/Giáo viên) dựa theo tên `speaker` hoặc tạo icon tự động theo chữ cái đầu (VD: chữ S cho SARAH).
2. **Xử lý Dẫn Truyện (Narrator):**
   * Nếu `speaker` là `null`, render dòng chữ đó nằm ở **chính giữa** màn hình với định dạng chữ nghiêng (`italic`) và nền xám mờ để mô phỏng sự ngắt nhịp cảnh hoặc giọng giới thiệu của đài cassette.
3. **CSS Highlight cho Đáp án:**
   * Các từ khóa đáp án đã được chèn sẵn thẻ `<strong>` hoặc `<b>` (ví dụ `<strong>egg (Q1)</strong>`). 
   * Hãy dùng CSS tùy biến để nhắm mục tiêu vào các thẻ này bên trong bong bóng chat.
   * **CSS gợi ý:**
     ```css
     .transcript-dialogue strong {
       background-color: #fffae6; /* Màu vàng highlight nhẹ */
       color: #d97706; /* Màu cam đậm */
       padding: 2px 4px;
       border-radius: 4px;
       font-weight: 600;
       border-bottom: 2px solid #fbbf24;
       cursor: pointer;
     }
     .transcript-dialogue strong:hover {
       background-color: #fef3c7; /* Hiệu ứng hover nổi bật */
     }
     ```
   * Khi đó, đáp án sẽ rực sáng lên trên nền chữ, giúp học viên dễ dàng đối chiếu chữ "egg" bên cột Transcript với ô điền đáp án bên cột Bài Test.

### 3.3. Tương tác Nâng Cao (Tính năng đề xuất)
*   **Auto-Scroll (Cuộn tự động):** Khi file Audio đang phát đến mốc thời gian nào, cột Chat sẽ tự động cuộn (scroll) đến câu thoại tương ứng, đồng thời cột Bài Test cũng cuộn đến nhóm câu hỏi hiện tại.
*   **Highlight chéo (Cross-Highlight):** Khi học viên di chuột (hover) vào cụm `<strong>egg (Q1)</strong>` ở khung chat bên trái, câu hỏi số 1 bên khung bài test bên phải cũng sẽ tự động phát sáng để học viên nhận diện được mối liên hệ.
