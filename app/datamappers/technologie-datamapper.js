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
};

export default technologieDatamapper;
