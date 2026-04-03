import { z } from "zod";
const OrderItemSchema = z.object({
  name: z.string(),
  qty: z.number().int().min(1),
  pricePerItem: z.number(),
  note: z.string().optional(),
});
const OrderSchema = z.object({
  id: z.string(),
  customerName: z.string().nullable(),
  totalPrice: z.number(),
  items: z.array(OrderItemSchema),
  status: z.enum(["Pending", "Completed"]),
  createdAt: z.date(),
  completedAt: z.date().nullable(),
});

export type Order = z.infer<typeof OrderSchema>;
export const CreateOrderSchema = OrderSchema.omit({
  id: true,
  status: true,
  createdAt: true,
  completedAt: true,
});
export type CreateOrder = z.infer<typeof CreateOrderSchema>;

export const UpdateOrderStatusSchema = OrderSchema.pick({
  id: true,
  status: true,
});
export type UpdateOrderStatus = z.infer<typeof UpdateOrderStatusSchema>;
