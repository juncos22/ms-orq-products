import pool from '../db/db';

export const deleteProduct = async (id: number) => {
  const client = await pool.connect();
  try {
    const result = await client.query(
      `UPDATE product SET status='inactive' WHERE id = $1`,
      [id],
    );
    console.log(result);
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    client.release();
  }
};
