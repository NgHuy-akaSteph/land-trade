import Router from "express";
import {
  uploadImageController,
  deleteImageController,
} from "../controllers/image.controller";
import { authenticate } from "../middlewares";
import upload from "../configs/multer";

const router = Router();

/**
 * @openapi
 * /api/images/upload:
 *   post:
 *     summary: Upload ảnh lên Cloudinary
 *     tags: [Images]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: Danh sách file ảnh (tối đa 5)
 *     responses:
 *       200:
 *         description: Upload thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Upload ảnh thành công"
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       url:
 *                         type: string
 *                         example: "https://res.cloudinary.com/.../image.jpg"
 *                       publicId:
 *                         type: string
 *                         example: "abc123"
 */
router.post('/upload', authenticate, upload.array('images', 5), uploadImageController);

/**
 * @openapi
 * /api/images/{id}:
 *   delete:
 *     summary: Xóa ảnh trên Cloudinary
 *     tags: [Images]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của ảnh (từ DB, nếu cần)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               publicId:
 *                 type: string
 *                 example: "abc123"
 *                 description: Public ID của ảnh trên Cloudinary
 *     responses:
 *       200:
 *         description: Xóa thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Xóa ảnh thành công"
 */
router.delete('/:id', authenticate, deleteImageController);

export default router;