import client from '../database/pg.client.js';

const userDatamapper = {
  async findBySlug(slug) {
    const response = await client.query(
      `
                  SELECT * FROM "user" 
                    WHERE "slug" = $1
                  ;`,
      [slug]
    );
    return response.rows[0];
  },
  async findByEmail(email) {
    const response = await client.query(
      `
            SELECT * FROM "user" 
              WHERE "email" = $1
            ;`,
      [email]
    );
    return response.rows[0];
  },
  async findById(id) {
    const response = await client.query(
      `
            SELECT * FROM "user" 
              WHERE "id" = $1
            ;`,
      [id]
    );
    return response.rows[0];
  },
  async save(email, password, pseudo, slug, image) {
    const response = await client.query(
      `
      INSERT INTO "user"("email", "password", "pseudo", "slug", "image")
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
      ;`,
      [email, password, pseudo, slug, image]
    );
    return response.rows[0];
  },
  async changePassword(password, id) {
    const response = await client.query(
      `UPDATE "user"
       SET "password" = $1
       WHERE id = $2
       RETURNING *;
`,
      [password, id]
    );
  },
  async getDetailsUser(userSlug) {
    const response = await client.query(
      `
SELECT 
    u.*,  
    CASE 
        WHEN COUNT(t.id) > 0 THEN json_agg(
            json_build_object(
                'id', t.id,
                'name', t.name,
                'image', t.image
            )
        )
        ELSE '[]'::json 
    END AS techno
FROM 
    "user" u
LEFT JOIN 
    user_techno ut ON u.id = ut.user_id
LEFT JOIN 
    techno t ON ut.techno_id = t.id
WHERE 
    u.slug = $1
GROUP BY 
    u.id;



      `,
      [userSlug]
    );
    return response.rows[0];
  },
};

export default userDatamapper;
