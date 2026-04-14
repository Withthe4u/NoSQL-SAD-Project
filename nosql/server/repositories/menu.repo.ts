import { MenuCollection } from "@/db/schema";
import { CreateMenu, Menu, UpdateMenu } from "../models";
import connectMongoDB from "@/db";

export async function getAllMenusRepo(): Promise<Menu[]> {
  console.log("STEP 2: connect to MongoDB with mongoose");
  await connectMongoDB();
  console.log("STEP 3: Querying MongoDB using Mongoose")
  return MenuCollection.find({});
}

export async function createMenusRepo({
  menus,
}: {
  menus: CreateMenu[];
}): Promise<Menu[]> {
  console.log("STEP 3.1: Saving data to MongoDB using Mongoose");
  await connectMongoDB();
  return MenuCollection.insertMany(menus);
}


export async function updateMenuRepo({
  id,
  name,
  price,
}:UpdateMenu):Promise<Menu|null>{
  await connectMongoDB();
  return MenuCollection.findByIdAndUpdate(id,{ name, price });
}



export async function deleteMenuRepo({
  id,
}: {
  id: Menu["id"];
}): Promise<Menu | null> {
  await connectMongoDB();
  return MenuCollection.findByIdAndDelete(id);
}
