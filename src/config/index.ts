import dotenv from "dotenv";
dotenv.config();

export default {
  PORT: process.env.PORT as string,
  NODE_ENV: process.env.NODE_ENV as string,
  BCRYPTSALTROUND: process.env.BCRYPTSALTROUND as string,
  CLOUDINARY: {
    CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME as string,
    CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY as string,
    CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET as string,
  },
  JWT: {
    ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET as string,
    ACCESS_TOKEN_EXPIRATION: process.env.ACCESS_TOKEN_EXPIRATION as string,
    REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET as string,
    REFRESH_TOKEN_EXPIRATION: process.env.REFRESH_TOKEN_EXPIRATION as string,
  },
  OPEN_ROUTER: {
    OPEN_ROUTER_API_KEY: process.env.OPEN_ROUTER_API_KEY as string,
  },
  STRIPE: {
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY as string,
    STRIPE_PUBLISHABLe_KEY: process.env.STRIPE_PUBLISHABLe_KEY as string,
    success_url: process.env.success_url as string,
    cancel_url: process.env.cancel_url as string,
    webhook_secret: process.env.webhook_secret as string,
  },
};
