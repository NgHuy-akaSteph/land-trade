/**
 * AUTH HANDLERS MODULE
 * Module xử lý submit form đăng nhập và đăng ký
 */

import { validateEmail, validatePhone, validatePassword } from '../utils/validation.js';
import { showError, clearErrorMessages, showSuccess } from '../ui/notifications.js';
import { showLoading, hideLoading } from '../ui/loading.js';
import { loginUser, registerUser } from './auth-api.js';
import { closeAuthModal, switchAuthMode } from './auth-modal.js';
import { updateAuthUIWithUser } from '../ui/user-menu.js';

// Xử lý form đăng nhập
export async function handleLoginSubmit(event) {
    event.preventDefault();
    clearErrorMessages();
    
    const formData = new FormData(event.target);
    const email = formData.get('email')?.trim();
    const password = formData.get('password');
    
    // Validation
    let hasError = false;
    
    if (!email) {
        showError('login-email', 'Vui lòng nhập email hoặc số điện thoại');
        hasError = true;
    } else if (!validateEmail(email) && !validatePhone(email)) {
        showError('login-email', 'Email hoặc số điện thoại không hợp lệ');
        hasError = true;
    }
    
    if (!password) {
        showError('login-password', 'Vui lòng nhập mật khẩu');
        hasError = true;
    }
    
    if (hasError) return;
    
    try {
        showLoading();
        
        const result = await loginUser({ email, password });
        
        hideLoading();
        showSuccess('Đăng nhập thành công!');
        closeAuthModal();
        
        // Cập nhật giao diện auth với user data
        setTimeout(async () => {
            // result có format: { success: true, data: { user, accessToken, refreshToken } }
            if (result && result.data) {
                await updateAuthUIWithUser(result.data);
            }
        }, 500);
        
    } catch (error) {
        hideLoading();
        
        // Hiển thị lỗi từ server
        if (error.message.includes('email') || error.message.includes('Email')) {
            showError('login-email', error.message);
        } else if (error.message.includes('password') || error.message.includes('mật khẩu')) {
            showError('login-password', error.message);
        } else {
            showError('login-email', error.message);
        }
    }
}

// Xử lý form đăng ký
export async function handleRegisterSubmit(event) {
    event.preventDefault();
    clearErrorMessages();
    
    const formData = new FormData(event.target);
    const fullName = formData.get('name')?.trim();
    const email = formData.get('email')?.trim();
    const phone = formData.get('phone')?.trim();
    const password = formData.get('password');
    const acceptTerms = formData.get('terms');
    
    // Validation
    let hasError = false;
    
    if (!fullName) {
        showError('register-name', 'Vui lòng nhập họ và tên');
        hasError = true;
    } else if (fullName.length < 4) {
        showError('register-name', 'Họ tên phải có ít nhất 4 ký tự');
        hasError = true;
    }
    
    if (!email) {
        showError('register-email', 'Vui lòng nhập email');
        hasError = true;
    } else if (!validateEmail(email)) {
        showError('register-email', 'Email không hợp lệ');
        hasError = true;
    }
    
    if (!phone) {
        showError('register-phone', 'Vui lòng nhập số điện thoại');
        hasError = true;
    } else if (!validatePhone(phone)) {
        showError('register-phone', 'Số điện thoại không hợp lệ (VD: 0912345678)');
        hasError = true;
    }
    
    if (!password) {
        showError('register-password', 'Vui lòng nhập mật khẩu');
        hasError = true;
    } else if (!validatePassword(password)) {
        showError('register-password', 'Mật khẩu phải có ít nhất 6 ký tự');
        hasError = true;
    }
    
    // Kiểm tra đồng ý điều khoản (chỉ validation frontend, không gửi về backend)
    if (!acceptTerms) {
        showError('register-terms', 'Bạn phải đồng ý với điều khoản sử dụng');
        hasError = true;
    }
    
    if (hasError) return;
    
    try {
        showLoading();
        
        // Gửi fullName, email, phone, password về backend
        // acceptTerms chỉ để validation ở frontend
        const result = await registerUser({
            fullName,
            email,
            phone,
            password
        });
        
        hideLoading();
        showSuccess('Đăng ký thành công! Vui lòng đăng nhập.');
        
        // Chuyển sang form đăng nhập
        setTimeout(() => {
            switchAuthMode();
            const loginEmailInput = document.getElementById('login-email');
            if (loginEmailInput) {
                loginEmailInput.value = email;
            }
        }, 1000);
        
    } catch (error) {
        hideLoading();
        
        // Hiển thị lỗi từ server
        if (error.message.includes('email') || error.message.includes('Email')) {
            showError('register-email', error.message);
        } else if (error.message.includes('phone') || error.message.includes('điện thoại')) {
            showError('register-phone', error.message);
        } else {
            showError('register-name', error.message);
        }
    }
}
