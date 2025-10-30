# Smart Travel Backend API

Hệ thống backend API cho ứng dụng Smart Travel - Quản lý giao thông và vé tàu xe.

## 📋 Mục lục

- [Yêu cầu hệ thống](#yêu-cầu-hệ-thống)
- [Cài đặt](#cài-đặt)
- [Cấu hình](#cấu-hình)
- [Chạy dự án](#chạy-dự-án)
- [Tài liệu API](#tài-liệu-api)
- [Cấu trúc dự án](#cấu-trúc-dự-án)
- [Các lệnh hữu ích](#các-lệnh-hữu-ích)

## 🔧 Yêu cầu hệ thống

- Python >= 3.8
- PostgreSQL >= 12 (cho môi trường development/production)
- pip (Python package manager)
- virtualenv (khuyến nghị)

## 📦 Cài đặt

### 1. Clone repository

```bash
git clone <repository-url>
cd Backend
```

### 2. Tạo virtual environment (khuyến nghị)

```bash
# Tạo virtual environment
python3 -m venv venv

# Kích hoạt virtual environment
# Trên macOS/Linux:
source venv/bin/activate

# Trên Windows:
# venv\Scripts\activate
```

### 3. Cài đặt dependencies

```bash
pip install -r requirements.txt
```

### 4. Cài đặt PostgreSQL (nếu chưa có)

#### macOS (sử dụng Homebrew):
```bash
brew install postgresql@14
brew services start postgresql@14
```

#### Linux (Ubuntu/Debian):
```bash
sudo apt-get update
sudo apt-get install postgresql postgresql-contrib
sudo service postgresql start
```

#### Windows:
Tải và cài đặt từ [PostgreSQL Official Website](https://www.postgresql.org/download/windows/)

### 5. Tạo database PostgreSQL

```bash
# Đăng nhập vào PostgreSQL
psql postgres

# Hoặc trên macOS nếu không có user mặc định:
psql -U postgres

# Tạo database và user
CREATE DATABASE testserver;
CREATE USER devuser WITH PASSWORD '123';
ALTER ROLE devuser SET client_encoding TO 'utf8';
ALTER ROLE devuser SET default_transaction_isolation TO 'read committed';
ALTER ROLE devuser SET timezone TO 'UTC';
GRANT ALL PRIVILEGES ON DATABASE testserver TO devuser;
\q
```

**Lưu ý:** Thông tin database mặc định trong settings:
- Database name: `testserver`
- User: `devuser`
- Password: `123`
- Host: `localhost`
- Port: `5432`

Bạn có thể thay đổi trong file `.env` (xem phần Cấu hình).

## ⚙️ Cấu hình

### Tạo file `.env`

Tạo file `.env` trong thư mục gốc của dự án:

```bash
touch .env
```

Thêm các biến môi trường sau vào file `.env`:

```env
# Môi trường chạy (dev hoặc prod)
DJANGO_ENV=dev

# Secret Key cho Django (quan trọng - đổi trong production!)
SECRET_KEY=your-secret-key-here-change-in-production

# Database Configuration (nếu muốn override settings)
DB_NAME=testserver
DB_USER=devuser
DB_PASSWORD=123
DB_HOST=localhost
DB_PORT=5432
```

### Các file settings

Dự án sử dụng cấu trúc settings module:

- `core/settings/base.py`: Cấu hình chung (mặc định dùng SQLite)
- `core/settings/dev.py`: Cấu hình cho development (PostgreSQL)
- `core/settings/prod.py`: Cấu hình cho production

Môi trường được xác định bằng biến `DJANGO_ENV` trong file `.env`.

## 🚀 Chạy dự án

### 1. Chạy migrations

```bash
# Tạo migrations nếu có model mới
python manage.py makemigrations

# Áp dụng migrations vào database
python manage.py migrate
```

### 2. Tạo superuser (tùy chọn)

Để truy cập Django admin panel:

```bash
python manage.py createsuperuser
```

### 3. Chạy development server

```bash
python manage.py runserver
```

Server sẽ chạy tại: `http://localhost:8000`

### 4. Kiểm tra API

- **Trang chủ:** http://localhost:8000/
- **API Root:** http://localhost:8000/api/
- **Admin Panel:** http://localhost:8000/admin/
- **Swagger UI:** http://localhost:8000/swagger/
- **ReDoc:** http://localhost:8000/redoc/

## 📚 Tài liệu API

### Swagger UI
Truy cập: http://localhost:8000/swagger/

### ReDoc
Truy cập: http://localhost:8000/redoc/

### Các endpoint chính

#### Authentication (`/api/auth/`)
- `POST /api/auth/register/` - Đăng ký user mới
- `POST /api/auth/login/` - Đăng nhập
- `GET /api/auth/profile/` - Xem profile (yêu cầu authentication)

#### Transports (`/api/transports/`)
- Quản lý thông tin phương tiện giao thông

#### Tickets (`/api/tickets/`)
- Quản lý vé tàu/xe

## 📁 Cấu trúc dự án

```
Backend/
├── apps/
│   ├── users/           # App quản lý users và authentication
│   ├── transports/      # App quản lý phương tiện giao thông
│   └── tickets/         # App quản lý vé
├── core/                # Cấu hình Django chính
│   ├── settings/        # Các file settings theo môi trường
│   ├── urls.py          # URL routing chính
│   ├── wsgi.py
│   └── asgi.py
├── utils/               # Các utility functions
│   ├── pagination.py
│   └── permissions.py
├── manage.py            # Django management script
├── requirements.txt     # Python dependencies
└── README.md           # File này
```

## 🛠️ Các lệnh hữu ích

### Django Management Commands

```bash
# Tạo migrations cho một app cụ thể
python manage.py makemigrations <app_name>

# Xem SQL sẽ được chạy khi migrate
python manage.py sqlmigrate <app_name> <migration_number>

# Kiểm tra các vấn đề về migrations
python manage.py showmigrations

# Chạy server với port khác
python manage.py runserver 8001

# Tạo app mới
python manage.py startapp <app_name>

# Vào Django shell
python manage.py shell

# Thu thập static files (cho production)
python manage.py collectstatic
```

### Database Commands

```bash
# Reset database (xóa tất cả migrations và tạo lại)
# Cẩn thận: Lệnh này sẽ xóa tất cả dữ liệu!
find . -path "*/migrations/*.py" -not -name "__init__.py" -delete
find . -path "*/migrations/*.pyc" -delete
python manage.py makemigrations
python manage.py migrate
```

### Development Tips

```bash
# Kiểm tra cú pháp Python
python -m py_compile manage.py

# Cài đặt package mới và cập nhật requirements.txt
pip install <package_name>
pip freeze > requirements.txt
```

## 🔐 Security Notes

1. **Secret Key**: Luôn thay đổi `SECRET_KEY` trong production và không commit vào git
2. **Database Password**: Không commit thông tin database vào git
3. **DEBUG Mode**: Đảm bảo `DEBUG=False` trong production
4. **Allowed Hosts**: Cấu hình `ALLOWED_HOSTS` phù hợp trong production
5. **CORS**: Cấu hình `CORS_ALLOWED_ORIGINS` thay vì `CORS_ALLOW_ALL_ORIGINS=True` trong production

## 🐛 Troubleshooting

### Lỗi kết nối database
```bash
# Kiểm tra PostgreSQL đang chạy
# macOS/Linux:
ps aux | grep postgres

# Windows:
# Kiểm tra trong Services
```

### Lỗi import module
```bash
# Đảm bảo virtual environment đã được kích hoạt
# Cài đặt lại dependencies
pip install -r requirements.txt
```

### Lỗi migration
```bash
# Xóa file migration có vấn đề và tạo lại
python manage.py makemigrations <app_name>
python manage.py migrate
```

## 📝 Notes

- Dự án sử dụng Django REST Framework (DRF) cho API
- Authentication sử dụng JWT (JSON Web Tokens)
- CORS đã được cấu hình để hỗ trợ React Native app
- Database mặc định trong base.py là SQLite (để test nhanh)
- Development environment sử dụng PostgreSQL

## 👥 Đóng góp

Nếu bạn muốn đóng góp cho dự án, vui lòng:
1. Fork repository
2. Tạo feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Tạo Pull Request

## 📄 License

[Thêm thông tin license nếu có]

---

**Chúc bạn code vui vẻ! 🚀**


