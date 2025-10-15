/**
 * LOADING MODULE
 * Module xử lý hiển thị/ẩn loading overlay
 */

// Hiển thị loading overlay
export function showLoading() {
    const loadingOverlay = document.getElementById('loading-overlay');
    if (loadingOverlay) {
        loadingOverlay.style.display = 'flex';
    }
}

// Ẩn loading overlay
export function hideLoading() {
    const loadingOverlay = document.getElementById('loading-overlay');
    if (loadingOverlay) {
        loadingOverlay.style.display = 'none';
    }
}
