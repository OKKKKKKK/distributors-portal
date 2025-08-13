import express, { Router } from 'express';
import { requireAuth } from '../middlewares/auth';
import { getUsers } from '../controllers/user.controller';

export const userRouter = express.Router();
userRouter.use(express.json());

userRouter.get('/', requireAuth, getUsers);