import { CreateOrderSchema } from "@/server/models";
import { handleError } from "@/server/presentation/response";
import {
  createOrderRepo,
  getActiveOrdersRepo,
} from "@/server/repositories/order.repo";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
      console.log("STEP 1: API route hit");
  try {
    const orders = await getActiveOrdersRepo();
    console.log("STEP 4: Sending response to client");
    return NextResponse.json(orders, { status: 200 });
  } catch (error : any) {
    console.log(error.issues);
    console.log(error.messages);
    return NextResponse.json(error, { status: 400 });
  }
}


const APICreateOrderSchema = CreateOrderSchema.omit({ totalPrice: true });
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validatedBody = APICreateOrderSchema.parse(body);
    const totalPrice = validatedBody.items.reduce(
      (acc, item) => acc + item.pricePerItem * item.qty,
      0
    );
    const createdOrder = await createOrderRepo({
      ...validatedBody,
      totalPrice,
    });
    return NextResponse.json(createdOrder, { status: 201 });
  } catch (error) {
    return handleError(error);
  }
}
