import { Product } from '../../utils/interfaces/product';
import pool from '../db/db';

export const updateProduct = async (product: Product, id: number) => {
  const client = await pool.connect();
  try {
    const result = await client.query(
      `UPDATE product SET name=$1, description=$2, brand=$3, stock=$4, 
        seller_sku=$5, status=$6, id_category_mk=$7 
      WHERE id = $8`,
      [
        product.name,
        product.description,
        // product.brand,
        product.stock,
        // product.seller_sku,
        product.status,
        // product.id_category_mk,
        id,
      ],
    );
    console.log(result);
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    client.release();
  }
};
