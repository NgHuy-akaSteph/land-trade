// Xử lí preview, upload ảnh

/**
 * Preview ảnh trước khi upload dùng FileReader
 * @param {File} file - File ảnh
 * @param {string} previewElementId - ID của element <img> để hiển thị preview
 */
export function previewImage(file, previewElementId) {
  const imgElement = document.getElementById(previewElementId);
  if (!imgElement) {
    console.error(`Element with ID '${previewElementId}' not found`);
    return;
  }

  const reader = new FileReader();
  reader.onload = (e) => {
    imgElement.src = e.target.result;
  };
  reader.readAsDataURL(file);
}

/**
 * Upload ảnh lên server và trả về thông tin {url, publicId}
 * @param {File[]} files - Array các file ảnh
 * @returns {Promise<{url: string, publicId: string}[]>} - Array thông tin ảnh
 */
export async function uploadImages(files) {
  if (!file || files.length === 0) {
    throw Error('Không có ảnh nào được tải lên');
  }

  const formData = new FormData();
  files.forEach(file => {
    formData.append('images', file); // Key 'images' theo api
  })

  try {
    const response = await fetch('/api/v1/images/upload', {
      method: 'POST',
      body: formData,
      credentials: 'include'
    });

    const result = await response.json();
    if (!response.ok || !result.success) {
      throw new Error (result.message || 'Tải ảnh lên thất bại')
    }
    return result.data // Array{url, publicId}
  }
  catch (error) {
    console.log("Lỗi upload ảnh", error);
    throw error; // Rethrow để caller handle
  }
}

/**
 * Xóa ảnh trên server bằng publicId
 * @param {string} imageId 
 * @returns {Promise<void>}
 */
export async function deleteImage(imageId) {
  if (!publicId) {
    throw new Error('Thiếu publicId để xóa');
  }

  try {
    const response = await fetch(`/api/v1/images/${imageId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ publicId }),
      credentials: 'include',
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.message || 'Xóa ảnh thất bại');
    }
  } catch (error) {
    console.error('Lỗi xóa ảnh:', error);
    throw error;
  }
}