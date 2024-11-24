import client from '../database/pg.client.js';

const conversationDatamapper = {
  async checkIfUserIsInConversation(userId, conversationId) {
    const response = await client.query(
      `
              SELECT * 
              FROM conversation 
              WHERE (user_id1 = $1 OR user_id2 =$1) AND id = $2
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
    return response.rows[0];
  },
  async sendFirstMessage(projectId, userId, userIdCreated) {
    const response = await client.query(
      `
      INSERT INTO "conversation" (project_id, user_id1, user_id2)
        VALUES ($1, $2, $3) RETURNING *`,
      [projectId, userId, userIdCreated]
    );
    return response.rows[0];
  },

  async sendMessage(message, userId, conversationId) {
    await client.query(
      `
      INSERT INTO "message" (content, user_id, conversation_id)
        VALUES ($1, $2, $3)`,
      [message, userId, conversationId]
    );
  },
  async checkConversationExist(projectId, userId) {
    const response = await client.query(
      `
      SELECT * FROM "conversation" WHERE project_id = $1 AND (user_id1 = $2 OR user_id2 = $2)`,
      [projectId, userId]
    );
    return response.rows[0];
  },
  async getAllConversations(userId) {
    const response = await client.query(
      `
      
SELECT 
    c.id,
    m.content AS message, 
    m.user_id AS author_message_id, 
    u.pseudo AS author_message_pseudo, 
    p.title AS title, 
    p.image AS image
FROM "conversation" c
LEFT JOIN (
    SELECT conversation_id, MAX(created_at) AS latest_message_date
    FROM message
    GROUP BY conversation_id
) latest ON c.id = latest.conversation_id
LEFT JOIN message m ON m.conversation_id = c.id AND m.created_at = latest.latest_message_date
LEFT JOIN "user" u ON u.id = m.user_id
LEFT JOIN project p ON p.id = c.project_id
WHERE user_id1 = $1 OR user_id2 = $1
ORDER BY m.created_at DESC;


  `,
      [userId]
    );
    return response.rows;
  },

  async getMessagesFromConversation(conversationId) {
    const response = await client.query(
      `
      SELECT  
    c.id,
    p.title AS title,
    p.slug AS project_slug,
    p.image AS image,
    u.pseudo AS pseudo,
    u.slug AS user_slug,
    COALESCE(
        jsonb_agg(
            jsonb_build_object(
                'id', m.id,
                'author_id', m.user_id,
                'content', m.content,
                'date', to_char(m.created_at, 'Le DD/MM/YYYY à HH24"h"MI')
            )
        ) FILTER (WHERE m.id IS NOT NULL), 
        '[]'::jsonb
    ) AS messages
FROM 
    conversation c
JOIN 
    "user" AS user1 ON c.user_id1 = user1.id
JOIN 
    "user" AS user2 ON c.user_id2 = user2.id
JOIN "project" AS p ON c.project_id = p.id   
JOIN "user" AS u ON u.id = p.user_id 
JOIN LATERAL (
    SELECT 
        m.id,
        m.user_id,
        m.content,
        m.created_at
    FROM "message" AS m
    WHERE m.conversation_id = c.id
    ORDER BY m.created_at 
) AS m ON true 
WHERE 
    c.id = $1
GROUP BY 
    c.id, p.id, u.pseudo, u.slug;
 
 `,
      [conversationId]
    );
    return response.rows[0];
  },
};

export default conversationDatamapper;
