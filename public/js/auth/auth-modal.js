/**
 * AUTH MODAL MODULE
 * Module xử lý modal đăng nhập/đăng ký
 */

import { clearErrorMessages } from '../ui/notifications.js';

// Biến global để theo dõi trạng thái modal
let isLoginMode = true;

// Mở modal đăng nhập
export function openLoginModal() {
    isLoginMode = true;
    updateAuthModal();
    const modal = document.getElementById('auth-modal');
    if (modal) {
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
    }
}

// Mở modal đăng ký
export function openRegisterModal() {
    isLoginMode = false;
    updateAuthModal();
    const modal = document.getElementById('auth-modal');
    if (modal) {
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
    }
}

// Đóng modal
export function closeAuthModal() {
    const modal = document.getElementById('auth-modal');
    if (modal) {
        modal.classList.remove('show');
        document.body.style.overflow = 'auto';
        clearAuthForms();
    }
}

// Chuyển đổi giữa đăng nhập và đăng ký
export function switchAuthMode() {
    isLoginMode = !isLoginMode;
    updateAuthModal();
    clearAuthForms();
}

// Cập nhật giao diện modal
export function updateAuthModal() {
    const title = document.getElementById('auth-modal-title');
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const switchText = document.getElementById('auth-switch-text');
    
    if (!title || !loginForm || !registerForm || !switchText) return;
    
    if (isLoginMode) {
        title.textContent = 'Đăng nhập';
        loginForm.style.display = 'block';
        registerForm.style.display = 'none';
        switchText.innerHTML = 'Chưa có tài khoản? <a href="#" onclick="window.switchAuthMode()">Đăng ký ngay</a>';
    } else {
        title.textContent = 'Đăng ký';
        loginForm.style.display = 'none';
        registerForm.style.display = 'block';
        switchText.innerHTML = 'Đã có tài khoản? <a href="#" onclick="window.switchAuthMode()">Đăng nhập ngay</a>';
    }
}

// Xóa dữ liệu trong form
export function clearAuthForms() {
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    
    if (loginForm) loginForm.reset();
    if (registerForm) registerForm.reset();
    
    clearErrorMessages();
}
