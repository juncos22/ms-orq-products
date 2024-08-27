import pool from './db';

const connectToDatabase = async () => {
  try {
    await pool.connect();

    // Verificar si la extensión uuid-ossp ya está habilitada
    const {
      rows: [extensionExists],
    } = await pool.query(`
      SELECT EXISTS (
        SELECT 1
        FROM pg_extension
        WHERE extname = 'uuid-ossp'
      );`);

    // Habilitar uuid-ossp
    if (!extensionExists.exists) {
      await pool.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";');
      console.log('uuid-ossp extension enabled');
    }

    // Para eliminar tabla puedes quitar comentario. Luego mantener comentado!
    // await pool.query('DROP TABLE product;');

    // Buscar tablas creadas
    const result = await pool.query(`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_type = 'BASE TABLE';
      `);
    const tables = result.rows.map((row: any) => row.table_name);

    // Crear tabla innevo_user
    if (!tables.includes('pulpo_user')) {
      await pool.query(`
        CREATE TABLE pulpo_user (
          id SERIAL PRIMARY KEY,
          name VARCHAR(20)
        );`);
      console.log('pulpo_user table created');
    }
    // Crear tabla marketplace_config
    if (!tables.includes('marketplace_config')) {
      await pool.query(`
        CREATE TABLE marketplace_config (
          id SERIAL PRIMARY KEY,
          param_name VARCHAR(20),
          param_value VARCHAR(20),
          id_marketplace INT REFERENCES marketplace(id) NOT NULL,
          id_pulpo_user INT REFERENCES pulpo_user(id) NOT NULL
        );`);
      console.log('marketplace_config table created');
    }

    // Crear tabla product
    if (!tables.includes('product')) {
      await pool.query(`
        CREATE TABLE product (
          id SERIAL PRIMARY KEY,
          id_pulpo_user INT REFERENCES pulpo_user(id) NOT NULL,
          id_category_pulpo INT REFERENCES category_pulpo(id) NOT NULL,
          name VARCHAR(50),
          description TEXT,
          stock INTEGER NOT NULL,
          status VARCHAR(15) NOT NULL
        );`);
      console.log('product table created');
    }

    // Crear tabla product_marketplace
    if (!tables.includes('product_marketplace')) {
      await pool.query(`
        CREATE TABLE product_marketplace (
          id SERIAL PRIMARY KEY,
          id_product INT REFERENCES product(id) NOT NULL,
          id_marketplace INT REFERENCES marketplace(id) NOT NULL
        );`);
      console.log('product_marketplace table created');
    }

    // Crear tabla field
    if (!tables.includes('extra_value')) {
      await pool.query(`
        CREATE TABLE extra_value (
          id SERIAL PRIMARY KEY,
          id_product INT REFERENCES product(id) NOT NULL,
          id_attribute_mk INT REFERENCES attribute_mk(id) NOT NULL,
          id_option INT REFERENCES option(id) DEFAULT NULL,
          value VARCHAR(50) DEFAULT NULL
        );`);
      console.log('extra_value table created');
    }

    console.log(
      `Database is connected to ${process.env.HOST_POSTGRESQL}:${process.env.PORT_POSTGRESQL}`,
    );
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error('Error connecting to the database:', err.stack);
    } else {
      console.error('Unknown error:', err);
    }
  }
};

export default connectToDatabase;
