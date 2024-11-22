import client from '../database/pg.client.js';

const conversationDatamapper = {
  async checkIfUserIsInConversation(userId, conversationId) {
    const response = await client.query(
      `
              SELECT * 
              FROM conversation 
              WHERE user_id1 = $1 OR WHERE user_id2 =$1 AND id = $2
            ;`,
      [userId, conversationId]
    );
    return response.rows[0];
  },
  async saveMessage(message, userId, conversationId) {
    const response = await client.query(
      `
        INSERT INTO "message" (content, user_id, conversation_id)
        VALUES ($1, $2, $3)
        RETURNING *`,
      [message, userId, conversationId]
    );
    return response.data[0];
  },
};

export default conversationDatamapper;
