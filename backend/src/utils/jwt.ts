import jwt, { Secret, SignOptions } from 'jsonwebtoken';
import { JwtPayload } from '../models/user';
const accessSecret = process.env.JWT_ACCESS_SECRET!;
const refreshSecret = process.env.JWT_REFRESH_SECRET!;
const accessExp = process.env.ACCESS_TOKEN_EXPIRES_IN || '60m';
const refreshExp = process.env.REFRESH_TOKEN_EXPIRES_IN || '7d';

export function signAccessToken(payload: JwtPayload) {
    // console.log("accessSecret", accessSecret);
  return jwt.sign(payload, accessSecret, { expiresIn: accessExp } as SignOptions);
}

export function signRefreshToken(payload: object) {
  return jwt.sign(payload, refreshSecret, { expiresIn: refreshExp } as SignOptions);
}

export function verifyAccessToken(token: string) {
  return jwt.verify(token, accessSecret);
}

export function verifyRefreshToken(token: string) {
  return jwt.verify(token, refreshSecret);
}
