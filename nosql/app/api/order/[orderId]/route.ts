import { NextRequest, NextResponse } from "next/server";
import { updateOrderStatusRepo } from "@/server/repositories/order.repo";
import { UpdateOrderStatusSchema } from "@/server/models";
import { handleError } from "@/server/presentation/response";

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ orderId: string }> }
) {
  try {
    const { orderId } = await context.params;

    const body = await req.json();
    const parsed = UpdateOrderStatusSchema.pick({
      status: true,
    }).safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { message: "Invalid input" },
        { status: 400 }
      );
    }

    const { status } = parsed.data;

    const updatedOrder = await updateOrderStatusRepo({
      orderId,
      status,
    });

    if (!updatedOrder) {
      return NextResponse.json(
        { message: "Order not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedOrder, { status: 200 });
  } catch (error) {
    return handleError(error);
  }
}