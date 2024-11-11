import client from '../database/pg.client.js';

const projectDatamapper = {
  async getDefaultTechnologie() {
    const response = await client.query(
      `
            SELECT * 
            FROM techno
          ;`
    );
    return response.rows;
  },
};

export default projectDatamapper;
