import { Request, Response } from "express";
import prisma from "../lib/prisma";

const VALID_STATUSES = [
  "pending",
  "confirmed",
  "shipping",
  "delivered",
  "cancelled",
] as const;

type OrderStatus = (typeof VALID_STATUSES)[number];

interface CreateOrderItemInput {
  productId: string;
  quantity: number;
}

interface CreateOrderInput {
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  customerAddress: string;
  note?: string;
  items: CreateOrderItemInput[];
}

/**
 * POST /api/orders
 * Create order with items — validates inputs, looks up prices, uses transaction
 */
export async function createOrder(req: Request, res: Response) {
  try {
    const body: CreateOrderInput = req.body;

    // --- Validation ---
    const errors: string[] = [];

    if (!body.customerName?.trim()) {
      errors.push("customerName is required");
    }
    if (!body.customerPhone?.trim()) {
      errors.push("customerPhone is required");
    }
    if (!body.customerAddress?.trim()) {
      errors.push("customerAddress is required");
    }
    if (!body.items || !Array.isArray(body.items) || body.items.length === 0) {
      errors.push("items must be a non-empty array");
    }

    if (errors.length > 0) {
      res.status(400).json({ error: errors.join("; ") });
      return;
    }

    // Validate each item
    for (let i = 0; i < body.items.length; i++) {
      const item = body.items[i];
      if (!item.productId) {
        errors.push(`items[${i}].productId is required`);
      }
      if (!item.quantity || item.quantity < 1) {
        errors.push(`items[${i}].quantity must be >= 1`);
      }
    }

    if (errors.length > 0) {
      res.status(400).json({ error: errors.join("; ") });
      return;
    }

    // --- Lookup product prices ---
    const productIds = body.items.map((item) => item.productId);
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
      select: { id: true, price: true, name: true },
    });

    const productMap = new Map(products.map((p) => [p.id, p]));

    // Check all products exist
    for (const item of body.items) {
      if (!productMap.has(item.productId)) {
        errors.push(`Product with id "${item.productId}" not found`);
      }
    }

    if (errors.length > 0) {
      res.status(400).json({ error: errors.join("; ") });
      return;
    }

    // --- Calculate total and create order in transaction ---
    let totalAmount = 0;
    const orderItemsData = body.items.map((item) => {
      const product = productMap.get(item.productId)!;
      const unitPrice = product.price;
      totalAmount += unitPrice * item.quantity;
      return {
        productId: item.productId,
        quantity: item.quantity,
        unitPrice,
      };
    });

    const order = await prisma.order.create({
      data: {
        customerName: body.customerName.trim(),
        customerPhone: body.customerPhone.trim(),
        customerEmail: body.customerEmail?.trim() || null,
        customerAddress: body.customerAddress.trim(),
        note: body.note?.trim() || null,
        totalAmount,
        items: {
          create: orderItemsData,
        },
      },
      include: {
        items: {
          include: { product: { select: { name: true, slug: true } } },
        },
      },
    });

    res.status(201).json(order);
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ error: "Failed to create order" });
  }
}

/**
 * GET /api/orders
 * List all orders with items (admin)
 */
export async function getAllOrders(_req: Request, res: Response) {
  try {
    const orders = await prisma.order.findMany({
      include: {
        items: {
          include: { product: { select: { name: true, slug: true } } },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    res.json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
}

/**
 * GET /api/orders/:id
 * Single order by ID with items
 */
export async function getOrderById(req: Request, res: Response) {
  try {
    const id = req.params.id as string;

    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        items: {
          include: { product: { select: { name: true, slug: true, image: true } } },
        },
      },
    });

    if (!order) {
      res.status(404).json({ error: `Order with id "${id}" not found` });
      return;
    }

    res.json(order);
  } catch (error) {
    console.error("Error fetching order:", error);
    res.status(500).json({ error: "Failed to fetch order" });
  }
}

/**
 * PATCH /api/orders/:id/status
 * Update order status — validates against allowed enum values
 */
export async function updateOrderStatus(req: Request, res: Response) {
  try {
    const id = req.params.id as string;
    const { status } = req.body;

    if (!status) {
      res.status(400).json({ error: "status is required" });
      return;
    }

    if (!VALID_STATUSES.includes(status as OrderStatus)) {
      res.status(400).json({
        error: `Invalid status "${status}". Must be one of: ${VALID_STATUSES.join(", ")}`,
      });
      return;
    }

    // Check order exists
    const existing = await prisma.order.findUnique({ where: { id: id as string } });
    if (!existing) {
      res.status(404).json({ error: `Order with id "${id}" not found` });
      return;
    }

    const updated = await prisma.order.update({
      where: { id },
      data: { status },
      include: {
        items: {
          include: { product: { select: { name: true, slug: true } } },
        },
      },
    });

    res.json(updated);
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).json({ error: "Failed to update order status" });
  }
}
