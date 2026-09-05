# 🎓 HỆ THỐNG THIỆP MỜI LỄ TỐT NGHIỆP CÁ NHÂN HÓA (GRADUATION INVITATION PLATFORM)

Hệ thống Website thiệp mời lễ tốt nghiệp điện tử cao cấp, hiện đại, mang phong cách hoàng gia/champagne gold sang trọng, có animation mở thiệp mượt mà, xác nhận RSVP realtime và trang quản trị Admin trực quan.

---

## 🌟 TÍNH NĂNG NỔI BẬT

### 1. Trải nghiệm Khách Mời (Guest Experience)
- **Cá nhân hóa theo token riêng**: Mỗi khách có một đường dẫn bảo mật duy nhất dạng `https://domain.com/invite/{token}` (Ví dụ: `/invite/a8K2x9`). Không thể tự đổi tên qua query string.
- **Hiệu ứng Mở Thiệp (Hero Envelope & Wax Seal)**: Màn hình mở đầu sang trọng với phong bì hoàng gia, nón cử nhân, nút mở thiệp phát pháo hoa confetti và tự động phát nhạc nền nhẹ nhàng.
- **Lời chào cá nhân hóa (Personalized Greeting)**: *"Thân mời Nguyễn Văn A"*, kèm cảm nghĩ chân thành từ Tân Cử Nhân.
- **Thông tin Lễ Tốt Nghiệp chi tiết**: Thời gian, địa điểm hội trường, chỉ dẫn dress code và nút bấm mở Google Maps dẫn đường trực tiếp.
- **Đếm ngược thời gian thực (Realtime Countdown)**: Tính toán chính xác theo múi giờ, hiệu ứng chuyển số mượt mà.
- **Lịch trình buổi lễ (Interactive Timeline)**: Hiệu ứng cuộn hiển thị các mốc đón khách, trao bằng, chụp ảnh, tiệc mừng.
- **Thư viện ảnh kỷ niệm (Gallery & Lightbox)**: Lưới ảnh thanh xuân với chế độ xem ảnh toàn màn hình (Lightbox), chuyển ảnh bàn phím.
- **Xác nhận tham dự (RSVP)**:
  - Chọn *Sẽ tham dự* hoặc *Không thể đến*.
  - Lựa chọn số người đi cùng (Pax: 1, 2, 3...).
  - Gửi lời nhắn riêng và kích hoạt hiệu ứng chúc mừng Confetti.
- **Sổ lưu bút chúc mừng (Wishes Wall)**: Xem lời chúc từ mọi người, gợi ý lời chúc nhanh và gửi lời chúc trực tiếp.
- **Trình phát nhạc nền (Audio Player)**: Nút bật/tắt nhạc nổi với hiệu ứng đĩa than quay nhẹ nhàng.

### 2. Nghiệp vụ Quản trị (Admin Dashboard)
- **Bảo mật JWT**: Đăng nhập Admin với mật khẩu mã hóa bcrypt.
- **Dashboard Thống kê & Biểu đồ**:
  - Tổng số khách mời, tổng số lượng người tham dự dự kiến (Pax).
  - Tỷ lệ mở thiệp (Đã mở / Chưa mở).
  - Phân bổ trạng thái RSVP (Sẽ tham dự / Không thể tham dự / Chưa phản hồi).
- **Quản lý Khách Mời**:
  - Thêm, sửa, xóa thông tin khách.
  - Tự động sinh mã `inviteToken` ngẫu nhiên, bảo mật, không trùng lặp.
  - Sao chép nhanh đường dẫn thiệp của từng khách chỉ với 1 click.
  - Tìm kiếm theo tên, email, số điện thoại, token.
  - Lọc theo trạng thái RSVP và trạng thái đã mở thiệp.
  - **Import danh sách hàng loạt từ file CSV**.
