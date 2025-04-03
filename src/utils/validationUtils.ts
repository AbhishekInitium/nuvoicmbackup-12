
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

// Add the missing validatePlanFields function
export const validatePlanFields = (plan: any): string[] => {
  const errors: string[] = [];
  
  // Basic validation for required fields
  if (!plan.name || plan.name.trim() === '') {
    errors.push("Plan name is required");
  }
  
  if (!plan.description || plan.description.trim() === '') {
    errors.push("Plan description is required");
  }
  
  // Validate date range if both dates are provided
  if (plan.effectiveStart && plan.effectiveEnd) {
    const startDate = new Date(plan.effectiveStart);
    const endDate = new Date(plan.effectiveEnd);
    
    if (startDate > endDate) {
      errors.push("End date must be after start date");
    }
  }
  
  return errors;
};
