import { Product, ProductView } from '../../utils/interfaces/product';
import pool from '../db/db';

export const getProductById = async (productId: number) => {
  const client = await pool.connect();
  try {
    const result = await client.query<Product>(
      'SELECT * FROM product WHERE id = $1',
      [productId],
    );

    return result.rows[0] || null;
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    client.release();
  }
};

export const getProductViewById = async (productId: number) => {
  const client = await pool.connect();
  try {
    const result = await client.query(
      'SELECT * FROM product_view WHERE id = $1',
      [productId],
    );
    let productView: ProductView = {
      id: result.rows[0].id,
      name: result.rows[0].name,
      stock: result.rows[0].stock,
      status: result.rows[0].status,
      marketplaces: [],
      extra_values: [],
    };
    // console.log('result.rows', result.rows);
    for (const product of result.rows) {
      if (!productView.marketplaces.includes(product.marketplace)) {
        productView.marketplaces.push(product.marketplace);
      }
      if (
        !productView.extra_values.find(
          (e) => e.attribute_id === product.attribute_id,
        )
      ) {
        productView.extra_values.push({
          attribute_id: product.attribute_id,
          id_option: product.id_option,
          value: product.value,
        });
      }
    }
    return productView;
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    client.release();
  }
};

export const getProductByUserId = async (userId: number) => {
  const client = await pool.connect();
  try {
    const result = await client.query<Product>(
      `SELECT * FROM product WHERE id_user_pulpo = $1`,
      [userId],
    );
    return result.rows;
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    client.release();
  }
};
