import { calculatePagination, TOptions } from "../../utils/pagenationHelpers";

const getAllDoctors = async (options: TOptions) => {
  const { page, limit, skip, sortBy, sortOrder } = calculatePagination(options);
  console.log(page, limit, skip, sortBy, sortOrder);
};

export const doctorServices = {
  getAllDoctors,
};
