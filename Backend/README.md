# Smart Travel Backend API

Hệ thống Backend API cho ứng dụng Smart Travel (quản lý người dùng, vận chuyển và vé), xây dựng bằng Django + Django REST Framework, JWT Auth, tài liệu Swagger.

## 📋 Mục lục

- [Yêu cầu hệ thống](#yêu-cầu-hệ-thống)
- [Cài đặt](#cài-đặt)
- [Cấu hình](#cấu-hình)
- [Chạy dự án](#chạy-dự-án)
- [Tài liệu API](#tài-liệu-api)
- [Các endpoint chính](#các-endpoint-chính)
- [Cấu trúc dự án](#cấu-trúc-dự-án)
- [Các lệnh hữu ích](#các-lệnh-hữu-ích)
- [Ghi chú bảo mật](#ghi-chú-bảo-mật)

## 🔧 Yêu cầu hệ thống

- Python >= 3.8
- pip, virtualenv (khuyến nghị)
- PostgreSQL (chỉ cần nếu chạy cấu hình `dev/prod`)

> Mặc định `core/settings/base.py` dùng SQLite để chạy nhanh trong môi trường phát triển.

## 📦 Cài đặt

```bash
cd Backend
python3 -m venv venv
source venv/bin/activate   # macOS/Linux
# venv\Scripts\activate   # Windows
pip install -r requirements.txt
```

## ⚙️ Cấu hình

Tạo file `.env` (tùy chọn nếu muốn override DB/ENV):

```env
# dev | prod
DJANGO_ENV=dev

# Đổi trong production!
SECRET_KEY=your-secret-key-here-change-in-production

# PostgreSQL (nếu không dùng SQLite)
DB_NAME=testserver
DB_USER=devuser
DB_PASSWORD=123
DB_HOST=localhost
DB_PORT=5432
```

Ghi chú môi trường:
- `core/settings/base.py`: SQLite, bật CORS all origins cho dev, JWT config, tắt CSRF bằng middleware `utils.csrf_middleware.DisableCSRFMiddleware` cho API.
- `core/settings/dev.py`, `core/settings/prod.py`: mở rộng khi cần.

## 🚀 Chạy dự án

```bash
python manage.py makemigrations
python manage.py migrate
python manage.py runserver
```

URLs mặc định:
- Trang chủ: `http://localhost:8000/`
- API Root: `http://localhost:8000/api/`
- Admin: `http://localhost:8000/admin/`
- Swagger: `http://localhost:8000/swagger/`
- ReDoc: `http://localhost:8000/redoc/`

## 📚 Tài liệu API

- Swagger UI: `http://localhost:8000/swagger/`
- ReDoc: `http://localhost:8000/redoc/`

## 🔑 Các endpoint chính

Authentication (`/api/auth/`):
- `POST /api/auth/register/` — Đăng ký
- `POST /api/auth/login/` — Đăng nhập (JWT)
- `POST /api/auth/logout/` — Đăng xuất
- `POST /api/auth/token/refresh/` — Refresh Token
- `GET  /api/auth/profile/` — Lấy thông tin cá nhân
- `POST /api/auth/profile/change-password/` — Đổi mật khẩu
- `POST /api/auth/profile/upload-avatar/` — Upload avatar
- `POST /api/auth/forgot-password/` — Gửi OTP reset mật khẩu
- `POST /api/auth/verify-otp/` — Xác thực OTP
- `POST /api/auth/reset-password/` — Đặt lại mật khẩu

Transports (`/api/transports/`):
- Các API phương tiện/chuyến đi (mở rộng tại `apps/transports/`)

Tickets (`/api/tickets/`):
- Endpoint placeholder, sẽ mở rộng (`/bookings/`, `/payments/`)

## 📁 Cấu trúc dự án

```
Backend/
├── apps/
│   ├── users/
│   ├── transports/
│   └── tickets/
├── core/
│   ├── settings/
│   ├── urls.py
│   ├── wsgi.py
│   └── asgi.py
├── utils/
├── manage.py
├── requirements.txt
└── README.md
```

## 🛠️ Các lệnh hữu ích

```bash
# Migrations
python manage.py makemigrations [app]
python manage.py migrate

# Quản trị
python manage.py createsuperuser
python manage.py runserver 0.0.0.0:8000

# Khác
python manage.py showmigrations
python manage.py sqlmigrate <app> <migration_number>
python manage.py collectstatic
```

## 🔐 Ghi chú bảo mật

- Luôn đổi `SECRET_KEY` trong production, không commit vào repo.
- Đặt `DEBUG=False` và cấu hình `ALLOWED_HOSTS` đúng.
- Tắt `CORS_ALLOW_ALL_ORIGINS` trong production và dùng `CORS_ALLOWED_ORIGINS` cụ thể.
- Xem lại việc disable CSRF đối với các endpoint công khai nếu không cần thiết trong production.

## 🐛 Troubleshooting

- Lỗi import/thiếu gói: kích hoạt venv và `pip install -r requirements.txt`.
- Lỗi migration: xóa migration hỏng trong app, chạy lại `makemigrations` và `migrate`.
- Lỗi kết nối DB PostgreSQL: đảm bảo dịch vụ đang chạy và thông số `.env` đúng.

---

Chạy ổn với SQLite mặc định; Frontend cần trỏ `API_BASE_URL` đúng về `http://<ip>:8000/api`.


