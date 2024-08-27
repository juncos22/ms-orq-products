import { Request, Response, NextFunction } from 'express';
import { Product } from '../utils/interfaces/product';
import {
  getProductById,
  getProductByUserId,
  getProductViewById,
} from '../database/gets/product.get';
import { saveProduct } from '../database/post/product.post';
import { updateProduct } from '../database/puts/product.put';
import { deleteProduct } from '../database/delete/product.delete';

export default class ProductController {
  static saveProduct = async (
    req: Request,
    res: Response,
    _next: NextFunction,
  ) => {
    try {
      let product = req.body as Product;
      let productSaved = await saveProduct(product);

      // console.log(product);
      if (productSaved) {
        let productView = await getProductViewById(productSaved.id);
        // product = {
        //   ...product,
        //   id: productSaved.id,
        //   status: productSaved.status,
        // };
        return res.json({
          success: true,
          data: productView,
          message: 'Product saved successfully',
        });
      }
      return res.json({
        success: false,
        error: 'Could not save product',
      });
    } catch (error) {
      // console.error(error);
      return res.json({
        success: false,
        error: 'Could not save product',
        stack: error,
      });
    }
  };

  static getProductById = async (
    req: Request,
    res: Response,
    _next: NextFunction,
  ) => {
    try {
      const productId = req.params.productId;
      const product = await getProductById(Number(productId));
      if (!product) {
        return res.json({
          success: false,
          error: 'Could not find the product',
        });
      }
      return res.json({
        success: true,
        data: product,
      });
    } catch (error) {
      return res.json({
        success: false,
        error: 'Could not get the product',
        stack: error,
      });
    }
  };

  static getProductByUserId = async (
    req: Request,
    res: Response,
    _next: NextFunction,
  ) => {
    try {
      const idUser = req.body.idUser;
      const userProducts = await getProductByUserId(Number(idUser));

      res.json({
        success: true,
        data: userProducts,
      });
    } catch (error) {
      res.json({
        success: false,
        error: 'Could not get the product',
        stack: error,
      });
    }
  };

  static updateProduct = async (
    req: Request,
    res: Response,
    _next: NextFunction,
  ) => {
    try {
      const productId = req.params.id;
      const pulpoProduct = await getProductById(Number(productId));
      if (!pulpoProduct) {
        return res.json({
          success: false,
          error: 'Could not find the product',
        });
      }
      const product = req.body as Product;

      await updateProduct(product, Number(productId));
      return res.json({
        success: true,
        message: 'Product updated successfully',
      });
    } catch (error) {
      return res.json({
        success: false,
        error: 'Could not update the product',
        stack: error,
      });
    }
  };

  static deleteProduct = async (
    req: Request,
    res: Response,
    _next: NextFunction,
  ) => {
    try {
      const idProduct = req.params.id;
      const product = await getProductById(Number(idProduct));
      if (!product) {
        return res.json({
          success: false,
          error: 'Could not find the product',
        });
      }
      await deleteProduct(Number(idProduct));
      return res.json({
        success: true,
        message: 'Product deleted successfully',
      });
    } catch (error) {
      return res.json({
        success: false,
        error: 'Could not delete the product',
        stack: error,
      });
    }
  };
}
