# 📁 JavaScript Module Structure

Dự án đã được tái cấu trúc thành các module riêng biệt để dễ bảo trì và phát triển.

## 📂 Cấu trúc thư mục

```
public/js/
├── app.js                    # File chính - orchestrator
├── app.js.backup            # Backup của file cũ
├── auth.js                  # [CŨ - Có thể xóa sau]
├── alert.js                 # [CŨ - Đã copy vào ui/]
│
├── auth/                    # 🔐 Auth modules
│   ├── auth-api.js         # API calls (login, register, logout, checkAuth)
│   ├── auth-guard.js       # RequireAuth middleware
│   ├── auth-handlers.js    # Form submit handlers
│   └── auth-modal.js       # Modal management
│
├── ui/                      # 🎨 UI modules
│   ├── alert.js            # Alert/notification system (tiên tiến)
│   ├── loading.js          # Loading overlay
│   ├── notifications.js    # Error/success messages
│   └── user-menu.js        # User dropdown menu
│
└── utils/                   # 🛠️ Utility modules
    └── validation.js        # Validation functions
```

## 🎯 Chức năng từng module

### 📁 `app.js` - Main Application
- Import và orchestrate tất cả modules
- Setup event listeners
- Export functions ra window object (cho inline onclick)

### 🔐 Auth Modules

#### `auth/auth-api.js`
- **Axios-based API calls** với error handling chi tiết
- `loginUser(credentials)` - Đăng nhập
- `registerUser(userData)` - Đăng ký
- `checkAuthStatus()` - Kiểm tra trạng thái đăng nhập
- `logout()` - Đăng xuất
- Xử lý Zod validation errors
- Mapping field names sang tiếng Việt

#### `auth/auth-modal.js`
- `openLoginModal()` - Mở modal đăng nhập
- `openRegisterModal()` - Mở modal đăng ký
- `closeAuthModal()` - Đóng modal
- `switchAuthMode()` - Chuyển đổi giữa login/register
- `updateAuthModal()` - Cập nhật UI modal
- `clearAuthForms()` - Xóa dữ liệu form

#### `auth/auth-handlers.js`
- `handleLoginSubmit(event)` - Xử lý submit form login
- `handleRegisterSubmit(event)` - Xử lý submit form register
- Validation trước khi gửi API
- Hiển thị error messages
- Cập nhật UI sau khi thành công

#### `auth/auth-guard.js`
- `requireAuth(callback, action)` - Kiểm tra auth trước khi thực hiện action
- `handlePostListingClick(event)` - Xử lý nút đăng tin
- Hiển thị thông báo yêu cầu đăng nhập

### 🎨 UI Modules

#### `ui/alert.js`
- **Advanced alert system** với animation
- `showAlert(type, message, duration)` - Hiển thị alert
  - Types: `success`, `error`, `warning`, `info`
- `hideAlert()` - Ẩn alert
- Auto-initialize CSS
- Responsive design

#### `ui/loading.js`
- `showLoading()` - Hiển thị loading overlay
- `hideLoading()` - Ẩn loading overlay

#### `ui/notifications.js`
- `showError(elementId, message)` - Hiển thị lỗi cho field cụ thể
- `clearError(elementId)` - Xóa lỗi của field
- `clearErrorMessages()` - Xóa tất cả lỗi
- `showSuccess(message, duration)` - Sử dụng alert system
- `showAuthRequiredMessage(action)` - Thông báo yêu cầu đăng nhập

#### `ui/user-menu.js`
- `toggleUserMenu(event)` - Toggle dropdown menu
- `handleLogout(event)` - Xử lý đăng xuất
- `updateAuthUI(skipCheck)` - Cập nhật UI dựa trên auth status
- `updateAuthUIWithUser(userData)` - Cập nhật UI với user data
- `resetAuthUI()` - Reset về trạng thái chưa đăng nhập

### 🛠️ Utils Modules

#### `utils/validation.js`
- `validateEmail(email)` - Validate email
- `validatePhone(phone)` - Validate số điện thoại VN
- `validatePassword(password)` - Validate mật khẩu (min 6 chars)
- `formatPhone(phone)` - Format số điện thoại về +84

## 🚀 Cách sử dụng

### Import trong file khác:

```javascript
// Import specific functions
import { openLoginModal, closeAuthModal } from './auth/auth-modal.js';
import { showAlert } from './ui/alert.js';
import { validateEmail } from './utils/validation.js';

// Sử dụng
openLoginModal();
showAlert('success', 'Thành công!');
const isValid = validateEmail('test@example.com');
```

### Sử dụng trong HTML (inline):

```html
<!-- Các function đã được export ra window object -->
<button onclick="openLoginModal()">Đăng nhập</button>
<button onclick="openRegisterModal()">Đăng ký</button>
<button onclick="toggleUserMenu(event)">User Menu</button>
```

## ✨ Ưu điểm của cấu trúc mới

1. ✅ **Separation of Concerns** - Mỗi module có trách nhiệm riêng
2. ✅ **Dễ maintain** - Sửa một chức năng chỉ cần vào đúng module
3. ✅ **Dễ test** - Có thể test từng module độc lập
4. ✅ **Reusable** - Import function ở bất kỳ đâu
5. ✅ **Better error handling** - Axios + validation helpers
6. ✅ **Type safety** - Có thể thêm JSDoc hoặc TypeScript sau này
7. ✅ **Scalable** - Dễ thêm module mới

## 📝 Notes

- **ES6 Modules**: Cần `type="module"` trong script tag
- **Axios**: Đã sử dụng thay vì fetch API
- **Backward compatible**: Inline onclick vẫn hoạt động nhờ window exports
- **Files cũ**: `app.js.backup`, `auth.js`, `alert.js` (root) có thể xóa sau khi test xong

## 🔄 Migration từ code cũ

Nếu bạn có code cũ gọi functions, chỉ cần:

```javascript
// Cũ
openLoginModal();

// Mới - giống hệt, không cần thay đổi!
openLoginModal();
```

Tất cả functions đã được export ra window object nên backward compatible 100%!

## 🐛 Troubleshooting

### Error: "Cannot use import statement outside a module"
**Giải pháp**: Thêm `type="module"` vào script tag:
```html
<script type="module" src="/js/app.js"></script>
```

### Error: "Axios is not defined"
**Giải pháp**: Kiểm tra axios đã được install:
```bash
npm install axios
```

### Function không hoạt động từ inline onclick
**Giải pháp**: Function đã được export ra window object chưa? Kiểm tra trong `app.js`:
```javascript
window.openLoginModal = openLoginModal;
```

---

**Last Updated**: October 14, 2025
**Version**: 2.0
**Status**: ✅ Production Ready
