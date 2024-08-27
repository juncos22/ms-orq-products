import { ExtraValue } from '../../utils/interfaces/extra_value';
import pool from '../db/db';
import pg, { pgPromise } from '../db/db.promise';

const { ColumnSet, insert } = pgPromise.helpers;

export const saveExtraValue = async (
  extra_values: ExtraValue[],
  id_product: number,
) => {
  try {
    let columns = new ColumnSet(
      ['id_product', 'id_attribute_mk', 'id_option', 'value'],
      { table: 'extra_value' },
    );
    let values: any[] = [];
    for (const extra_value of extra_values) {
      values.push({
        id_product,
        id_attribute_mk: extra_value.id_attribute_mk,
        id_option: extra_value.id_option || null,
        value: extra_value.value || null,
      });
    }
    const query = insert(values, columns) + ' RETURNING *';
    return pg.many<ExtraValue>(query);
  } catch (error) {
    console.error(error);
    throw error;
  }
};
