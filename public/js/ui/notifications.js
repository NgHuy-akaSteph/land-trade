/**
 * NOTIFICATIONS MODULE
 * Module xử lý hiển thị thông báo lỗi, thành công và các thông báo khác
 */

import { showAlert } from './alert.js';

// Hiển thị lỗi cho một trường input cụ thể
export function showError(elementId, message) {
    const element = document.getElementById(elementId);
    
    if (!element) {
        console.error(`Element with id "${elementId}" not found`);
        return;
    }
    
    // Get parent container
    const parent = element.closest('.form-group') || element.closest('.form-options') || element.parentNode;
    
    // Remove existing error message
    const existingError = parent.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
    
    // Create new error message
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    errorDiv.style.cssText = `
        color: #ef4444;
        font-size: 14px;
        margin-top: 5px;
        display: block;
    `;
    
    // Add error styling to input (not for checkbox)
    if (element.type !== 'checkbox') {
        element.style.borderColor = '#ef4444';
    }
    
    // Insert error after element or at end of parent
    parent.appendChild(errorDiv);
}

// Xóa thông báo lỗi của một trường cụ thể
export function clearError(elementId) {
    const element = document.getElementById(elementId);
    
    if (!element) return;
    
    const parent = element.closest('.form-group') || element.closest('.form-options') || element.parentNode;
    const errorDiv = parent.querySelector('.error-message');
    
    if (errorDiv) {
        errorDiv.remove();
    }
    
    if (element.type !== 'checkbox') {
        element.style.borderColor = '';
    }
}

// Xóa tất cả thông báo lỗi trong auth modal
export function clearErrorMessages() {
    const errorMessages = document.querySelectorAll('.error-message');
    errorMessages.forEach(msg => msg.remove());
    
    const inputs = document.querySelectorAll('#auth-modal input');
    inputs.forEach(input => input.style.borderColor = '');
}

// Hiển thị thông báo thành công (sử dụng alert system)
export function showSuccess(message, duration = 3000) {
    showAlert('success', message, duration);
}

// Hiển thị thông báo yêu cầu đăng nhập
export function showAuthRequiredMessage(action = "thực hiện hành động này") {
    const message = `Bạn cần đăng nhập để ${action}`;
    
    const authNotice = document.createElement('div');
    authNotice.className = 'auth-required-notice';
    authNotice.innerHTML = `
        <div class="notice-content">
            <i class="fas fa-lock"></i>
            <span>${message}</span>
        </div>
    `;
    authNotice.style.cssText = `
        position: fixed;
        top: 80px;
        left: 50%;
        transform: translateX(-50%);
        background: linear-gradient(135deg, #3b82f6, #1d4ed8);
        color: white;
        padding: 15px 25px;
        border-radius: 12px;
        box-shadow: 0 8px 25px rgba(59, 130, 246, 0.3);
        z-index: 9999;
        font-weight: 500;
        animation: slideDown 0.3s ease-out;
        min-width: 300px;
        text-align: center;
    `;
    
    document.body.appendChild(authNotice);
    
    // Tự động xóa sau 3 giây
    setTimeout(() => {
        authNotice.style.animation = 'slideUp 0.3s ease-in';
        setTimeout(() => authNotice.remove(), 300);
    }, 3000);
}
