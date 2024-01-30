import "dotenv/config";
import pg from "pg";

// Get the Pool class from the pg module.
const { Pool } = pg;

export const MissionsDatabase = (dburl) => {
  return {
    connect: async () => {
      const p = new Pool({
        connectionString: dburl,
        ssl: { rejectUnauthorized: false },
      });
      return missionsQuery(p, await p.connect());
    },
  };
}; 

const missionsQuery = (pool, client) => {
  return {
    init: async () => {
      const queryText = `
        CREATE TABLE IF NOT EXISTS missions (
          id VARCHAR(30) PRIMARY KEY,
          title VARCHAR(30),
          des VARCHAR(30)
        );
        
        INSERT INTO 
          missions(id, title, des) 
        VALUES 
          ('1001', 'Sit up', '15'),
          ('1002', 'Run', '30min'),
          ('1003', 'PushUp', '30'),
          ('1004', 'Plank', '1min');
      `;
      const res = await client.query(queryText);
    },
    close: async () => {
      client.release();
      await pool.end();
    },

    createMission: async (id, title, des) => {
      const queryText = `
        INSERT INTO missions(id, title, des) VALUES($1, $2, $3) RETURNING *;
      `;
      const res = await client.query(queryText, [id, title, des]);
      return res.rows;
    },
    readMission: async (id) => {
      const queryText = `
        SELECT * FROM missions WHERE id = $1;
      `;
      const res = await client.query(queryText, [id]);
      return res.rows;
    },

    readAllMission: async () => {
      const queryText = `
        SELECT * FROM missions;
      `;
      const res = await client.query(queryText);
      return res.rows;
    },

    updateMission: async (id, title, des) => {
      const queryText = `
        UPDATE missions SET title = $2, des = $3 where id = $1 RETURNING *;
      `;
      const res = await client.query(queryText, [id, title, des]);
      return res.rows;
    },

    deleteMission: async (id) => {
      const queryText = `
        DELETE FROM missions WHERE id = $1 RETURNING *;
      `;
      const res = await client.query(queryText, [id]);
      return res.rows;
    },
  };
};

