import * as express from 'express';
import { login, userRegister } from '../controllers/auth.controller';

export const userRouter = express.Router();
userRouter.use(express.json());

userRouter.post('/register', userRegister);
userRouter.post('/login', login);