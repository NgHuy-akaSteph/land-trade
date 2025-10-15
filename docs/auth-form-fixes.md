# Authentication Form Fixes

## Ngày cập nhật: 14/10/2025

---

## Tổng quan
Document này ghi lại các sửa đổi được thực hiện cho authentication forms (đăng nhập và đăng ký) trong hệ thống.

---

## 1. Form Đăng Ký (Register Form)

### Vấn đề ban đầu
- Form đăng ký quá dài, gây ra thanh kéo (scrollbar) trong modal
- Checkbox "Điều khoản sử dụng" không hoạt động (thiếu input element)
- Thiếu trường phone
- Submit button không hoạt động

### Giải pháp đã áp dụng

#### 1.1. Layout Grid 2 Cột
**File:** `src/views/home.ejs`

- Thêm class `auth-form-grid` vào form element
- Nhóm các trường input thành 2 hàng với `div.form-row`:
  - **Hàng 1:** Họ và tên + Số điện thoại
  - **Hàng 2:** Email + Mật khẩu
- Checkbox và button submit vẫn full-width bên dưới

**HTML Structure:**
```html
<form class="auth-form auth-form-grid" id="register-form">
    <div class="form-row">
        <div class="form-group">
            <label for="register-name">Họ và tên</label>
            <input type="text" id="register-name" name="name" required>
        </div>
        <div class="form-group">
            <label for="register-phone">Số điện thoại</label>
            <input type="tel" id="register-phone" name="phone" required>
        </div>
    </div>
    
    <div class="form-row">
        <div class="form-group">
            <label for="register-email">Email</label>
            <input type="email" id="register-email" name="email" required>
        </div>
        <div class="form-group">
            <label for="register-password">Mật khẩu</label>
            <input type="password" id="register-password" name="password" required>
        </div>
    </div>
    
    <div class="form-options">
        <label class="checkbox">
            <input type="checkbox" id="register-terms" name="terms" required>
            <span class="checkmark"></span>
            Tôi đồng ý với <a href="#">Điều khoản sử dụng</a>
        </label>
    </div>
    <button type="submit">Đăng ký</button>
</form>
```

#### 1.2. CSS Grid Styling
**File:** `public/css/auth-ui.css`

```css
/* Grid layout for register form */
.auth-form-grid .form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 15px;
    margin-bottom: 15px;
}

.form-group {
    position: relative;
    margin-bottom: 0 !important;
}

.form-group label {
    display: block;
    margin-bottom: 5px;
    font-weight: 500;
    color: var(--gray-700);
}

.form-group input {
    transition: all 0.3s ease;
    padding: 10px 12px;
}

/* Form options styling */
.form-options {
    margin-bottom: 15px;
}

/* Responsive - 1 column on mobile */
@media (max-width: 768px) {
    .auth-form-grid .form-row {
        grid-template-columns: 1fr;
        gap: 0;
    }
    
    .form-group {
        margin-bottom: 15px !important;
    }
}
```

#### 1.3. Checkbox Fix
**Vấn đề:** Thiếu element `<input type="checkbox">` bên trong label

**Giải pháp:** Thêm input element với cấu trúc đúng:
```html
<label class="checkbox">
    <input type="checkbox" id="register-terms" name="terms" required>
    <span class="checkmark"></span>
    Tôi đồng ý với <a href="#">Điều khoản sử dụng</a>
</label>
```

#### 1.4. Giảm Khoảng Cách (Spacing Reduction)
- Label margin-bottom: `8px` → `5px`
- Input padding: `12px` → `10px 12px`
- Form row margin-bottom: `15px` (thay vì mỗi field riêng lẻ `20px`)
- Form options margin-bottom: `15px`

#### 1.5. Phone Field Validation
**Backend:** `src/dtos/auth.dto.ts`
```typescript
phone: z.string()
    .min(10, 'Số điện thoại phải có ít nhất 10 số')
    .max(11, 'Số điện thoại tối đa 11 số')
    .regex(/^\d+$/, 'Số điện thoại chỉ được chứa số')
```

**Frontend:** `public/js/app.js`
```javascript
function validatePhone(phone) {
    const phoneRegex = /^(\+84|84|0)[3-9]\d{8}$/;
    return phoneRegex.test(phone);
}
```

### Kết quả
✅ Form không còn scrollbar trong modal  
✅ Checkbox hoạt động bình thường  
✅ Submit button functional  
✅ Validation hoạt động đầy đủ  
✅ Responsive trên mobile (chuyển về 1 cột)  

---

## 2. Form Đăng Nhập (Login Form)

### Vấn đề phát hiện
- Checkbox "Ghi nhớ đăng nhập" không hoạt động
- Thiếu element `<input type="checkbox">` bên trong label
- Cùng vấn đề với register form

### Giải pháp
**File:** `src/views/home.ejs`

