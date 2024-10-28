import client from '../database/pg.client.js';

const userDatamapper = {
  async checkByEmail(email) {
    const response = await client.query(
      `
            SELECT * FROM "user" 
              WHERE "email" = $1
            ;`,
      [email]
    );
    return response.rows[0];
  },
  async save(email, password, pseudo) {
    const response = await client.query(
      `
      INSERT INTO "user"("email", "password", "pseudo")
      VALUES ($1, $2, $3)
      RETURNING *
      ;`,
      [email, password, pseudo]
    );
    return response.rows[0];
  },
};

export default userDatamapper;
