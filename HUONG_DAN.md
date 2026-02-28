# 📖 Hướng Dẫn Sử Dụng AITECH

---

## 🌟 Giới Thiệu

**AITECH** là hệ sinh thái hỗ trợ tự học toàn diện dành cho **học sinh THPT Việt Nam**, được phát triển bởi:

- 💻 **Trần Đình Mạnh Phong** — Tác giả & Developer

### AITECH bao gồm gì?

| Tính năng | Mô tả |
|-----------|-------|
| 📊 **Thực trạng** | 10 thách thức tự học của HS THPT Việt Nam |
| 📚 **Giải pháp** | 11 phương pháp học tập có nghiên cứu khoa học |
| 📂 **Kho tài nguyên** | 22+ tài nguyên theo 8 môn học |
| 💰 **Quản lý chi tiêu** | Theo dõi chi tiêu hàng ngày, biểu đồ thống kê |
| 📅 **Thời khóa biểu** | Lịch học trong tuần, hỗ trợ xuất/in |
| 🎓 **Xếp loại học lực** | Tính điểm TB & xếp loại tự động |
| 🍅 **Pomodoro Timer** | Đếm ngược 25/5, theo dõi phiên học |
| 📝 **Study Planner** | Lập kế hoạch & deadline, ưu tiên mục tiêu |
| 🎯 **Tư vấn nghề nghiệp** | Trắc nghiệm Holland RIASEC + AI tư vấn ngành học |
| 📊 **Đánh giá tự học** | Bài trắc nghiệm 20 câu, biểu đồ radar 7 năng lực |
| 🤖 **Trợ lý AI** | Chatbot Gemini 3 Flash — hỏi đáp, phân tích ảnh bài tập |
| 🛡️ **Phòng chống lừa đảo** | Quiz tình huống, mô phỏng lừa đảo, AI phân tích tin nhắn |
| 🔒 **Kiểm tra an toàn mạng** | Kiểm tra URL đáng ngờ, quét file mã độc bằng VirusTotal |
| 🚫 **Chặn Game & Web xấu** | Phần mềm Windows chặn game, web 18+, cờ bạc — [Tải về](https://drive.google.com/file/d/1wRXFvz-bfEHmKZ03IGtR0QcYS7H7k1ht/view?usp=sharing) |
| 🔐 **Đăng nhập Google** | Firebase Authentication — đăng nhập bằng Google, lưu thông tin user |
| 🎵 **Study Music** | 5 kênh nhạc lofi/study trực tuyến |
| 🌙 **Dark Mode** | Chế độ sáng/tối tự động |

### Công nghệ sử dụng
- HTML, CSS (Tailwind CSS), JavaScript thuần
- Google Gemini 3 Flash API (chatbot AI)
- Firebase Authentication (đăng nhập Google)
- Cloud Firestore (lưu thông tin người dùng)
- VirusTotal (kiểm tra URL & file mã độc)
- localStorage (lưu dữ liệu học tập trên trình duyệt)

---

## 🌐 PHẦN 1: Sử dụng trên Web (GitHub Pages)

> Dành cho người dùng truy cập qua link website đã deploy.

### Truy cập
Mở link website được cung cấp bằng trình duyệt (Chrome, Edge, Firefox, Safari).

### Sử dụng các tính năng

#### 🧭 Điều hướng
- Sử dụng **thanh menu** phía trên để chuyển trang
- Nhấn **✨** (góc dưới phải) để mở chatbot AI
- Nhấn **🎵** (góc dưới trái) để mở nhạc study
- Nhấn **☀️/🌙** để đổi chế độ sáng/tối
- Nhấn **Đăng nhập** trên nav để đăng nhập Google

#### 🔐 Đăng nhập Google (Firebase)
1. Nhấn nút **Đăng nhập** trên thanh điều hướng
2. Chọn tài khoản Google → đăng nhập
3. Sau khi đăng nhập: hiển thị avatar + tên, lưu UID
4. Thông tin được lưu trên Firestore (uid, displayName, email, createdAt)

#### 🤖 Chatbot AI
1. Nhấn nút **✨** → cửa sổ chatbot mở ra
2. Nhập câu hỏi hoặc chọn gợi ý nhanh (Toán THPT, Giảm stress, Kỹ thuật học)
3. Có thể **đính kèm ảnh bài tập** bằng nút 📎 → AI sẽ phân tích
4. Chatbot nhớ ngữ cảnh cuộc trò chuyện

**Khi hết lượt sử dụng (quota):**
1. Nhấn **⚙️** trong chatbot
2. Truy cập [aistudio.google.com/apikey](https://aistudio.google.com/apikey)
3. Đăng nhập Google → nhấn "Create API Key"
4. Dán key vào ô → nhấn "Lưu"
5. API key Gemini **hoàn toàn miễn phí** (15 req/phút)

#### � Kiểm tra an toàn mạng
1. Vào **Ứng dụng** → **Kiểm Tra An Toàn Mạng**
2. **Kiểm tra URL**: Nhập link → nhận điểm an toàn + cảnh báo chi tiết
3. **Quét file**: Kéo thả file → tính SHA-256 hash → tra cứu trên VirusTotal
4. **Mẹo an toàn**: Hướng dẫn nhận biết URL/file/email an toàn

#### 🛡️ Phòng chống lừa đảo
1. Vào **Ứng dụng** → **Phòng Chống Lừa Đảo**
2. Cẩm nang nhận diện 6 loại lừa đảo phổ biến
3. Quiz 10 tình huống thực tế
4. Mô phỏng tin nhắn lừa đảo
5. AI phân tích tin nhắn/email nghi ngờ

#### �💰 Quản lý chi tiêu
1. Vào **Ứng dụng** → **Chi tiêu**
2. Nhập số tiền, chọn danh mục, ngày, ghi chú → nhấn **Thêm**
3. Xem biểu đồ tròn (theo danh mục) và biểu đồ cột (7 ngày)
4. **Xuất JSON** để backup, **Nhập JSON** để khôi phục

#### 📅 Thời khóa biểu
1. Vào **Ứng dụng** → **Thời khóa biểu**
2. Nhấn vào ô trống → nhập môn, phòng, giáo viên, chọn màu → **Lưu**
3. Nhấn ô có sẵn để sửa/xóa
4. Hỗ trợ **In** và **Xuất JSON**

#### 🎓 Xếp loại học lực
1. Vào **Ứng dụng** → **Xếp loại**
2. Nhập điểm HK1, HK2 cho từng môn (thang 10)
3. Chọn xem Kỳ 1 / Kỳ 2 / Cả năm
4. Hệ thống tự xếp loại: Giỏi / Khá / TB / Yếu / Kém

#### 🍅 Pomodoro Timer
1. Vào **Ứng dụng** → **Pomodoro**
2. Cấu hình thời gian (mặc định 25/5/15 phút)
3. Nhấn ▶️ để bắt đầu, hệ thống tự chuyển đổi tập trung ↔ nghỉ
4. Xem biểu đồ phiên hoàn thành 7 ngày

#### 📝 Study Planner
1. Vào **Ứng dụng** → **Study Planner**
2. Nhập tiêu đề, deadline, mức ưu tiên → **Thêm**
3. Tick ✅ khi hoàn thành, lọc theo trạng thái
4. Mục tiêu quá hạn tự đánh dấu đỏ

#### 🎯 Tư vấn nghề nghiệp
1. Vào **Ứng dụng** → **Tư Vấn Nghề Nghiệp**
2. Làm trắc nghiệm Holland RIASEC
3. AI phân tích kết quả + gợi ý ngành học, trường ĐH phù hợp

#### 📊 Đánh giá năng lực tự học
1. Vào **Đánh giá** từ menu hoặc nút trên trang chủ
2. Trả lời 20 câu (thang 1–5)
3. Xem biểu đồ radar 7 nhóm năng lực + gợi ý cải thiện

### 🔒 Lưu ý về dữ liệu
- Dữ liệu học tập lưu **trên trình duyệt** của bạn (localStorage)
- Thông tin đăng nhập lưu trên **Firebase** (cloud)
- Mỗi trình duyệt/máy tính có dữ liệu học tập **riêng biệt**
- Dữ liệu **không mất** khi tắt trình duyệt hay reload trang
- **Chỉ mất** khi xóa dữ liệu duyệt web → nên **Xuất JSON** backup thường xuyên

---

## 💻 PHẦN 2: Clone về máy (dành cho developer)

> Dành cho người muốn tải mã nguồn về tùy chỉnh hoặc chạy offline.

### Bước 1: Clone mã nguồn
```bash
git clone https://github.com/<username>/aitech.git
cd aitech
```

### Bước 2: Mở trang web
Mở file `index.html` bằng trình duyệt — **không cần cài thêm gì!**

Hoặc dùng Live Server (nếu dùng VS Code):
1. Cài extension **Live Server**
2. Chuột phải `index.html` → **Open with Live Server**

### Bước 3: Cấu hình Firebase (tuỳ chọn)
1. Vào [console.firebase.google.com](https://console.firebase.google.com) → tạo project
2. Register web app → copy config
3. Mở `firebase-config.js` → thay `FIREBASE_CONFIG` bằng config thật
4. Bật **Google sign-in** trong Authentication
5. Tạo **Firestore Database** (test mode)
6. Thêm domain vào **Authorized domains**

### Bước 4: Cấu hình API key (tùy chọn)
Mở `aitech.js`, tìm dòng ~274:
```javascript
const NS_DEFAULT_API_KEY = 'AIza...';
```
- **Giữ nguyên**: tất cả người dùng dùng key sẵn có
- **Thay key riêng**: lấy key tại [aistudio.google.com/apikey](https://aistudio.google.com/apikey)
- **Xóa trống** (`''`): người dùng tự nhập key khi dùng chatbot

### Bước 5: Tùy chỉnh (tùy chọn)

| File | Vai trò |
|------|---------|
| `aitech.js` | Cấu hình API, theme, chatbot, nhạc, data isolation |
| `aitech.css` | Giao diện, animation, font size |
| `firebase-config.js` | Cấu hình Firebase Auth + Firestore |
| `index.html` | Trang chủ, chatbot modal, nút đăng nhập |
| `apps/*.html` | 9 ứng dụng học tập & an ninh mạng |
| `1.png` | Ảnh hero trang chủ (thay ảnh trường bạn) |

### Bước 6: Deploy lên GitHub Pages
```bash
git add .
git commit -m "AITECH update"
git push origin main
```
Sau đó vào **Settings** → **Pages** → chọn branch `main` → **Save**.

### Cấu trúc dự án
```
aitech/
├── index.html               ← Trang chủ + Chatbot + Đăng nhập
├── thuctrang.html            ← Thực trạng
├── giaiphap.html             ← Giải pháp & Phương pháp
├── portal_tai_nguyen.html    ← Kho tài nguyên
├── about.html                ← Về AITECH
├── apps.html                 ← Hub ứng dụng
├── assessment.html           ← Đánh giá năng lực
├── aitech.css                ← CSS chung
├── aitech.js                 ← JS chung (AI, theme, nhạc, storage)
├── firebase-config.js        ← Firebase Auth + Firestore
├── 1.png                     ← Ảnh hero
├── README.md                 ← File này
├── HUONG_DAN.md              ← Hướng dẫn chi tiết
├── tools/
│   └── AITECHBlocker.cmd     ← Tool chặn game/web ([Tải về](https://drive.google.com/file/d/1wRXFvz-bfEHmKZ03IGtR0QcYS7H7k1ht/view?usp=sharing))
└── apps/
    ├── chi-tieu.html         ← Quản lý chi tiêu
    ├── thoi-khoa-bieu.html   ← Thời khóa biểu
    ├── xep-loai.html         ← Xếp loại học lực
    ├── pomodoro.html         ← Pomodoro Timer
    ├── study-planner.html    ← Study Planner
    ├── tu-van-nghe-nghiep.html ← Tư vấn nghề nghiệp AI
    ├── phong-chong-lua-dao.html ← Phòng chống lừa đảo
    ├── kiem-tra-an-toan.html ← Kiểm tra an toàn mạng
    └── chan-web.html          ← Chặn Game & Web xấu
```

---

## ❓ Câu Hỏi Thường Gặp

**Dữ liệu có bị mất khi đổi máy không?**
→ Dữ liệu localStorage có. Dùng **Xuất JSON** để backup. Dữ liệu đăng nhập Firebase thì không mất.

**Chatbot có miễn phí không?**
→ Có! Gemini API free tier cho 15 requests/phút.

**Cần internet không?**
→ Các app (chi tiêu, TKB, điểm, planner) hoạt động **offline**. Chatbot AI, nhạc, đăng nhập, kiểm tra an toàn mạng cần internet.

**Firebase có miễn phí không?**
→ Có! Firebase free tier (Spark plan) đủ dùng cho dự án học sinh.

**Muốn đóng góp?**
→ Fork → tạo branch → commit → Pull Request!

---

> **AITECH** © 2026 — Học đường số dành cho học sinh THPT Việt Nam 💜
