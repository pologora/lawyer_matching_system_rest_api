export const isTokenExpired = (resetTokenExpire: Date) => {
  const now = Date.now();
  const exp = new Date(resetTokenExpire).getTime();

  return now > exp;
};
