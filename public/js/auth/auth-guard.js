/**
 * AUTH GUARD MODULE
 * Module kiểm tra authentication trước khi thực hiện các hành động yêu cầu đăng nhập
 */

import { checkAuthStatus } from './auth-api.js';
import { openLoginModal } from './auth-modal.js';
import { showAuthRequiredMessage } from '../ui/notifications.js';

// Kiểm tra đăng nhập trước khi thực hiện hành động
export async function requireAuth(callback, action = "thực hiện hành động này") {
    try {
        const user = await checkAuthStatus();
        
        if (user && user.user) {
            // Đã đăng nhập, thực hiện callback
            if (typeof callback === 'function') {
                callback(user);
            } else if (typeof callback === 'string') {
                // Nếu callback là URL, redirect
                window.location.href = callback;
            }
        } else {
            // Chưa đăng nhập, hiển thị modal đăng nhập
            showAuthRequiredMessage(action);
            openLoginModal();
        }
    } catch (error) {
        // Bất kỳ lỗi nào cũng coi như chưa đăng nhập
        console.log('Auth check error (expected when not logged in):', error.message);
        showAuthRequiredMessage(action);
        openLoginModal();
    }
}

// Xử lý nút đăng tin
export function handlePostListingClick(event) {
    event.preventDefault();
    requireAuth('/post-listing', 'đăng tin bán đất');
}