- **Cấu hình Sự kiện (Event Settings)**: Thay đổi tên cử nhân, ngày giờ, địa điểm, Google Maps, ảnh bìa, avatar, nhạc nền MP3, Dress code.
- **Quản lý Lịch trình & Thư viện ảnh**: Thêm mốc thời gian, tải ảnh kỷ niệm lên thiệp.
- **Kiểm duyệt Lời chúc (Messages Moderation)**: Quản lý và xóa các lời chúc không phù hợp.

---

## 🛠 TECH STACK

| Thành phần | Công nghệ sử dụng |
|---|---|
| **Frontend** | Next.js 14 (App Router), TypeScript, Tailwind CSS, Framer Motion, Lucide React, Canvas Confetti, Recharts |
| **Backend** | Node.js, Express.js, TypeScript, Prisma ORM, JWT, Bcryptjs, Zod, Helmet, Cors, Express Rate Limit |
| **Database** | PostgreSQL 16 |
| **DevOps & Deploy** | Docker, Docker Compose, Nginx Reverse Proxy |

---

## 📁 CẤU TRÚC THƯ MỤC (MONOREPO)

```
INVITE-GRADUATION/
├── frontend/                     # Next.js 14 App Router Frontend
│   ├── app/
│   │   ├── admin/               # Admin pages (dashboard, events, guests, gallery, etc.)
│   │   ├── invite/[token]/      # Personalized guest invitation page
│   │   ├── globals.css          # Styling & Google Fonts
│   │   ├── layout.tsx
│   │   └── page.tsx             # Demo landing & guest picker
│   ├── components/
│   │   ├── admin/               # Admin UI components
│   │   ├── invitation/          # Envelope, Greeting, RSVP, Timeline, Gallery, Wishes
│   │   └── ui/                  # Toast, Modal, Skeleton
│   ├── hooks/                   # useCountdown, useAudio, useToast
│   ├── lib/                     # API client, utility functions
│   ├── services/                # Invitation & Admin API services
│   ├── types/                   # TypeScript interfaces
│   ├── Dockerfile
│   └── package.json
│
├── backend/                      # Express.js REST API Backend
│   ├── prisma/
│   │   ├── schema.prisma        # Database schema
│   │   └── seed.ts              # Seed data for demo
│   ├── src/
│   │   ├── config/              # App configuration
│   │   ├── controllers/         # Request handlers
│   │   ├── middleware/          # Auth, validation, error handling, rate limiting
│   │   ├── routes/              # Express API routes
│   │   ├── services/            # Business logic
│   │   ├── utils/               # ApiResponse, TokenGenerator
│   │   ├── app.ts
│   │   └── server.ts
│   ├── Dockerfile
│   └── package.json
│
├── nginx/
│   └── nginx.conf               # Nginx Reverse Proxy configuration
├── docker-compose.yml           # Production orchestration (Postgres + Backend + Frontend + Nginx)
├── .env.example
├── package.json                 # Monorepo runner scripts
└── README.md
```

---

## 🗄 DATABASE SCHEMA (PRISMA POSTGRESQL)

```mermaid
erDiagram
    ADMIN {
        string id PK
        string username UK
        string passwordHash
        datetime createdAt
        datetime updatedAt
    }

    EVENT {
        string id PK
        string title
        string graduateName
        text graduateMessage
        text description
        datetime eventDate
        string startTime
        string endTime
        string venueName
        string venueAddress
        float latitude
        float longitude
        text googleMapUrl
        text coverImage
        text avatarImage
        text backgroundMusic
        string dressCode
        enum status
    }

    GUEST {
        string id PK
        string eventId FK
        string name
        string email
        string phone
        string inviteToken UK
        int numberOfGuests
        string relationship
        enum rsvpStatus
        text rsvpMessage
        datetime openedAt
        datetime confirmedAt
    }

    TIMELINE {
        string id PK
        string eventId FK
        string time
        string title
        text description
        string icon
        int sortOrder
    }

    GALLERY {
        string id PK
        string eventId FK
        text imageUrl
        string caption
        int sortOrder
    }

    MESSAGE {
        string id PK
        string eventId FK
        string guestId FK
        string guestName
        text content
        datetime createdAt
    }

    EVENT ||--o{ GUEST : has
    EVENT ||--o{ TIMELINE : schedules
    EVENT ||--o{ GALLERY : displays
    EVENT ||--o{ MESSAGE : contains
    GUEST ||--o{ MESSAGE : writes
```

