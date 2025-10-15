/**
 * APP.JS - MAIN APPLICATION FILE
 * File chính của ứng dụng, orchestrator cho tất cả các module
 */

// Import auth modules
import { 
    openLoginModal, 
    openRegisterModal, 
    closeAuthModal, 
    switchAuthMode 
} from './auth/auth-modal.js';

import { 
    handleLoginSubmit, 
    handleRegisterSubmit 
} from './auth/auth-handlers.js';

import { 
    requireAuth, 
    handlePostListingClick 
} from './auth/auth-guard.js';

// Import UI modules
import { 
    toggleUserMenu, 
    handleLogout, 
    updateAuthUI 
} from './ui/user-menu.js';

import { 
    clearError 
} from './ui/notifications.js';

// Export functions to window object để có thể gọi từ inline onclick
window.openLoginModal = openLoginModal;
window.openRegisterModal = openRegisterModal;
window.closeAuthModal = closeAuthModal;
window.switchAuthMode = switchAuthMode;
window.toggleUserMenu = toggleUserMenu;
window.handleLogout = handleLogout;
window.requireAuth = requireAuth;

// ==================== EVENT LISTENERS ====================

document.addEventListener('DOMContentLoaded', function() {
    // Đảm bảo modal ẩn khi trang load
    const authModal = document.getElementById('auth-modal');
    if (authModal) {
        authModal.classList.remove('show');
        authModal.style.display = 'none';
    }
    
    // Gắn sự kiện cho nút đăng nhập/đăng ký trong nav
    const loginBtn = document.querySelector('.btn-login');
    const registerBtn = document.querySelector('.btn-register');
    
    if (loginBtn) {
        loginBtn.addEventListener('click', openLoginModal);
    }
    
    if (registerBtn) {
        registerBtn.addEventListener('click', openRegisterModal);
    }
    
    // Gắn sự kiện cho form
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    
    if (loginForm) {
        loginForm.addEventListener('submit', handleLoginSubmit);
    }
    
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegisterSubmit);
    }
    
    // Đóng modal khi click vào overlay
    const modalOverlay = document.getElementById('auth-modal');
    if (modalOverlay) {
        modalOverlay.addEventListener('click', function(event) {
            if (event.target === modalOverlay) {
                closeAuthModal();
            }
        });
    }
    
    // Đóng modal khi nhấn ESC
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            const authModal = document.getElementById('auth-modal');
            if (authModal && authModal.classList.contains('show')) {
                closeAuthModal();
            }
        }
    });
    
    // Xóa lỗi khi user bắt đầu nhập lại
    const inputs = document.querySelectorAll('#auth-modal input');
    inputs.forEach(input => {
        input.addEventListener('input', function() {
            clearError(input.id);
        });
    });
    
    // Gắn sự kiện cho nút đăng tin
    const postListingBtn = document.getElementById('post-listing-btn');
    if (postListingBtn) {
        postListingBtn.addEventListener('click', handlePostListingClick);
    }
    
    // Gắn sự kiện cho tất cả link đăng tin khác trong trang
    const postListingLinks = document.querySelectorAll('a[href*="post-listing"]');
    postListingLinks.forEach(link => {
        if (link.id !== 'post-listing-btn') { // Tránh gắn 2 lần cho cùng element
            link.addEventListener('click', function(event) {
                event.preventDefault();
                requireAuth('/post-listing', 'đăng tin bán đất');
            });
        }
    });
    
    // Đóng user menu khi click bên ngoài
    document.addEventListener('click', function(event) {
        const userDropdown = document.querySelector('.user-dropdown');
        
        if (userDropdown && !userDropdown.contains(event.target)) {
            userDropdown.classList.remove('active');
        }
    });

    // Đồng bộ trạng thái đăng nhập khi trang load
    // Nếu có ?auth=required thì mở modal đăng nhập
    const url = new URL(window.location.href);
    if (url.searchParams.get('auth') === 'required') {
        openLoginModal();
        url.searchParams.delete('auth');
        window.history.replaceState({}, document.title, url.toString());
    }

    // Gọi cập nhật UI theo trạng thái đăng nhập (sẽ call /api/v1/auth/me)
    updateAuthUI(false);
});

// Xử lý bfcache (back/forward): cập nhật lại UI khi quay lại trang
window.addEventListener('pageshow', function(event) {
    // event.persisted true khi load từ bfcache
    if (event.persisted) {
        updateAuthUI(false);
    }
});
