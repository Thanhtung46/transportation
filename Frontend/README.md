# Smart Travel Frontend (Expo + React Native)

Ứng dụng Frontend cho Smart Travel, xây dựng bằng Expo Router, React Native 0.81, React 19, React Query, Zustand. Kết nối tới Backend Django qua REST API.

## 📋 Yêu cầu hệ thống

- Node.js LTS, npm
- Expo CLI (sử dụng lệnh `npx expo ...`)
- Android Studio (Android Emulator) hoặc Xcode (iOS Simulator) nếu chạy giả lập

## 🚀 Bắt đầu

```bash
cd Frontend
npm install
npx expo start
```

Chạy theo nền tảng:
- Web: `npm run web`
- Android: `npm run android`
- iOS: `npm run ios`

## 🔗 Cấu hình API Backend

API base URL được đặt tại `src/services/api.ts`:

```ts
const API_BASE_URL = 'http://192.168.16.125:8000/api';
```

Hãy sửa `192.168.16.125` thành IP máy chạy Backend của bạn (ví dụ `http://localhost:8000/api` cho Web, hoặc IP LAN cho thiết bị thật/giả lập).

Các endpoint đang sử dụng (khớp Backend):
- `POST /auth/register/`, `POST /auth/login/`, `POST /auth/logout/`, `POST /auth/token/refresh/`
- `GET /auth/profile/`, `POST /auth/profile/change-password/`, `POST /auth/profile/upload-avatar/`
- `POST /auth/forgot-password/`, `POST /auth/verify-otp/`, `POST /auth/reset-password/`

## 📦 Scripts

```json
{
  "start": "expo start",
  "android": "expo start --android",
  "ios": "expo start --ios",
  "web": "expo start --web",
  "lint": "expo lint",
  "reset-project": "node ./scripts/reset-project.js"
}
```

## 🗂 Cấu trúc chính

```
Frontend/
├── app/                 # File-based routing (Expo Router)
├── src/
│   ├── services/        # api.ts, authService.ts
│   ├── features/        # modules (favorites, tickets, transport...)
│   ├── components/      # UI components
│   ├── hooks/           # hooks cho theme, color scheme
│   ├── stores/          # Zustand store (vd: location)
│   └── lib/             # tiện ích API
├── assets/              # icon, splash, images
├── app.json             # cấu hình Expo (icon, splash, maps, web)
└── README.md
```

## 🧩 Công nghệ chính

- Expo 54, Expo Router 6, React Native 0.81
- React Query 5, Axios
- Zustand state management
- `expo-maps`, `react-native-maps`

## 📝 Ghi chú phát triển

- Backend mặc định chạy ở `http://localhost:8000`. Khi test trên thiết bị thật/emulator, dùng IP LAN: `http://<ip-may-ban>:8000`.
- CORS đã bật phía Backend cho địa chỉ Expo dev (`19000/19006`).
- Nếu gặp lỗi mạng trên Android Emulator, thử `http://10.0.2.2:8000` (Android) hoặc `http://localhost:8000` trên iOS Simulator.

---

Sau khi cập nhật `API_BASE_URL`, bạn có thể đăng nhập/đăng ký và sử dụng các màn hình trong `app/` (auth, tabs, profile, tickets...).