---

## 🚀 HƯỚNG DẪN CHẠY LOCAL (DEVELOPMENT)

### Yêu cầu môi trường
- Node.js >= 18.x
- npm >= 9.x
- PostgreSQL server (hoặc chạy qua Docker)

---

### Bước 1: Cài đặt Dependencies

Tại thư mục gốc `INVITE-GRADUATION`:

```bash
# Cài đặt backend
cd backend
npm install

# Cài đặt frontend
cd ../frontend
npm install
```

---

### Bước 2: Cấu hình biến môi trường (.env)

Tạo file `.env` trong thư mục `backend/`:
```env
PORT=5000
NODE_ENV=development
DATABASE_URL="postgresql://postgres:postgres123@localhost:5432/graduation_db?schema=public"
JWT_SECRET="super_secret_graduation_jwt_key_2026_change_in_production"
JWT_EXPIRES_IN=7d
CORS_ORIGIN=http://localhost:3000
FRONTEND_URL=http://localhost:3000
```

Tạo file `.env.local` trong thư mục `frontend/`:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

### Bước 3: Khởi tạo Database & Seed dữ liệu mẫu

```bash
cd backend

# Đẩy schema lên database
npm run prisma:push

# Chạy seed dữ liệu demo (Admin, Lễ tốt nghiệp Lương Đức Quý, 5 khách mời, timeline, gallery, messages)
npm run prisma:seed
```

---

### Bước 4: Chạy đồng thời Backend & Frontend

**Terminal 1 (Backend):**
```bash
cd backend
npm run dev
# API chạy tại http://localhost:5000
```

**Terminal 2 (Frontend):**
```bash
cd frontend
npm run dev
# Giao diện chạy tại http://localhost:3000
```

---

## 🔑 TÀI KHOẢN & ĐƯỜNG DẪN DEMO

### 1. Tài khoản Quản trị (Admin)
- **URL Admin Login**: `http://localhost:3000/admin/login`
- **Username**: `admin`
- **Password**: `Admin@123456`

### 2. Danh sách Thiệp Mời Demo (5 Khách)

| Tên Khách Mời | Mối Quan Hệ | Token | URL Thiệp Mời Riêng | Trạng Thái Mẫu |
|---|---|---|---|---|
| **Nguyễn Văn A** | Bạn thân Đại học | `a8K2x9` | `http://localhost:3000/invite/a8K2x9` | Đã xác nhận tham dự (2 pax) |
| **Trần Văn B** | Đồng nghiệp | `b7L3y1` | `http://localhost:3000/invite/b7L3y1` | Chưa phản hồi (Pending) |
| **Lê Thị C** | Gia đình | `c6M4z2` | `http://localhost:3000/invite/c6M4z2` | Đã xác nhận tham dự (3 pax) |
| **Phạm Văn D** | Thầy cô / Mentor | `d5N5w3` | `http://localhost:3000/invite/d5N5w3` | Không thể đến |
| **Hoàng Thị E** | Bạn cấp 3 | `e4P6v4` | `http://localhost:3000/invite/e4P6v4` | Chưa mở thiệp |

---

## 🐳 TRIỂN KHAI BẰNG DOCKER & DOCKER COMPOSE

Hệ thống đã được đóng gói sẵn toàn bộ PostgreSQL, Backend, Frontend và Nginx Reverse Proxy:

```bash
# 1. Khởi động toàn bộ dịch vụ
docker compose up -d --build

# 2. Chạy migrate và seed database trong container backend
docker compose exec backend npx prisma db push
docker compose exec backend npm run prisma:seed

# 3. Truy cập hệ thống:
# Website & Thiệp mời: http://localhost (Port 80 Nginx)
# Admin Portal: http://localhost/admin/login
```

