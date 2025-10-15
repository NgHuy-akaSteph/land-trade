import { PrismaClient } from "@prisma/client";
import cloudinary from "../configs/cloudiary.config";
import { prisma } from "../configs/prisma.config";
import { AppException } from "../exceptions";
import { ErrorCode } from "../exceptions/error-code";
import { CreateImageDTO } from "../dtos";


/**
 * Upload ảnh lên Cloudinary 
 * @param files : Arrays cá file từ Multer
 * @returns Promise<{url: string, publicId: string}[]>
 */
export const uploadImage = async (files: any[]): 
  Promise<{url: string, publicId: string}[]> => {
  
  if (!files || files.length === 0) {
    throw new AppException(ErrorCode.INVALID_INPUT, 'Không có file được tải lên');
  }
  const uploadImage: {url: string, publicId: string}[] = [];
  
  for (const file of files) {
    try {
      const {path: url, filename: publicId} = file;
      uploadImage.push({url, publicId});
    } catch (error) {
      console.error('Lỗi khi tải ảnh lên Cloudinary:', error);
      throw new AppException(ErrorCode.BAD_REQUEST, 'Lỗi khi tải ảnh lên');
    }
  }
  return uploadImage;
};

/**
 * Xóa ảnh trên Cloudinary bằng publicId
 * @param publicId: - ID công khai của ảnh trên Cloudinary
 * @returns Promise<void>
 */

export const deleteImageFromCloudinary = async (publicId: string): Promise<void> => {
  if (!publicId) {
    throw new AppException(ErrorCode.INVALID_INPUT, 'Không có publicId để xóa ảnh');
  }
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    if (result.result !== 'ok') {
      throw new AppException(ErrorCode.BAD_REQUEST, 'Xóa ảnh không thành công');
    }
    if (result.result === 'not found') {
      throw new AppException(ErrorCode.NOT_FOUND, 'Ảnh không tồn tại trên Cloudinary');
    }
  } catch (error) {
    console.error('Lỗi khi xóa ảnh trên Cloudinary:', error);
    throw new AppException(ErrorCode.BAD_REQUEST, 'Lỗi khi xóa ảnh');
  }
};

export const createImage = async (data: CreateImageDTO): Promise<any> => {
  const image = await prisma.images.create({
    data: {
      url: data.url!,
      publicId: data.publicId,
      listingId: data.listingId || null,
    },
  });
  return image;
}

export const deleteImage = async (imageId: string): Promise<void> => {
  const image = await prisma.images.findUnique({
    where: { id: imageId },
  });
  if (!image) {
    throw new AppException(ErrorCode.NOT_FOUND, 'Image not found');
  }

  // Xóa ảnh trên Cloudinary
  await deleteImageFromCloudinary(image.publicId);
  // Xóa ảnh trong database
  await prisma.images.delete({
    where: { id: imageId },
  });
  
}