export const sendResponse = (res: any, status: number, data: any) => {
  res.status(status).json(data);
};
