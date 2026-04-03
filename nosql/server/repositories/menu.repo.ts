import { MenuCollection } from "@/db/schema";
import { CreateMenu, Menu } from "../models";
import connectMongoDB from "@/db";

export async function getAllMenusRepo(): Promise<Menu[]> {
  await connectMongoDB();
  return MenuCollection.find({});
}

export async function createMenusRepo({
  menus,
}: {
  menus: CreateMenu[];
}): Promise<Menu[]> {
  await connectMongoDB();
  return MenuCollection.insertMany(menus);
}

/*
export async function updateMenuRepo({...}:UpdateMenu):Promise<Menu|null>{
}
*/

export async function deleteMenuRepo({
  id,
}: {
  id: Menu["id"];
}): Promise<Menu | null> {
  await connectMongoDB();
  return MenuCollection.findByIdAndDelete(id);
}
