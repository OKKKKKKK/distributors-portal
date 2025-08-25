import { Request, Response } from "express";
import UserModel, { JwtPayload } from "../models/user";
import {
  clearRefreshToken,
  createTokensForUser,
} from "../services/authService";
import { verifyRefreshToken } from "../utils/jwt";

export const userRegister = async (req: Request, res: Response) => {
  const { name, email, password, role } = req.body;

  if (!email || !password)
    return res.status(400).json({ message: "Email and password required" });

  const isEmailAlreadyExist = await UserModel.findOne({
    email: email,
  });
  if (isEmailAlreadyExist) {
    return res.status(400).json({
      status: 400,
      message: "Email all ready in use",
    });
  }

  const user = new UserModel({ name, email, password, role });
  await user.save();

  const { accessToken, refreshToken } = await createTokensForUser(user);

  res.cookie("refreshToken", refreshToken, {
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
  });

  return res.json({ accessToken });
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user = await UserModel.findOne({ email });
  if (!user) {
    return res
      .status(401)
      .json({ status: 401, message: "Invalid Credentials" });
  }
  const checkPass = await user.comparePassword(password);
  if (!checkPass) {
    return res
      .status(401)
      .json({ status: 401, message: "Invalid Credentials" });
  }

  const { accessToken, refreshToken } = await createTokensForUser(user);

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  return res.json({ accessToken });
};

export const refreshTokenHandler = async (req: Request, res: Response) => {
  const token = req.cookies?.refreshToken;
  if (!token) return res.status(401).json({ message: 'No refresh token' });

  try {
    const payload = verifyRefreshToken(token) as any;
    const user = await UserModel.findById(payload.id);
    if (!user || user.refreshToken !== token) {
      return res.status(401).json({ message: 'Invalid refresh token' });
    }

    // issue new tokens
    const { accessToken, refreshToken } = await createTokensForUser(user);

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    return res.json({ accessToken });
  } catch (err) {
    return res.status(401).json({ message: 'Invalid refresh token' });
  }
}

export const logout = async (req: Request, res: Response) => {
  const refreshToken = req.cookies?.refreshToken;
  if (refreshToken) {
    try {
      const token: any = verifyRefreshToken(refreshToken);
      await clearRefreshToken(token?.id);
    } catch (err) {
      // console.error("logout error");
    }
  }
  res.clearCookie(refreshToken, {
    sameSite: "strict",
    httpOnly: true,
  });
  return res.json({ message: "logged out" });
};
