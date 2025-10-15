/**
 * AUTH API MODULE
 * Module xử lý các API calls liên quan đến authentication
 * Sử dụng Axios để có error handling tốt hơn
 */


// Sử dụng axios từ CDN (window.axios)
const axios = window.axios;

// Create axios instance with base configuration
const api = axios.create({
    baseURL: window.location.origin,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Helper function to handle Zod validation errors
const handleValidationErrors = (errorData) => {
    if (!errorData) return null;
    
    // Format mới: { error: { details: [...] } }
    if (errorData.error && Array.isArray(errorData.error.details)) {
        const errorMessages = errorData.error.details.map(item => {
            const fieldName = getVietnameseFieldName(item.field);
            return `${fieldName}: ${item.message}`;
        });
        return errorMessages.join('\n');
    }
    
    // Format cũ: { errors: {...} } hoặc { errors: [...] }
    const errors = errorData.errors || errorData;
    
    if (!errors || typeof errors !== 'object') return null;
    
    let errorMessages = [];
    
    if (Array.isArray(errors)) {
        errors.forEach(error => {
            if (error.path && error.message) {
                const field = Array.isArray(error.path) ? error.path.join('.') : error.path;
                const vietnameseField = getVietnameseFieldName(field);
                errorMessages.push(`${vietnameseField}: ${error.message}`);
            } else if (error.field && error.message) {
                const vietnameseField = getVietnameseFieldName(error.field);
                errorMessages.push(`${vietnameseField}: ${error.message}`);
            } else if (typeof error === 'string') {
                errorMessages.push(error);
            }
        });
    } else if (typeof errors === 'object') {
        Object.keys(errors).forEach(field => {
            const vietnameseField = getVietnameseFieldName(field);
            errorMessages.push(`${vietnameseField}: ${errors[field]}`);
        });
    }
    
    return errorMessages.length > 0 ? errorMessages.join('\n') : null;
};

// Map English field names to Vietnamese
const getVietnameseFieldName = (field) => {
    const fieldNames = {
        'email': 'Email',
        'password': 'Mật khẩu',
        'confirmPassword': 'Xác nhận mật khẩu',
        'fullName': 'Họ tên',
        'name': 'Họ tên',
        'phone': 'Số điện thoại',
        'phoneNumber': 'Số điện thoại',
        'terms': 'Điều khoản',
        'acceptTerms': 'Điều khoản',
        'username': 'Tên đăng nhập',
        'address': 'Địa chỉ',
        'city': 'Thành phố',
        'district': 'Quận/Huyện',
        'ward': 'Phường/Xã'
    };
    
    return fieldNames[field] || field.charAt(0).toUpperCase() + field.slice(1);
};

// Đăng nhập
export async function loginUser(credentials) {
    try {
        const res = await api({
            method: 'POST',
            url: '/api/v1/auth/login',
            data: credentials
        });

        if (res.data && res.data.success) {
            return res.data;
        } else {
            throw new Error(res.data?.message || 'Đăng nhập thất bại');
        }
        
    } catch (err) {
        if (err.response) {
            const { status, data } = err.response;
            
            if (status === 401) {
                throw new Error('Email hoặc mật khẩu không đúng');
            } else if (status === 400 || status === 422) {
                // Xử lý validation errors
                const validationMessage = handleValidationErrors(data);
                throw new Error(validationMessage || data?.error?.message || data?.message || 'Thông tin đăng nhập không hợp lệ');
            } else if (status >= 500) {
                throw new Error('Lỗi server. Vui lòng thử lại sau');
            } else {
                throw new Error(data?.message || `Lỗi ${status}`);
            }
        } else if (err.request) {
            throw new Error('Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng');
        } else {
            throw new Error(err.message || 'Có lỗi không xác định xảy ra');
        }
    }
}

// Đăng ký
export async function registerUser(userData) {
    try {
        const res = await api({
            method: 'POST',
            url: '/api/v1/auth/register',
            data: userData
        });

        if (res.data && res.data.success) {
            return res.data;
        } else {
            throw new Error(res.data?.message || 'Đăng ký thất bại');
        }
        
    } catch (err) {
        if (err.response) {
            const { status, data } = err.response;
            
            if (status === 409) {
                throw new Error('Email hoặc số điện thoại đã được sử dụng');
            } else if (status === 400 || status === 422) {
                // Xử lý validation errors
                const validationMessage = handleValidationErrors(data) || 
                                        handleValidationErrors({ errors: data.issues });
                throw new Error(validationMessage || data?.error?.message || data?.message || 'Thông tin đăng ký không hợp lệ');
            } else if (status >= 500) {
                throw new Error('Lỗi server. Vui lòng thử lại sau');
            } else {
                throw new Error(data?.message || `Lỗi ${status}`);
            }
        } else if (err.request) {
            throw new Error('Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng');
        } else {
            throw new Error(err.message || 'Có lỗi không xác định xảy ra');
        }
    }
}

// Kiểm tra trạng thái đăng nhập
export async function checkAuthStatus() {
    try {
        const res = await api({
            method: 'GET',
            url: '/api/v1/auth/me'
        });

        if (res.data && res.data.success) {
            // Chuẩn hóa: trả về { user: ... } để UI tiêu thụ thống nhất
            return { user: res.data.data };
        }
        
        return null;
        
    } catch (err) {
        // Không hiển thị lỗi cho checkAuthStatus vì đây là silent check
        return null;
    }
}

// Đăng xuất
export async function logout() {
    try {
        const res = await api({
            method: 'POST',
            url: '/api/v1/auth/logout'
        });

        if (res.data && res.data.success) {
            return true;
        }
        
        return true; // Vẫn return true để logout ở client
        
    } catch (err) {
        console.error('Logout error:', err);
        return true; // Vẫn return true để logout ở client
    }
}

// Export helper functions
export { handleValidationErrors, getVietnameseFieldName };
