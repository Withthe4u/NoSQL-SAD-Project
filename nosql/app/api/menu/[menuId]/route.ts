import { handleError } from "@/server/presentation/response";
import { deleteMenuRepo } from "@/server/repositories/menu.repo";
import { NextRequest, NextResponse } from "next/server";

/* //update menu by id
export async function PATCH(req:NextRequest, context:{params:Promise<{menuId:string}>}){
    try {
        ...
    } catch (error) {
        ...
    }
}
*/

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ menuId: string }> }
) {
  try {
    const { menuId } = await context.params;
    const deletedMenu = await deleteMenuRepo({ id: menuId });
    if (!deletedMenu) return NextResponse.json({ status: 404 });
    return NextResponse.json({ status: 200 });
  } catch (error) {
    return handleError(error);
  }
}