**Before:**
```html
<div class="form-options">
    <label class="checkbox">
        <span class="checkmark"></span>
        Ghi nhớ đăng nhập
    </label>
    <a href="#" class="forgot-password">Quên mật khẩu?</a>
</div>
```

**After:**
```html
<div class="form-options">
    <label class="checkbox">
        <input type="checkbox" id="login-remember" name="remember">
        <span class="checkmark"></span>
        Ghi nhớ đăng nhập
    </label>
    <a href="#" class="forgot-password">Quên mật khẩu?</a>
</div>
```

### Kết quả
✅ Checkbox "Ghi nhớ đăng nhập" hoạt động bình thường  
✅ Visual feedback khi click (checkmark hiển thị)  
✅ Có thể lấy giá trị checkbox qua FormData  

---

## 3. CSS Checkbox Styling

### Custom Checkbox Design
**File:** `public/css/auth-ui.css`

```css
/* Hide default checkbox */
.checkbox input[type="checkbox"] {
    position: absolute;
    opacity: 0;
    cursor: pointer;
    height: 0;
    width: 0;
}

/* Custom checkmark */
.checkbox .checkmark {
    position: absolute;
    top: 0;
    left: 0;
    height: 20px;
    width: 20px;
    background-color: white;
    border: 2px solid var(--gray-300);
    border-radius: 4px;
    transition: all 0.3s ease;
}

/* Hover effect */
.checkbox:hover input ~ .checkmark {
    border-color: var(--primary-color);
}

/* Checked state */
.checkbox input:checked ~ .checkmark {
    background-color: var(--primary-color);
    border-color: var(--primary-color);
}

/* Checkmark icon */
.checkbox .checkmark:after {
    content: "";
    position: absolute;
    display: none;
    left: 6px;
    top: 2px;
    width: 5px;
    height: 10px;
    border: solid white;
    border-width: 0 2px 2px 0;
    transform: rotate(45deg);
}

/* Show checkmark when checked */
.checkbox input:checked ~ .checkmark:after {
    display: block;
}
```

---

## 4. Validation & Error Handling

### Field-Specific Error Display
**File:** `public/js/app.js`

```javascript
function showError(fieldId, message) {
    const field = document.getElementById(fieldId);
    if (!field) return;
    
    // Find parent container (works for both inputs and checkboxes)
    const parentContainer = field.closest('.form-group') || field.closest('.form-options');
    if (!parentContainer) return;
    
    // Remove existing error
    const existingError = parentContainer.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
    
    // Add error message
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
    
    parentContainer.appendChild(errorDiv);
    field.classList.add('error');
}
```

### Error Styling
```css
.error-message {
    color: #ef4444 !important;
    font-size: 14px !important;
    margin-top: 5px !important;
    display: flex;
    align-items: center;
    gap: 5px;
}

.error-message::before {
    content: "⚠";
    font-size: 12px;
}

/* Special styling for checkbox errors */
.form-options .error-message {
    display: block;
    margin-top: 5px;
    margin-left: 28px;
}
```

---

## 5. Backend Integration

### Register Endpoint
**Endpoint:** `POST /api/auth/register`

**Request Body:**
```json
{
    "fullName": "Nguyễn Văn A",
    "email": "test@example.com",
    "phone": "0912345678",
    "password": "SecurePass123"
}
```

**Note:** Trường `terms` checkbox chỉ dùng cho validation frontend, không gửi lên backend.

### Login Endpoint
**Endpoint:** `POST /api/auth/login`

**Request Body:**
```json
{
    "email": "test@example.com",
    "password": "SecurePass123"
}
```

---

## 6. Testing Checklist

### Register Form
- [ ] Form hiển thị đầy đủ 4 trường trong 2 cột
- [ ] Không có scrollbar trong modal
- [ ] Checkbox terms hoạt động (có thể check/uncheck)
- [ ] Submit bị block nếu terms chưa check
- [ ] Phone validation chỉ chấp nhận số
- [ ] Error messages hiển thị đúng vị trí
- [ ] Responsive: chuyển 1 cột trên mobile (≤768px)

### Login Form
- [ ] Checkbox "Ghi nhớ đăng nhập" hoạt động
- [ ] Email/phone validation hoạt động
- [ ] Password field không hiển thị text
- [ ] Error messages hiển thị đúng
- [ ] Submit gọi API thành công

---

## 7. Files Changed Summary

| File | Changes |
|------|---------|
| `src/views/home.ejs` | Added checkbox input to both login & register forms, restructured register form with grid layout |
| `public/css/auth-ui.css` | Added grid layout styles, reduced spacing, added checkbox styling, responsive breakpoints |
| `public/js/app.js` | Enhanced error handling for checkboxes, phone validation |
| `src/dtos/auth.dto.ts` | Added phone field validation with regex |

---

## 8. Future Improvements

