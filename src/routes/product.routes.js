import Router from 'express'
import { createProduct, deleteProduct, getAllProducts, getSingleProduct, updateProduct } from '../controllers/product.controller.js'
import multer from 'multer';

const router = Router()

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });


router.route('/').get(getAllProducts)
router.route('/:id').get(getSingleProduct)
router.route('/create-product').post(upload.fields([
    { name: "Image", maxCount: 1 },
    { name: "Image1", maxCount: 1 },
    { name: "Image2", maxCount: 1 },
    { name: "Image3", maxCount: 1 },
]), createProduct)

router.route("/update-product/:product_id").put(upload.fields([
    { name: "Image", maxCount: 1 },
    { name: "Image1", maxCount: 1 },
    { name: "Image2", maxCount: 1 },
    { name: "Image3", maxCount: 1 },
]), updateProduct)

router.route("/delete-product/:id").delete(deleteProduct)


export default router