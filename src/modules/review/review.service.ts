import { Review } from "@prisma/client";

const createReview = async (payload: Partial<Review>) => {
  console.log(payload);
};

export const reviewServices = {
  createReview,
};
