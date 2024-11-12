import client from '../database/pg.client.js';

const projectDatamapper = {
  async findBySlug(slug) {
    const response = await client.query(
      `
                  SELECT * FROM "project" 
                    WHERE "slug" = $1
                  ;`,
      [slug]
    );
    return response.rows[0];
  },
  async searchProjectByTechnoAndRhythm(technos, rhythm) {
    const response = await client.query(
      `
         SELECT 
    p.*,
    json_agg(
        json_build_object(
            'id', t.id,
            'name', t.name,
            'image', t.image,
            'created_at', t.created_at
        )
    ) AS techno
FROM 
    project p
JOIN 
    project_techno pt ON p.id = pt.project_id
JOIN 
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
    json_agg(
        json_build_object(
            'id', t.id,
            'name', t.name,
            'image', t.image,
            'created_at', t.created_at
        )
    ) AS techno
FROM 
    project p
JOIN 
    project_techno pt ON p.id = pt.project_id
JOIN 
    techno t ON pt.techno_id = t.id
WHERE 
    p.rhythm = $1  -- Filtrer les projets par rythme
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
    json_agg(
        json_build_object(
            'id', t.id,
            'name', t.name,
            'image', t.image,
            'created_at', t.created_at
        )
    ) AS techno
FROM 
    project p
JOIN 
    project_techno pt ON p.id = pt.project_id
JOIN 
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
      `SELECT 
    p.*,  
    json_agg(
        json_build_object(
            'id', t.id,
            'name', t.name,
            'image', t.image
        )
    ) AS techno
FROM 
    project p
JOIN 
    project_techno pt ON p.id = pt.project_id
JOIN 
    techno t ON pt.techno_id = t.id
GROUP BY 
    p.id
ORDER BY 
    p.created_at DESC;
`
    );
    return response.rows;
  },
  async getDetailsProject(projectSlug) {
    const response = await client.query(
      `
        SELECT 
    p.*,  
    u.pseudo, 
    u.slug AS user_slug,
    json_agg(
        json_build_object(
            'id', t.id,
            'name', t.name,
            'image', t.image
        )
    ) AS techno
FROM 
    project p
JOIN 
    project_techno pt ON p.id = pt.project_id
JOIN 
    techno t ON pt.techno_id = t.id
JOIN
    "user" u ON p.user_id = u.id  
WHERE 
    p.slug = $1  
GROUP BY 
    p.id, u.pseudo, u.slug; `,
      [projectSlug]
    );
    return response.rows[0];
  },
};

export default projectDatamapper;
