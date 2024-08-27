import express from 'express';
import ProductController from '../controllers/product.controller';

const router = express.Router();
router.post('/products', ProductController.saveProduct);
router.get('/product/:productId', ProductController.getProductById);
router.post('/products_by_user', ProductController.getProductByUserId);
router.put('/products/:id', ProductController.updateProduct);
router.delete('/products/:id', ProductController.deleteProduct);

export default router;
