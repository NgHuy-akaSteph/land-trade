import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';
import cloudinary from './cloudiary.config';
import { AppException } from '../exceptions/app.exception';
import { ErrorCode } from '../exceptions/error-code';

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => ({
    folder: 'real-estate',
    format: file.mimetype.split('/')[1], // Giữ nguyên định dạng gốc
    transformation: [{ width: 500, height: 500, crop: 'limit' }],
  }),
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // Giới hạn 5MB
  },
  fileFilter: (req, file, cb) => {
    // Chỉ cho phép jpg, jpeg, png
    if (
      file.mimetype === 'image/jpeg' ||
      file.mimetype === 'image/jpg' ||
      file.mimetype === 'image/png'
    ) {
      cb(null, true);
    } else {
      cb(
        new AppException(
          ErrorCode.INVALID_INPUT,
          'Chỉ chấp nhận file JPG, PNG, JPEG!',
        ) as any,
        false,
      );
    }
  },
});

export default upload;
