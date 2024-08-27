import express from 'express';
const router = express.Router();

import UserController, { NewUser } from '../controllers/user.controller';

router.get('/user/:id', UserController.userController);
router.post('/users', NewUser.postUser);

export default router;
