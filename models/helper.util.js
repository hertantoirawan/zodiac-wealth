import jsSHA from 'jssha';

/**
 * Get hash value of a text.
 * @param {*} text Text to hash.
 * @returns Hash value of a text.
 */
export const getHashValue = (text) => {
  // eslint-disable-next-line new-cap
  const shaObj = new jsSHA('SHA-512', 'TEXT', { encoding: 'UTF8' });
  shaObj.update(text);
  return shaObj.getHash('HEX');
};

/**
 * Check if user is logged in.
 * @returns True, if logged in. False, otherwise.
 */
export const isLoggedIn = (req) => (req.cookies && req.cookies.user);
