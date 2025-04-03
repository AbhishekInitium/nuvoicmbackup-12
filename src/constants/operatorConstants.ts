
// String operators
export const STRING_OPERATORS = [
  { value: '=', label: 'Equals' },
  { value: '!=', label: 'Not Equals' },
  { value: 'contains', label: 'Contains' },
  { value: 'startsWith', label: 'Starts With' },
  { value: 'endsWith', label: 'Ends With' }
];

// Numeric operators
export const NUMERIC_OPERATORS = [
  { value: '>', label: 'Greater Than' },
  { value: '<', label: 'Less Than' },
  { value: '=', label: 'Equals' },
  { value: '>=', label: 'Greater Than or Equals' },
  { value: '<=', label: 'Less Than or Equals' },
  { value: '!=', label: 'Not Equals' }
];

// Boolean operators
export const BOOLEAN_OPERATORS = [
  { value: '=', label: 'Equals' },
  { value: '!=', label: 'Not Equals' }
];

// Date operators
export const DATE_OPERATORS = [
  { value: '>', label: 'After' },
  { value: '<', label: 'Before' },
  { value: '=', label: 'On' },
  { value: '>=', label: 'On or After' },
  { value: '<=', label: 'On or Before' },
  { value: '!=', label: 'Not On' }
];

// Get operators based on data type
export const getOperatorsByDataType = (dataType: string | undefined) => {
  if (!dataType) return NUMERIC_OPERATORS;
  
  const type = dataType.toLowerCase();
  
  // Check for character/string type fields first
  if (type.startsWith('char') || type === 'string' || type === 'text') {
    return STRING_OPERATORS;
  } else if (type === 'number' || type === 'decimal' || type === 'integer' || type === 'int8' || type === 'float') {
    return NUMERIC_OPERATORS;
  } else if (type === 'boolean') {
    return BOOLEAN_OPERATORS;
  } else if (type === 'date') {
    return DATE_OPERATORS;
  } else {
    // Default to string operators for all other types
    return STRING_OPERATORS;
  }
};