### Potential Enhancements
1. **Remember Me Functionality:** Implement actual "remember me" feature with localStorage/cookies
2. **Password Strength Indicator:** Add visual indicator for password strength
3. **Social Login:** Add Google/Facebook login options
4. **Email Verification:** Add email verification flow
5. **Forgot Password:** Implement forgot password functionality
6. **Animation:** Add subtle animations for form transitions
7. **Accessibility:** Add ARIA labels and keyboard navigation

### Known Limitations
- Phone validation regex cần test với nhiều format số điện thoại VN hơn
- "Quên mật khẩu" chưa có functionality
- "Ghi nhớ đăng nhập" chỉ là UI, chưa implement logic

---

## Liên hệ
Mọi câu hỏi về các thay đổi này, vui lòng liên hệ team development.

---

## 9. Post-Login UI Update (14/10/2025)

### Vấn đề
Sau khi đăng nhập thành công, nút "Đăng nhập" và "Đăng ký" vẫn hiển thị thay vì thay đổi thành user menu với tên và icon.

### Nguyên nhân
Response từ API có structure:
```json
{
  "success": true,
  "data": {
    "user": { "id": "...", "fullName": "...", "email": "...", "phone": "..." },
    "accessToken": "...",
    "refreshToken": "..."
  }
}
```

Nhưng function `updateAuthUIWithUser(result)` nhận `result` trực tiếp thay vì `result.data`.

### Giải pháp
**File:** `public/js/app.js`

#### 9.1. Sửa handleLoginSubmit
```javascript
const result = await loginUser({ email, password });

// Cập nhật giao diện auth với user data
setTimeout(async () => {
    // result có format: { success: true, data: { user, accessToken, refreshToken } }
    if (result && result.data) {
        await updateAuthUIWithUser(result.data);  // Truyền result.data thay vì result
    }
}, 500);
```

#### 9.2. Cập nhật HTML User Dropdown
Sửa HTML để khớp với CSS có sẵn trong `styles.css`:

```javascript
navAuth.innerHTML = `
    <div class="user-dropdown">
        <button class="user-btn" onclick="toggleUserMenu(event)">
            <div class="user-avatar">
                <i class="fas fa-user"></i>
            </div>
            <span>${userName}</span>
            <i class="fas fa-chevron-down"></i>
        </button>
        <div class="dropdown-menu">
            <a href="/dashboard" class="dropdown-item">
                <i class="fas fa-tachometer-alt"></i> 
                <span>Dashboard</span>
            </a>
            <a href="/profile" class="dropdown-item">
                <i class="fas fa-user-edit"></i> 
                <span>Hồ sơ cá nhân</span>
            </a>
            <a href="/my-listings" class="dropdown-item">
                <i class="fas fa-list-alt"></i> 
                <span>Tin đăng của tôi</span>
            </a>
            <a href="#" onclick="handleLogout(event)" class="dropdown-item">
                <i class="fas fa-sign-out-alt"></i> 
                <span>Đăng xuất</span>
            </a>
        </div>
    </div>
`;
```

**Classes sử dụng:**
- `.user-dropdown` - Container chính
- `.user-btn` - Button để toggle menu
- `.user-avatar` - Avatar icon circle
- `.dropdown-menu` - Menu dropdown
- `.dropdown-item` - Mỗi item trong menu

#### 9.3. Sửa toggleUserMenu Function
```javascript
function toggleUserMenu(event) {
    if (event) {
        event.stopPropagation();
    }
    
    const userDropdown = document.querySelector('.user-dropdown');
    if (userDropdown) {
        userDropdown.classList.toggle('active');  // Toggle class 'active'
    }
}

// Đóng menu khi click bên ngoài
document.addEventListener('click', function(event) {
    const userDropdown = document.querySelector('.user-dropdown');
    
    if (userDropdown && !userDropdown.contains(event.target)) {
        userDropdown.classList.remove('active');
    }
});
```

#### 9.4. Thêm handleLogout Function
```javascript
async function handleLogout(event) {
    if (event) {
        event.preventDefault();
    }
    await logout();
}
```

### CSS Mapping
**File:** `public/css/styles.css` (lines 3038-3120)

CSS đã có sẵn với structure:
- `.user-dropdown` - position: relative
- `.user-dropdown.active` - khi menu mở
- `.user-btn` - button styling với flex layout
- `.user-avatar` - circular avatar (32px)
- `.dropdown-menu` - absolute positioned menu với animation
- `.dropdown-item` - menu items với hover effect

### Kết quả
✅ Sau đăng nhập, nút auth biến thành user dropdown  
✅ Click vào user button hiển thị menu  
✅ Menu có animation smooth (fade + slide)  
✅ Click bên ngoài đóng menu  
✅ Logout hoạt động và reset UI về ban đầu  

---

## Liên hệ
Mọi câu hỏi về các thay đổi này, vui lòng liên hệ team development.
