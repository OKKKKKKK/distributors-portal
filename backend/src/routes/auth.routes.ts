import * as express from 'express';
import { login, logout, refreshTokenHandler, userRegister } from '../controllers/auth.controller';

export const authRouter = express.Router();
authRouter.use(express.json());

authRouter.post('/register', userRegister);
authRouter.post('/login', login);
authRouter.post('/refresh', refreshTokenHandler);
authRouter.post('/logout', logout);