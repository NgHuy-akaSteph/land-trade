import { Request, Response } from "express";
import { deleteImage, createImage, uploadImage } from "../services/image.service";
import { ResponseUtil } from "../utils/response.util";


export const uploadImageController = async (req: Request, res: Response) => {
  const files = req.files ? (req.files as any[]) : (req.file ? [req.file] : []);
  const uploadResults = await uploadImage(files);
  return ResponseUtil.success(res, uploadResults, 'Upload ảnh thành công', 200);

};

export const deleteImageController = async (req: Request, res: Response) => {
  const imageId = req.params.id;
  await deleteImage(imageId!);
  return ResponseUtil.success(res, null, 'Xóa ảnh thành công', 200);
}