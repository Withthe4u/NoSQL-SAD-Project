  import { OrderCollection } from "@/db/schema";
  import { CreateOrder, Order } from "../models";
  import connectMongoDB from "@/db";


export async function getActiveOrdersRepo(): Promise<Order[]> {

  await connectMongoDB();

  const orders = await OrderCollection
  .find({ status : "Pending" })
  .sort({ createAt : 1 }) 
  .lean()
  return orders
  // This is incorrect.
  //We have to GET ALL ORDERS WHERE STATUS==="PENDING" SORT BY DATE ASC
}

  export async function createOrderRepo({
    customerName,
    items,
    totalPrice,
  }: CreateOrder): Promise<Order> {
    await connectMongoDB();
    return OrderCollection.insertOne({ customerName, items, totalPrice });
  }

  export async function updateOrderStatusRepo({
  orderId,
  status,
}: {
  orderId: string;
  status: "Pending" | "Completed";
}): Promise<Order | null> {
  await connectMongoDB();

  const updateData: any = { status };

  return OrderCollection.findByIdAndUpdate(orderId, updateData, {
    new: true,
  });
}
