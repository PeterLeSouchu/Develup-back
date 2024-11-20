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
    u.pseudo,  
    u.type,  
    u.image,  
    u.description,  
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
  async editProfileImage(image, imageId, userId) {
    const response = await client.query(
      `
      UPDATE "user"
SET 
    image = $1,
    image_id = $2
WHERE 
    id = $3
    RETURNING *
      `,
      [image, imageId, userId]
    );
    return response.rows[0];
  },
  async editDescriptionProfile(description, userId) {
    await client.query(
      `
        UPDATE "user"
        SET 
            description = $1
        WHERE 
            id = $2 ;

        `,
      [description, userId]
    );
  },
  async editTypeProfile(type, userId) {
    await client.query(
      `
        UPDATE "user"
        SET 
            type = $1
        WHERE 
            id = $2 ;

        `,
      [type, userId]
    );
  },
  async editPseudoProfile(pseudo, newProfileSlug, userId) {
    await client.query(
      `
        UPDATE "user"
        SET 
            pseudo = $1,
            slug = $2
        WHERE 
            id = $3
            RETURNING * ;

        `,
      [pseudo, newProfileSlug, userId]
    );
  },
  async getDetailsUserById(userId) {
    const response = await client.query(
      `
SELECT 
    u.pseudo,  
    u.type,  
    u.image,  
    u.description,
    u.slug,
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
    u.id = $1
GROUP BY 
    u.id;



      `,
      [userId]
    );
    return response.rows[0];
  },
  async getPersonalProfile(userId) {
    const response = await client.query(
      `
      SELECT 
      u.email, 
      u.pseudo, 
      u.description, 
      u.type, 
      u.image, 
      u.slug,
      COALESCE(
          json_agg(
              json_build_object(
                  'id', t.id,
                  'name', t.name,
                  'image', t.image
              )
          ) FILTER (WHERE t.id IS NOT NULL), 
          '[]'::json
      ) AS techno
  FROM 
      "user" u
  LEFT JOIN 
      user_techno ut ON u.id = ut.user_id
  LEFT JOIN 
      techno t ON ut.techno_id = t.id
  WHERE 
      u.id = $1
  GROUP BY 
       u.id
;

`,
      [userId]
    );
    return response.rows[0];
  },
  async deleteAccount(userId) {
    const response = await client.query(
      `
      DELETE FROM "user" WHERE id = $1
      `,
      [userId]
    );
  },
};

export default userDatamapper;
