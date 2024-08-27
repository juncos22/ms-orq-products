import { Marketplace, Product } from '../../utils/interfaces/product';
import pool from '../db/db';
import pg, { pgPromise } from '../db/db.promise';
import { saveExtraValue } from './extra_value.post';

const { ColumnSet, insert } = pgPromise.helpers;

export const saveProduct = async (product: Product) => {
  const client = await pool.connect();
  try {
    const result = await client.query<Product>(
      `INSERT INTO product (name, description, stock, 
      id_pulpo_user, id_category_pulpo, status) 
      VALUES($1, $2, $3, $4, $5, $6) RETURNING *`,
      [
        product.name,
        product.description,
        product.stock,
        product.id_pulpo_user,
        product.id_category_pulpo,
        'active',
      ],
    );
    let savedProduct = result.rows[0];
    if (savedProduct) {
      let savedRelations = await relateProductMarketplace(
        savedProduct.id,
        product.marketplaces,
      );
      // console.log('Product - Marketplace:', savedRelations);
      savedProduct.marketplaces = savedRelations;
      return savedProduct;
    }
    return null;
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    client.release();
  }
};

async function relateProductMarketplace(
  idProduct: number,
  marketplaces: Array<Marketplace>,
) {
  try {
    const columns = new ColumnSet(['id_product', 'id_marketplace'], {
      table: 'product_marketplace',
    });
    const values: any[] = [];
    for (const marketplace of marketplaces) {
      values.push({ id_product: idProduct, id_marketplace: marketplace.id });
      marketplace.extra_values = await saveExtraValue(
        marketplace.extra_values,
        idProduct,
      );
    }
    let query = insert(values, columns);
    await pg.none(query);
    return marketplaces;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