Để dừng các dịch vụ:
```bash
docker compose down
```

---

## 📡 API DOCUMENTATION (RESTful)

### 1. Authentication
- `POST /api/auth/login`: Đăng nhập admin và nhận JWT token.
- `GET /api/auth/me`: Kiểm tra thông tin phiên đăng nhập admin (Bearer token).

### 2. Events (Sự kiện)
- `GET /api/events/primary`: Lấy thông tin sự kiện tốt nghiệp chính (Public).
- `GET /api/events`: Lấy danh sách sự kiện (Admin).
- `GET /api/events/:id`: Lấy chi tiết sự kiện theo ID.
- `POST /api/events`: Tạo sự kiện mới (Admin).
- `PUT /api/events/:id`: Cập nhật sự kiện (Admin).
- `DELETE /api/events/:id`: Xóa sự kiện (Admin).

### 3. Guests (Khách mời)
- `GET /api/guests`: Danh sách khách mời có phân trang, tìm kiếm, lọc RSVP (Admin).
- `POST /api/guests`: Thêm khách mời mới và tự sinh `inviteToken` (Admin).
- `POST /api/guests/import`: Import danh sách khách từ mảng JSON/CSV (Admin).
- `PUT /api/guests/:id`: Cập nhật thông tin khách mời (Admin).
- `DELETE /api/guests/:id`: Xóa khách mời (Admin).

### 4. Invitations (Khách mở thiệp qua Token - Public)
- `GET /api/invitations/:token`: Lấy thông tin cá nhân hóa của khách và sự kiện. Tự động ghi nhận `openedAt`.
- `POST /api/invitations/:token/rsvp`: Gửi phản hồi RSVP (`ATTENDING` / `NOT_ATTENDING`), số lượng người tham dự, lời nhắn.
- `GET /api/invitations/:token/messages`: Lấy danh sách lời chúc trên sổ lưu bút.
- `POST /api/invitations/:token/messages`: Đăng lời chúc mới.

### 5. Statistics (Thống kê)
- `GET /api/stats`: Thống kê tổng khách, tỷ lệ mở, phân bổ RSVP cho biểu đồ Dashboard (Admin).

---

## 🧪 CHECKLIST KIỂM THỬ TOÀN BỘ NGHIỆP VỤ

- [x] **Xác thực Token**: Truy cập `/invite/a8K2x9` hiển thị đúng tên *"Nguyễn Văn A"*.
- [x] **Chặn Fake Token**: Truy cập token không tồn tại `/invite/invalid-xyz` hiển thị trang thông báo lỗi rõ ràng.
- [x] **Hiệu ứng Mở thiệp**: Click *"Mở Thiệp Mời"* bung hiệu ứng Envelope + Confetti + bắt đầu phát nhạc nền.
- [x] **Đếm ngược thời gian**: Countdown hiển thị chính xác theo thời gian sự kiện 20/09/2026 18:30.
- [x] **Tương tác Gallery**: Click vào ảnh mở Lightbox full màn hình, chuyển ảnh bằng mũi tên.
- [x] **RSVP Xác nhận**: Chọn *Sẽ tham dự* -> cập nhật realtime vào database và hiển thị phản hồi tức thì.
- [x] **Sổ lưu bút**: Gửi lời chúc mới -> hiển thị ngay trên danh sách lời chúc.
- [x] **Admin Dashboard**: Xem biểu đồ phân bổ RSVP, tỷ lệ mở thiệp, số pax tham dự.
- [x] **Quản lý Khách & Copy Link**: Click nút copy link thiệp riêng -> link được lưu vào Clipboard.
- [x] **Import CSV**: Dán danh sách CSV -> hệ thống tự tạo token riêng và lưu vào database.
- [x] **Docker Compose & Nginx**: Build image thành công, Nginx proxy port 80 cho cả Frontend và Backend.
