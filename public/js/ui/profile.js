// profile.js - Quản lý giao diện và sự kiện trang Hồ sơ cá nhân

// public/js/ui/profile.js
import { uploadImages, deleteImage, previewImage } from '../utils/image-upload.js'; // Import hàm

// ...existing code...

// Hàm upload avatar với preview
async function uploadAvatar(file) {
  try {
    // Preview ngay lập tức
    previewImage(file, 'avatar-preview');

    // Upload lên server
    const uploadedImages = await uploadImages([file]); // Upload 1 file
    const { url, publicId } = uploadedImages[0];

    // Gửi kèm API update profile (ví dụ: lưu avatarUrl và publicId)
    await updateProfile({ avatarUrl: url, avatarPublicId: publicId });

    alert('Upload avatar thành công!');
  } catch (error) {
    alert('Upload thất bại: ' + error.message);
    // Reset preview nếu lỗi
    document.getElementById('avatar-preview').src = 'default-avatar.jpg';
  }
}

// Hàm update profile (gửi kèm avatar info)
async function updateProfile(profileData) {
  try {
    const response = await fetch('/api/users/profile', { // Giả sử API update profile
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(profileData),
      credentials: 'include',
    });

    const data = await response.json();
    if (!data.success) {
      throw new Error(data.message);
    }
  } catch (error) {
    throw error;
  }
}

// Event listener cho input file avatar
document.getElementById('avatar-input').addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (file) {
    uploadAvatar(file);
  }
});

// Ví dụ cho xóa avatar (nếu cần)
async function deleteAvatar(publicId) {
  try {
    await deleteImage(publicId);
    document.getElementById('avatar-preview').src = 'default-avatar.jpg';
    alert('Xóa avatar thành công!');
  } catch (error) {
    alert('Xóa thất bại: ' + error.message);
  }
}

// ...existing code...

