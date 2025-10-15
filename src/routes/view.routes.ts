import { Router } from 'express';
import {
  renderHomePage,
  renderProfilePage
} from '../controllers/view.controller';

const router = Router();

// Các route cho rendering view
router.get('/', renderHomePage);
router.get('/profile', renderProfilePage);

export default router;
