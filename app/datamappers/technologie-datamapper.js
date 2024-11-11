import client from '../database/pg.client.js';

const projectDatamapper = {
  async returnDefaultTechnologie() {
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
