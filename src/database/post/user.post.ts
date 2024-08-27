import pool from '../db/db';

export const postNewUser = async (name: string) => {
  let user;
  try {
    user = await pool.connect();
    const query = `
      INSERT INTO pulpo_user (name)
      VALUES ($1)
      RETURNING *;
    `;
    const values = [name];
    const result = await pool.query(query, values);

    return result.rows[0];
  } catch (error) {
    throw error;
  } finally {
    await user?.release();
  }
};
