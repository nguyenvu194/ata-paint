import { Request, Response } from "express";
import prisma from "../lib/prisma";

/**
 * Parse JSON string fields (images, tags) into arrays
 */
function parseProductJsonFields(product: any) {
  return {
    ...product,
    images: JSON.parse(product.images || "[]"),
    tags: JSON.parse(product.tags || "[]"),
  };
}

/**
 * GET /api/products
 * List all products with category, parse JSON fields
 */
export async function getAllProducts(_req: Request, res: Response) {
  try {
    const products = await prisma.product.findMany({
      include: { category: true },
      orderBy: { createdAt: "desc" },
    });

    const parsed = products.map(parseProductJsonFields);
    res.json(parsed);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ error: "Failed to fetch products" });
  }
}

/**
 * GET /api/products/:slug
 * Single product by slug with category, 404 if not found
 */
export async function getProductBySlug(req: Request, res: Response) {
  try {
    const slug = req.params.slug as string;

    const product = await prisma.product.findUnique({
      where: { slug },
      include: { category: true },
    });

    if (!product) {
      res.status(404).json({ error: `Product with slug "${slug}" not found` });
      return;
    }

    res.json(parseProductJsonFields(product));
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({ error: "Failed to fetch product" });
  }
}

/**
 * PATCH /api/products/:id
 * Update product fields (inStock, price, etc.)
 */
export async function updateProduct(req: Request, res: Response) {
  try {
    const id = req.params.id as string;
    const { inStock, price } = req.body;

    // Build update data — only include fields that are provided
    const data: Record<string, unknown> = {};
    if (typeof inStock === "boolean") data.inStock = inStock;
    if (typeof price === "number" && price >= 0) data.price = price;

    if (Object.keys(data).length === 0) {
      res.status(400).json({ error: "No valid fields to update" });
      return;
    }

    const product = await prisma.product.update({
      where: { id },
      data,
      include: { category: true },
    });

    res.json(parseProductJsonFields(product));
  } catch (error: any) {
    if (error?.code === "P2025") {
      res.status(404).json({ error: `Product with id '${req.params.id}' not found` });
      return;
    }
    console.error("Error updating product:", error);
    res.status(500).json({ error: "Failed to update product" });
  }
}
