import { Response } from "express";

type AuthToken = {
  accessToken?: string;
  refreshToken?: string;
};

export const setAuthCookie = (res: Response, authToken: AuthToken) => {
  if (authToken.accessToken) {
    res.cookie("accessToken", authToken.accessToken, {
      httpOnly: true,
      secure: true, //development false production true
      sameSite: "none",
    });
  }

  if (authToken.refreshToken) {
    res.cookie("refreshToken", authToken.refreshToken, {
      httpOnly: true,
      secure: true, //development false production true
      sameSite: "none",
    });
  }
};
