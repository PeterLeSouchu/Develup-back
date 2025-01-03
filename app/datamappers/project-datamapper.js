import client from '../database/pg.client.js';

const projectDatamapper = {
  async findBySlug(slug) {
    const response = await client.query(
      `
                  
SELECT 
    p.*, 
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
    project p
LEFT JOIN 
    project_techno pt ON p.id = pt.project_id
LEFT JOIN 
    techno t ON pt.techno_id = t.id
WHERE 
    p.slug = $1
GROUP BY 
    p.id
`,
      [slug]
    );
    return response.rows[0];
  },
  async findById(id) {
    const response = await client.query(
      `
SELECT 
    p.*, 
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
    project p
LEFT JOIN 
    project_techno pt ON p.id = pt.project_id
LEFT JOIN 
    techno t ON pt.techno_id = t.id
WHERE 
    p.id = $1
GROUP BY 
    p.id
`,
      [id]
    );
    return response.rows[0];
  },
  async deleteProject(id) {
    const response = await client.query(
      `
        DELETE FROM "project"
            WHERE id = $1
            RETURNING *;
        `,
      [id]
    );
    return response.rows[0];
  },
  async createProject(
    title,
    rhythm,
    description,
    image,
    imageId,
    slug,
    userId
  ) {
    const response = await client.query(
      `
        INSERT INTO "project" (title, rhythm, description, image, image_id, slug, user_id)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *;
        `,
      [title, rhythm, description, image, imageId, slug, userId]
    );
    return response.rows[0];
  },
  async searchProjectByTechnoAndRhythm(technos, rhythm) {
    const response = await client.query(
      `
         SELECT 
    p.*,
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
    project p
LEFT JOIN 
    project_techno pt ON p.id = pt.project_id
LEFT JOIN 
    techno t ON pt.techno_id = t.id
WHERE 
    p.id IN (
        SELECT p2.id
        FROM project p2
        JOIN project_techno pt2 ON p2.id = pt2.project_id
        JOIN techno t2 ON pt2.techno_id = t2.id
        WHERE p2.rhythm = $1
          AND t2.name = ANY($2::text[])
        GROUP BY p2.id
        HAVING COUNT(DISTINCT t2.name) = $3
    )
GROUP BY 
    p.id;
 `,
      [rhythm, technos, technos.length]
    );
    return response.rows;
  },
  async searchProjectByRhythm(rhythm) {
    const response = await client.query(
      `SELECT 
    p.*,
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
    project p
LEFT JOIN 
    project_techno pt ON p.id = pt.project_id
LEFT JOIN 
    techno t ON pt.techno_id = t.id
WHERE 
    p.rhythm = $1  
GROUP BY 
    p.id;

`,
      [rhythm]
    );
    return response.rows;
  },
  async searchProjectByTechno(technos) {
    const response = await client.query(
      `
          SELECT 
    p.*,
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
    project p
LEFT JOIN 
    project_techno pt ON p.id = pt.project_id
LEFT JOIN 
    techno t ON pt.techno_id = t.id
WHERE 
    p.id IN (
        SELECT p2.id
        FROM project p2
        JOIN project_techno pt2 ON p2.id = pt2.project_id
        JOIN techno t2 ON pt2.techno_id = t2.id
        WHERE t2.name = ANY($1::text[])
        GROUP BY p2.id
        HAVING COUNT(DISTINCT t2.name) = $2
    )
GROUP BY 
    p.id;
`,
      [technos, technos.length]
    );
    return response.rows;
  },
  async getDefaultProjects() {
    const response = await client.query(
      `
SELECT 
    p.*,  
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
    project p
LEFT JOIN 
    project_techno pt ON p.id = pt.project_id
LEFT JOIN 
    techno t ON pt.techno_id = t.id
GROUP BY 
    p.id
ORDER BY 
    p.created_at DESC;

`
    );
    return response.rows;
  },
  async getPersonalProjects(userId) {
    const response = await client.query(
      `
SELECT 
    p.*, 
    u.id AS user_id, 
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
    project p
LEFT JOIN 
    project_techno pt ON p.id = pt.project_id
LEFT JOIN 
    techno t ON pt.techno_id = t.id
JOIN 
    "user" u ON p.user_id = u.id
WHERE 
    u.id = $1
GROUP BY 
    p.id, u.id
ORDER BY 
    p.created_at DESC;

`,
      [userId]
    );
    return response.rows;
  },
  async getDetailsProjectBySlug(projectSlug) {
    const response = await client.query(
      `
       SELECT 
    p.*,  
    u.pseudo, 
    u.slug AS user_slug,
    COALESCE(
        jsonb_agg(
            DISTINCT jsonb_build_object(
                'id', t.id,
                'name', t.name,
                'image', t.image
            )
        ) FILTER (WHERE t.id IS NOT NULL), 
        '[]'::jsonb
    ) AS techno
FROM 
    project p
JOIN 
    "user" u ON p.user_id = u.id  
LEFT JOIN 
    project_techno pt ON p.id = pt.project_id
LEFT JOIN 
    techno t ON pt.techno_id = t.id
WHERE 
    p.slug = $1  
GROUP BY 
    p.id, u.pseudo, u.slug;

 `,
      [projectSlug]
    );
    return response.rows[0];
  },
  async editTitleProject(title, newProjectSlug, projectId) {
    await client.query(
      `
        UPDATE "project"
        SET 
            title = $1,
            slug = $2
        WHERE 
            id = $3
            RETURNING * ;

        `,
      [title, newProjectSlug, projectId]
    );
  },
  async editRhythmProject(rhythm, projectId) {
    await client.query(
      `
        UPDATE "project"
        SET 
            rhythm = $1
        WHERE 
            id = $2 ;

        `,
      [rhythm, projectId]
    );
  },
  async editDescriptionProject(description, projectId) {
    await client.query(
      `
        UPDATE "project"
        SET 
            description = $1
        WHERE 
            id = $2 ;

        `,
      [description, projectId]
    );
  },
  async editImageProject(image, imageId, projectId) {
    await client.query(
      `
        UPDATE "project"
        SET 
            image = $1,
            image_id = $2
        WHERE 
            id = $3 ;

        `,
      [image, imageId, projectId]
    );
  },
  async findAllProjectByUserId(userId) {
    const response = await client.query(
      `
      SELECT * FROM project WHERE user_id = $1
      `,
      [userId]
    );
    return response.rows;
  },
};

export default projectDatamapper;
