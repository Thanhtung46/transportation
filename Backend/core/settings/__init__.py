# core/settings/__init__.py

# import os
from decouple import config

# Đọc biến môi trường DJANGO_ENV từ file .env
# Nếu không tìm thấy, mặc định là 'dev'
ENVIRONMENT = config('DJANGO_ENV', default='dev')

# # Dùng print để bạn thấy rõ nó đang tải file nào (sau này có thể xóa)
# print(f"*********************************************")
# print(f"*** LOADING SETTINGS FOR: {ENVIRONMENT} ***")
# print(f"*********************************************")

if ENVIRONMENT == 'prod':
    # Tải file cài đặt production
    from .prod import *
else:
    # Tải file cài đặt development
    from .dev import *