import client from '../database/pg.client.js';

const technologieDatamapper = {
  async getDefaultTechnologie() {
    const response = await client.query(
      `
            SELECT * 
            FROM techno
          ;`
    );
    return response.rows;
  },
  async relateTechnoToProject(projectId, technoId) {
    const response = await client.query(
      `
      INSERT INTO "project_techno" (project_id, techno_id)
      VALUES ($1, $2)
      `,
      [projectId, technoId]
    );
    return response.rows[0];
  },
  async relateTechnoToProfile(userId, technoId) {
    const response = await client.query(
      `
      INSERT INTO "user_techno" (user_id, techno_id)
      VALUES ($1, $2)
      `,
      [userId, technoId]
    );
    return response.rows[0];
  },
  async deleteTechnoToProject(projectId, technoId) {
    const response = await client.query(
      `
      DELETE FROM "project_techno" WHERE project_id =$1 AND techno_id = $2
      `,
      [projectId, technoId]
    );
    return response.rows[0];
  },
  async deleteTechnoToProfile(userId, technoId) {
    const response = await client.query(
      `
      DELETE FROM "user_techno" WHERE user_id =$1 AND techno_id = $2
      `,
      [userId, technoId]
    );
    return response.rows[0];
  },

  async getAllTechnoFromProject(projectId) {
    const response = await client.query(
      `
      SELECT techno_id AS id ,techno."name"  FROM project_techno JOIN "techno" ON techno_id = techno.id WHERE project_id = $1`,
      [projectId]
    );
    return response.rows;
  },
  async getAllTechnoFromProfile(userId) {
    const response = await client.query(
      `
      SELECT techno_id AS id ,techno."name"  FROM user_techno JOIN "techno" ON techno_id = techno.id WHERE user_id = $1`,
      [userId]
    );
    return response.rows;
  },
};

export default technologieDatamapper;
