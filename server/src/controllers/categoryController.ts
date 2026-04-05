import { Request, Response } from "express";
import prisma from "../lib/prisma";

/**
 * GET /api/categories
 * List all categories with product count
 */
export async function getAllCategories(_req: Request, res: Response) {
  try {
    const categories = await prisma.category.findMany({
      include: {
        _count: {
          select: { products: true },
        },
      },
      orderBy: { name: "asc" },
    });

    res.json(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ error: "Failed to fetch categories" });
  }
}
