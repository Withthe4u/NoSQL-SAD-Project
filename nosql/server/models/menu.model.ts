import { z } from "zod";

export const MenuSchema = z.object({
  id: z.string(),
  name: z.string(),
  price: z.number(),
});

export type Menu = z.infer<typeof MenuSchema>;

export const CreateMenuSchema = MenuSchema.omit({
  id: true,
});
export type CreateMenu = z.infer<typeof CreateMenuSchema>;
export const CreateMultipleMenusSchema = z.object({
  menus: z.array(CreateMenuSchema),
});

export const UpdateMenuSchema = MenuSchema.partial({
  name: true,
  price: true,
});
export type UpdateMenu = z.infer<typeof UpdateMenuSchema>;
