export const validateEmail = (email: string): boolean => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

export const validatePassword = (password: string): boolean => {
  // Password must be at least 8 characters long
  return password.length >= 8;
};

export const validateSalesAmount = (salesAmount: number, minAmount: number): boolean => {
  // Sales amount must be greater than or equal to the minimum amount
  return salesAmount >= minAmount;
};

export const validateMinAmount = (salesAmount: string | number, minAmount: number): boolean => {
  if (Number(salesAmount) <= minAmount) {
    return false;
  }
  return true;
};
