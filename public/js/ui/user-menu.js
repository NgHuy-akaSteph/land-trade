/**
 * USER MENU MODULE
 * Module xử lý user dropdown menu và UI authentication state
 */

import { logout, checkAuthStatus } from '../auth/auth-api.js';
import { showSuccess } from './notifications.js';
import { openLoginModal, openRegisterModal } from '../auth/auth-modal.js';

// Toggle user menu dropdown
export function toggleUserMenu(event) {
    if (event) {
        event.stopPropagation();
    }
    
    const userDropdown = document.querySelector('.user-dropdown');
    if (userDropdown) {
        userDropdown.classList.toggle('active');
    }
}

// Đăng xuất
export async function handleLogout(event) {
    if (event) {
        event.preventDefault();
    }
    
    try {
        await logout();
        showSuccess('Đăng xuất thành công!');
        
        // Reset giao diện về trạng thái chưa đăng nhập
        setTimeout(() => {
            resetAuthUI();
        }, 500);
        
    } catch (error) {
        console.error('Logout error:', error);
    }
}

// Cập nhật giao diện dựa trên trạng thái đăng nhập (chỉ gọi khi cần thiết)
export async function updateAuthUI(skipCheck = false) {
    try {
        let user = null;
        
        // Chỉ check auth status khi được yêu cầu rõ ràng
        if (!skipCheck) {
            user = await checkAuthStatus();
        }
        
        const navAuth = document.querySelector('.nav-auth');
        
        if (user && user.user) {
            // Dùng renderer thống nhất để có đầy đủ menu (profile, listings, ...)
            await updateAuthUIWithUser({ user: user.user });
        } else {
            // Chưa đăng nhập - hiển thị nút đăng nhập/đăng ký
            if (navAuth && navAuth.querySelector('.user-info')) {
                resetAuthUI();
            }
        }
    } catch (error) {
        console.log('Failed to update auth UI:', error);
    }
}

// Cập nhật giao diện với user data đã có (không cần gọi API)
export async function updateAuthUIWithUser(userData) {
    try {
        const navAuth = document.querySelector('.nav-auth');
        
        if (userData && userData.user && navAuth) {
            // Ẩn nút đăng nhập/đăng ký và hiển thị user dropdown
            const userName = userData.user.fullName || userData.user.email.split('@')[0];
            
            navAuth.innerHTML = `
                <div class="user-dropdown">
                    <button class="user-btn" onclick="window.toggleUserMenu(event)">
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
                        <a href="#" class="dropdown-item" onclick="window.openProfileModal()">
                            <i class="fas fa-user-edit"></i> 
                            <span>Hồ sơ cá nhân</span>
                        </a>
                        <a href="/my-listings" class="dropdown-item">
                            <i class="fas fa-list-alt"></i> 
                            <span>Tin đăng của tôi</span>
                        </a>
                        <a href="#" onclick="window.handleLogout(event)" class="dropdown-item">
                            <i class="fas fa-sign-out-alt"></i> 
                            <span>Đăng xuất</span>
                        </a>
                    </div>
                </div>
            `;
        }
    } catch (error) {
        console.log('Failed to update auth UI with user data:', error);
    }
}

// Reset giao diện về trạng thái chưa đăng nhập
export function resetAuthUI() {
    const navAuth = document.querySelector('.nav-auth');
    
    if (navAuth) {
        navAuth.innerHTML = `
            <button class="btn-login"><i class="fas fa-sign-in-alt"></i> Đăng nhập</button>
            <button class="btn-register"><i class="fas fa-user-plus"></i> Đăng ký</button>
        `;
        
        // Gắn lại event listeners
        const loginBtn = navAuth.querySelector('.btn-login');
        const registerBtn = navAuth.querySelector('.btn-register');
        
        if (loginBtn) loginBtn.addEventListener('click', openLoginModal);
        if (registerBtn) registerBtn.addEventListener('click', openRegisterModal);
    }
}
