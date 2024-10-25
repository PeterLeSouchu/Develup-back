import client from '../database/pg.client.js';

const userDatamapper = {
  async check(email) {
    const response = await client.query(
      `
            SELECT * FROM "user" 
              WHERE "email" = $1
            ;`,
      [email]
    );
    return response.rows[0];
  },
};

export default userDatamapper;
