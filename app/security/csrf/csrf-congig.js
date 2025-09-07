import { doubleCsrf } from 'csrf-csrf';

const doubleCsrfOptions = {
  getSecret: () => 'Secret', // A function that optionally takes the request and returns a secret
  cookieName: '__HOST-psifi.x-csrf-token', // The name of the cookie to be used, recommend using Host prefix.
  cookieOptions: {
    sameSite: 'lax', // Recommend you make this strict if posible
    secure: true, // If we make it true, we have to prefix the cookie with  : '__Host-'
    httpOnly: true,
  },
  getTokenFromRequest: (req) => {
    // Récupérer le token dans les en-têtes ou dans req.body
    return req.headers['x-csrf-token'] || req.body?.csrfToken;
  },
};

const {
  generateToken,
  doubleCsrfProtection, // Csrf middleware to check the CSRF token
} = doubleCsrf(doubleCsrfOptions);

export { doubleCsrfProtection, generateToken };
