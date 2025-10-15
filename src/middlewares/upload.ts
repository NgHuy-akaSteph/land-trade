import { Request, Response, NextFunction } from 'express';
import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../configs/cloudiary.config';

export const uploadImage = (req: Request, res: Response, next: NextFunction) => {

}