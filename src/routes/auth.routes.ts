import { Router } from 'express';
import {
  registerController,
  loginController,
  refreshTokenController,
  getCurrentUserController,
  changePasswordController,
  logoutController,
} from '../controllers/auth.controller';
import { authenticate } from '../middlewares/auth';

const router = Router();

/**
 * @openapi
 * /api/v1/auth/register:
 *   post:
 *     summary: Đăng ký tài khoản mới
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - fullName
 *               - email
 *               - phone
 *               - password
 *             properties:
 *               fullName:
 *                 type: string
 *                 description: Họ tên người dùng
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Email người dùng (dùng để đăng nhập)
 *               phone:
 *                 type: string
 *                 description: Số điện thoại người dùng
 *               password:
 *                 type: string
 *                 format: password
 *                 description: Mật khẩu
 *     responses:
 *       201:
 *         description: Đăng ký thành công
 *       400:
 *         description: Dữ liệu không hợp lệ hoặc email đã tồn tại
 */
router.post('/register', registerController);

/**
 * @openapi
 * /api/v1/auth/login:
 *   post:
 *     summary: Đăng nhập vào hệ thống
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Email người dùng
 *               password:
 *                 type: string
 *                 format: password
 *                 description: Mật khẩu
 *     responses:
 *       200:
 *         description: Đăng nhập thành công
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       401:
 *         description: Sai email hoặc mật khẩu
 */
router.post('/login', loginController);

/**
 * @openapi
 * /api/v1/auth/refresh-token:
 *   post:
 *     summary: Làm mới access token
 *     tags: [Auth]
 *     description: Sử dụng refresh token để lấy access token mới
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RefreshToken'
 *     responses:
 *       200:
 *         description: Làm mới token thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *                   description: JWT access token mới
 *       401:
 *         description: Token không hợp lệ hoặc đã hết hạn
 *     security:
 *       - refreshToken: []
 */
router.post('/refresh-token', refreshTokenController);

/**
 * @openapi
 * /api/v1/auth/me:
 *   get:
 *     summary: Lấy thông tin người dùng hiện tại
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Thông tin người dùng
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 email:
 *                   type: string
 *                 fullName:
 *                   type: string
 *                 phone:
 *                   type: string
 *                 role:
 *                   type: string
 *       401:
 *         description: Chưa đăng nhập hoặc token không hợp lệ
 */
router.get('/me', authenticate, getCurrentUserController);

/**
 * @openapi
 * /api/v1/auth/change-password:
 *   put:
 *     summary: Thay đổi mật khẩu
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - currentPassword
 *               - newPassword
 *               - confirmPassword
 *             properties:
 *               currentPassword:
 *                 type: string
 *                 format: password
 *                 description: Mật khẩu hiện tại
 *               newPassword:
 *                 type: string
 *                 format: password
 *                 description: Mật khẩu mới
 *               confirmPassword:
 *                 type: string
 *                 format: password
 *                 description: Xác nhận mật khẩu mới
 *     responses:
 *       200:
 *         description: Đổi mật khẩu thành công
 *       400:
 *         description: Dữ liệu không hợp lệ hoặc mật khẩu hiện tại không đúng
 *       401:
 *         description: Chưa đăng nhập hoặc token không hợp lệ
 */
router.put('/change-password', authenticate, changePasswordController);

/**
 * @openapi
 * /api/v1/auth/logout:
 *   post:
 *     summary: Đăng xuất
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Đăng xuất thành công
 *       401:
 *         description: Chưa đăng nhập hoặc token không hợp lệ
 */
router.post('/logout', authenticate, logoutController);

export default router;
