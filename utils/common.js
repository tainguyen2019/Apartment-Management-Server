const isNullable = (value) => {
  return [undefined, null].includes(value);
};

const toArray = (value) => {
  if (Array.isArray(value)) return value;

  if (isNullable(value)) return [];

  return [value];
};

const validateUsername = (str) => {
  const regex = /^[a-zA-Z][a-zA-Z0-9._]{2,}[a-zA-Z0-9]$/;
  return regex.test(str);
};

module.exports = {
  toArray,
  isNullable,
  validateUsername,
};
