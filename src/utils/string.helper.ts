/**
 * String Helper Utilities
 * Chứa các hàm xử lý chuỗi, đặc biệt cho tiếng Việt
 */

/**
 * Loại bỏ dấu tiếng Việt và chuyển thành chuỗi không dấu
 * @param str - Chuỗi cần loại bỏ dấu
 * @returns Chuỗi không dấu, lowercase, đã chuẩn hóa
 */
export const removeVietnameseAccents = (str: string): string => {
  if (!str || typeof str !== 'string') return '';

  // Chuyển về lowercase trước
  str = str.toLowerCase().trim();

  // Map các ký tự có dấu sang không dấu
  const accentMap: { [key: string]: string } = {
    // a
    'à': 'a', 'á': 'a', 'ạ': 'a', 'ả': 'a', 'ã': 'a',
    'â': 'a', 'ầ': 'a', 'ấ': 'a', 'ậ': 'a', 'ẩ': 'a', 'ẫ': 'a',
    'ă': 'a', 'ằ': 'a', 'ắ': 'a', 'ặ': 'a', 'ẳ': 'a', 'ẵ': 'a',
    // e
    'è': 'e', 'é': 'e', 'ẹ': 'e', 'ẻ': 'e', 'ẽ': 'e',
    'ê': 'e', 'ề': 'e', 'ế': 'e', 'ệ': 'e', 'ể': 'e', 'ễ': 'e',
    // i
    'ì': 'i', 'í': 'i', 'ị': 'i', 'ỉ': 'i', 'ĩ': 'i',
    // o
    'ò': 'o', 'ó': 'o', 'ọ': 'o', 'ỏ': 'o', 'õ': 'o',
    'ô': 'o', 'ồ': 'o', 'ố': 'o', 'ộ': 'o', 'ổ': 'o', 'ỗ': 'o',
    'ơ': 'o', 'ờ': 'o', 'ớ': 'o', 'ợ': 'o', 'ở': 'o', 'ỡ': 'o',
    // u
    'ù': 'u', 'ú': 'u', 'ụ': 'u', 'ủ': 'u', 'ũ': 'u',
    'ư': 'u', 'ừ': 'u', 'ứ': 'u', 'ự': 'u', 'ử': 'u', 'ữ': 'u',
    // y
    'ỳ': 'y', 'ý': 'y', 'ỵ': 'y', 'ỷ': 'y', 'ỹ': 'y',
    // d
    'đ': 'd',
    // Uppercase variants
    'À': 'a', 'Á': 'a', 'Ạ': 'a', 'Ả': 'a', 'Ã': 'a',
    'Â': 'a', 'Ầ': 'a', 'Ấ': 'a', 'Ậ': 'a', 'Ẩ': 'a', 'Ẫ': 'a',
    'Ă': 'a', 'Ằ': 'a', 'Ắ': 'a', 'Ặ': 'a', 'Ẳ': 'a', 'Ẵ': 'a',
    'È': 'e', 'É': 'e', 'Ẹ': 'e', 'Ẻ': 'e', 'Ẽ': 'e',
    'Ê': 'e', 'Ề': 'e', 'Ế': 'e', 'Ệ': 'e', 'Ể': 'e', 'Ễ': 'e',
    'Ì': 'i', 'Í': 'i', 'Ị': 'i', 'Ỉ': 'i', 'Ĩ': 'i',
    'Ò': 'o', 'Ó': 'o', 'Ọ': 'o', 'Ỏ': 'o', 'Õ': 'o',
    'Ô': 'o', 'Ồ': 'o', 'Ố': 'o', 'Ộ': 'o', 'Ổ': 'o', 'Ỗ': 'o',
    'Ơ': 'o', 'Ờ': 'o', 'Ớ': 'o', 'Ợ': 'o', 'Ở': 'o', 'Ỡ': 'o',
    'Ù': 'u', 'Ú': 'u', 'Ụ': 'u', 'Ủ': 'u', 'Ũ': 'u',
    'Ư': 'u', 'Ừ': 'u', 'Ứ': 'u', 'Ự': 'u', 'Ử': 'u', 'Ữ': 'u',
    'Ỳ': 'y', 'Ý': 'y', 'Ỵ': 'y', 'Ỷ': 'y', 'Ỹ': 'y',
    'Đ': 'd'
  };

  // Thay thế từng ký tự có dấu
  let result = '';
  for (let i = 0; i < str.length; i++) {
    const char: string = str[i] || '';
    result += accentMap[char] || char;
  }

  // Loại bỏ ký tự đặc biệt và khoảng trắng thừa
  result = result.replace(/[^a-z0-9\s]/g, ''); // Chỉ giữ lại chữ cái, số và khoảng trắng
  result = result.replace(/\s+/g, ' '); // Thay nhiều khoảng trắng thành 1
  result = result.trim(); // Loại bỏ khoảng trắng đầu cuối

  return result;
};

