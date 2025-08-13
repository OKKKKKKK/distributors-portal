import { IUser, JwtPayload } from "../models/user";
import { signAccessToken, signRefreshToken } from "../utils/jwt";
import userModel from '../models/user';

export async function createTokensForUser(user: IUser) {
    
    const payload: JwtPayload = {id: user._id.toString(), email: user.email, role: user.role };

    const accessToken = signAccessToken(payload);
    const refreshToken = signRefreshToken(payload);

    user.refreshToken = refreshToken;
    user.save();

    return { accessToken, refreshToken }

}

export async function clearRefreshToken(userId: string) {
  await userModel.findByIdAndUpdate(userId, { $set: { refreshToken: null } });
}
