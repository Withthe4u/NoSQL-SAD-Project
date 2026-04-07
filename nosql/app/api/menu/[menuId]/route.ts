import { UpdateMenuSchema } from "@/server/models/menu.model";
import { handleError } from "@/server/presentation/response";
import { deleteMenuRepo, updateMenuRepo } from "@/server/repositories/menu.repo";
import { NextRequest, NextResponse } from "next/server";

//update menu by id
export async function PATCH(req:NextRequest, context:{params:Promise<{menuId:string}>}){
    try {
      const body = await req.json();
      const validatedBody = UpdateMenuSchema.omit({ id: true }).parse(body);
      const { menuId } = await context.params; 
      const updatemenu = await updateMenuRepo({ id: menuId, ...validatedBody });
      if (!updatemenu) return NextResponse.json({ status: 404 });
      return NextResponse.json(updatemenu,{ status: 200 });
    } catch (error) {
        return handleError(error);
    }
}


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
