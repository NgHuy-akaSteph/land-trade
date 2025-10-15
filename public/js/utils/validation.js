/**
 * VALIDATION UTILITIES
 * Module chứa các hàm validation và format dữ liệu
 */

// Validate email
export function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Validate phone (hỗ trợ định dạng Việt Nam)
export function validatePhone(phone) {
    const phoneRegex = /^(\+84|84|0)[3-9]\d{8}$/;
    return phoneRegex.test(phone);
}

// Validate password (tối thiểu 6 ký tự)
export function validatePassword(password) {
    return password && password.length >= 6;
}

// Format số điện thoại về dạng chuẩn +84
export function formatPhone(phone) {
    if (!phone) return phone;
    
    // Chuyển 84 thành +84, 0 thành +84
    if (phone.startsWith('84') && !phone.startsWith('+84')) {
        return '+' + phone;
    }
    if (phone.startsWith('0')) {
        return '+84' + phone.slice(1);
    }
    return phone;
}
