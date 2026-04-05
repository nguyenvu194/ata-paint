import { Router } from "express";
import { getAllProducts, getProductBySlug, updateProduct } from "../controllers/productController";

const router = Router();

router.get("/", getAllProducts);
router.get("/:slug", getProductBySlug);
router.patch("/:id", updateProduct);

export default router;
