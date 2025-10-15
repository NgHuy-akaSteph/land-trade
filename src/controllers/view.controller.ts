import { Request, Response } from 'express';

/**
 * Render trang chủ
 */
export const renderHomePage = async (req: Request, res: Response) => {
  try {
    res.status(200).render('home', {
      title: 'LandTrade - Nền tảng giao dịch đất đai uy tín',
      description:
        'Nền tảng giao dịch đất đai trực tuyến uy tín, kết nối người mua và người bán qua môi giới chuyên nghiệp',
    });
  } catch (error) {
    console.error('Error rendering home page:', error);
    res.status(500).send('Internal Server Error');
  }
};

/**
 * Render trang hồ sơ người dùng
 */
export const renderProfilePage = (req: Request, res: Response) => {
  res.render('profile'); 
}

