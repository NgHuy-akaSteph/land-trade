// public/js/ui/profile-modal.js
import { checkAuthStatus } from '../auth/auth-api.js'; // Giả sử hàm lấy user data
import { uploadImages } from '../utils/image.js'; // Cho upload avatar

let isEditMode = false;

// Hàm mở modal và load dữ liệu user
export function openProfileModal() {
  const modal = document.getElementById('profile-modal');
  modal.style.display = 'block';

  // Load dữ liệu user
  loadUserProfile();
}

// Hàm đóng modal
export function closeProfileModal() {
  const modal = document.getElementById('profile-modal');
  modal.style.display = 'none';
  resetEditMode(); // Reset về chế độ view
}

// Load dữ liệu user từ API
async function loadUserProfile() {
  try {
    const authData = await checkAuthStatus();
    if (authData && authData.user) {
      const user = authData.user;
      document.getElementById('profile-fullname').value = user.fullName || '';
      document.getElementById('profile-email').value = user.email || '';
      document.getElementById('profile-phone').value = user.phone || '';
      if (user.avatarUrl) {
        document.getElementById('profile-avatar-img').src = user.avatarUrl;
      }
    }
  } catch (error) {
    console.error('Lỗi load profile:', error);
    alert('Không thể tải dữ liệu hồ sơ');
  }
}

// Toggle chế độ edit
function toggleEditMode() {
  isEditMode = !isEditMode;
  const inputs = ['profile-fullname', 'profile-phone']; // Email disabled luôn
  const editBtn = document.getElementById('profile-edit-btn');
  const saveBtn = document.getElementById('profile-save-btn');

  if (isEditMode) {
    // Enable edit
    inputs.forEach(id => document.getElementById(id).disabled = false);
    editBtn.style.display = 'none';
    saveBtn.style.display = 'block';
  } else {
    // Disable edit
    inputs.forEach(id => document.getElementById(id).disabled = true);
    editBtn.style.display = 'block';
    saveBtn.style.display = 'none';
  }
}

// Reset về chế độ view
function resetEditMode() {
  isEditMode = false;
  const inputs = ['profile-fullname', 'profile-phone'];
  inputs.forEach(id => document.getElementById(id).disabled = true);
  document.getElementById('profile-edit-btn').style.display = 'block';
  document.getElementById('profile-save-btn').style.display = 'none';
}

// Event listeners
document.getElementById('profile-edit-btn').addEventListener('click', toggleEditMode);

document.getElementById('profile-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  if (!isEditMode) return;

  const formData = new FormData(e.target);
  const profileData = {
    fullName: formData.get('fullName'),
    phone: formData.get('phone'),
  };

  try {
    // Giả sử API update profile
    const response = await fetch('/api/users/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(profileData),
      credentials: 'include',
    });
    const data = await response.json();
    if (data.success) {
      alert('Cập nhật thành công!');
      resetEditMode();
    } else {
      alert(data.message);
    }
  } catch (error) {
    alert('Lỗi cập nhật: ' + error.message);
  }
});

// Upload avatar
document.getElementById('avatar-upload').addEventListener('change', async (e) => {
  const file = e.target.files[0];
  if (file) {
    try {
      const uploaded = await uploadImages([file]);
      const { url } = uploaded[0];
      document.getElementById('profile-avatar-img').src = url;
      // Có thể gửi API update avatar riêng
    } catch (error) {
      alert('Upload avatar thất bại: ' + error.message);
    }
  }
});

// Export functions for global use
window.openProfileModal = openProfileModal;
window.closeProfileModal = closeProfileModal;