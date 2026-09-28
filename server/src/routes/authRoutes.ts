import { Router } from 'express';
import {
  register,
  login,
  getMe,
  demoLogin,
  updateProfile,
  forgotPassword,
  resetPassword,
  changePassword,
  logout,
  getUserProfile
} from '../controllers/authController.js';
import { authenticate } from '../middleware/auth.js';
import {
  registerValidation,
  loginValidation,
  forgotPasswordValidation,
  resetPasswordValidation,
  changePasswordValidation
} from '../validators/index.js';

const router = Router();

router.post('/register', registerValidation, register);
router.post('/login', loginValidation, login);
router.get('/demo/:role', demoLogin);
router.post('/forgot-password', forgotPasswordValidation, forgotPassword);
router.post('/reset-password', resetPasswordValidation, resetPassword);

// Protected Auth Routes
router.get('/me', authenticate, getMe);
router.put('/profile', authenticate, updateProfile);
router.post('/change-password', authenticate, changePasswordValidation, changePassword);
router.post('/logout', authenticate, logout);
router.get('/profile/:id', authenticate, getUserProfile);

export default router;