/**
 * Tạo slug từ chuỗi (không dấu, lowercase, thay khoảng trắng bằng dấu gạch ngang)
 * Thường dùng cho URL, tên file
 * @param str - Chuỗi cần tạo slug
 * @returns Slug string
 */
export const createSlug = (str: string): string => {
  if (!str || typeof str !== 'string') return '';

  const noAccent = removeVietnameseAccents(str);
  return noAccent
    .replace(/\s+/g, '-') // Thay khoảng trắng bằng dấu gạch ngang
    .replace(/-+/g, '-') // Thay nhiều dấu gạch ngang thành 1
    .replace(/^-|-$/g, ''); // Loại bỏ dấu gạch ngang đầu cuối
};

/**
 * Tạo search string từ tên (không dấu, lowercase, loại bỏ khoảng trắng)
 * Thường dùng cho tìm kiếm database
 * @param str - Chuỗi cần tạo search string
 * @returns Search string
 */
export const createSearchString = (str: string): string => {
  if (!str || typeof str !== 'string') return '';

  return removeVietnameseAccents(str).replace(/\s+/g, '');
};

/**
 * Chuẩn hóa tên (loại bỏ dấu, lowercase, loại bỏ ký tự đặc biệt)
 * Giữ lại khoảng trắng tự nhiên
 * @param str - Chuỗi cần chuẩn hóa
 * @returns Chuỗi đã chuẩn hóa
 */
export const normalizeName = (str: string): string => {
  if (!str || typeof str !== 'string') return '';

  return removeVietnameseAccents(str);
};

/**
 * Chuẩn hóa tên thành Title Case (viết hoa chữ cái đầu mỗi từ)
 * @param str - Chuỗi cần chuẩn hóa
 * @returns Chuỗi Title Case
 */
export const toTitleCase = (str: string): string => {
  if (!str || typeof str !== 'string') return '';

  return str.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());
};

/**
 * Chuẩn hóa tên thành Title Case không dấu
 * @param str - Chuỗi cần chuẩn hóa
 * @returns Chuỗi Title Case không dấu
 */
export const toTitleCaseNoAccent = (str: string): string => {
  if (!str || typeof str !== 'string') return '';

  const noAccent = removeVietnameseAccents(str);
  return toTitleCase(noAccent);
};

/**
 * Kiểm tra chuỗi có phải là tên tiếng Việt hợp lệ không
 * @param str - Chuỗi cần kiểm tra
 * @returns True nếu là tên hợp lệ
 */
export const isValidVietnameseName = (str: string): boolean => {
  if (!str || typeof str !== 'string') return false;

  // Kiểm tra độ dài
  if (str.length < 2 || str.length > 50) return false;

  // Kiểm tra có chứa ít nhất một chữ cái
  if (!/[a-zA-ZàáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴÈÉẸẺẼÊỀẾỆỂỄÌÍỊỈĨÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠÙÚỤỦŨƯỪỨỰỬỮỲÝỴỶỸĐ]/.test(str)) return false;

  // Kiểm tra không có ký tự đặc biệt (trừ khoảng trắng)
  if (/[^a-zA-ZàáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴÈÉẸẺẼÊỀẾỆỂỄÌÍỊỈĨÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠÙÚỤỦŨƯỪỨỰỬỮỲÝỴỶỸĐ\s]/.test(str)) return false;

  // Kiểm tra không có quá nhiều khoảng trắng liên tiếp
  if (/\s{2,}/.test(str)) return false;

  return true;
};

/**
 * Tạo tên viết tắt từ họ tên đầy đủ
 * @param fullName - Họ tên đầy đủ
 * @returns Tên viết tắt (VD: "Nguyễn Văn A" -> "NVA")
 */
export const createInitials = (fullName: string): string => {
  if (!fullName || typeof fullName !== 'string') return '';

  return fullName
    .split(' ')
    .map(word => word.charAt(0).toUpperCase())
    .join('');
};

/**
 * Tạo tên viết tắt không dấu
 * @param fullName - Họ tên đầy đủ
 * @returns Tên viết tắt không dấu
 */
export const createInitialsNoAccent = (fullName: string): string => {
  if (!fullName || typeof fullName !== 'string') return '';

  const noAccent = removeVietnameseAccents(fullName);
  return createInitials(noAccent);
};