import express from 'express';
const router = express.Router();
import {getUserBySearch,getCurrentUser} from '../controllers/UserController.js';
import  isLogin from '../middleware/isAuthenticated.js';

router.get('/SearchUser',isLogin,getUserBySearch);
router.get("/me", isLogin, (req, res) => {
  res.status(200).json({
    success: true,
    user: req.user,
  });
});

router.get('/getCurrentUser',isLogin, getCurrentUser);

export default router;