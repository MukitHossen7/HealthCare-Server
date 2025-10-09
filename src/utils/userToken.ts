import config from "../config";
import { generateToken } from "./jwt";

type TokenPayload = {
  email: string;
  role: string;
  id: string;
};

export const createUserTokens = (tokenPayload: TokenPayload) => {
  const accessToken = generateToken(
    tokenPayload,
    config.JWT.ACCESS_TOKEN_SECRET,
    config.JWT.ACCESS_TOKEN_EXPIRATION
  );

  const refreshToken = generateToken(
    tokenPayload,
    config.JWT.REFRESH_TOKEN_SECRET,
    config.JWT.REFRESH_TOKEN_EXPIRATION
  );

  return {
    accessToken,
    refreshToken,
  };
};
