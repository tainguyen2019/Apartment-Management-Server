const bcrypt = require('bcrypt');
const saltRounds = 10;

/**
 * Generate salt
 * @returns {Promise<string>} Salt
 */
const generateSalt = () => bcrypt.genSalt(saltRounds);

/**
 * Encrypt password
 * @param {string} plainText Plain text password
 * @returns {string} encrypted password
 */
const encrypt = async (plainText) => {
  const salt = await generateSalt();
  const hash = await bcrypt.hash(plainText, salt);

  return hash;
};

/**
 * Verify password
 * @param {string} plainText Plain text password
 * @param {string} hash hash password
 * @returns {boolean}
 */
const verify = (plainText, hash) => bcrypt.compare(plainText, hash);

module.exports = {
  encrypt,
  verify,
  generateSalt,
};
