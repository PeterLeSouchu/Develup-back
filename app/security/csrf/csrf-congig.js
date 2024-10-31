import { doubleCsrf } from 'csrf-csrf';

const doubleCsrfOptions = {
  getSecret: () => 'Secret', // A function that optionally takes the request and returns a secret
  getTokenFromRequest: (req) => req.headers['x-csrf-token'], // A function that returns the token from the request
};

const {
  generateToken,
  doubleCsrfProtection, // Csrf middleware to check the CSRF token. Put in before a controller method
} = doubleCsrf(doubleCsrfOptions);

export { doubleCsrfProtection, generateToken };
