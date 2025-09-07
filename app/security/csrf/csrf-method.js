import { generateToken } from './csrf-congig.js';

const csrfTokenMethod = (req, res) => {
  const csrfToken = generateToken(req, res);
  res.json({ csrfToken });
};
export default csrfTokenMethod;
