import express from 'express';
const router = express.Router();
import {getUserBySearch} from '../controllers/UserController.js';
import  isLogin from '../middleware/isAuthenticated.js';

router.get('/SearchUser',isLogin,getUserBySearch,(req,res)=>{
    
})


export default router;