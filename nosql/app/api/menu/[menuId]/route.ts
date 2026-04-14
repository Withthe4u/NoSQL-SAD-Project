import { UpdateMenuSchema } from "@/server/models/menu.model";
import { handleError } from "@/server/presentation/response";
import { deleteMenuRepo, updateMenuRepo } from "@/server/repositories/menu.repo";
import { NextRequest, NextResponse } from "next/server";

//update menu by id
export async function PATCH(req: NextRequest, context: { params: Promise<{ menuId: string }> }) {
  console.log("STEP 1: API route hit");
  try {
    const body = await req.json();
    console.log("STEP 2: Request body:", body)
    const validatedBody = UpdateMenuSchema.omit({ id: true }).parse(body);
    const { menuId } = await context.params;
    const updatemenu = await updateMenuRepo({ id: menuId, ...validatedBody });
    console.log("STEP 3: Data updated in repository:", updatemenu);
    if (!updatemenu) return NextResponse.json({ status: 404 });
    else
      console.log("STEP 4: Menu price updated successfully");
    return NextResponse.json(updatemenu, { status: 200 });
  } catch (error) {
    return handleError(error);
  }
}


export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ menuId: string }> }
) {
  console.log("STEP 1: API route hit");
  try {
    const { menuId } = await context.params;
    console.log("STEP 2: Params :", menuId)
    const deletedMenu = await deleteMenuRepo({ id: menuId });
    console.log("STEP 3: Data deleted in repository:", deletedMenu);

    if (!deletedMenu) return NextResponse.json({ status: 404 });
          console.log("STEP 4: Menu deleted successfully");
    return NextResponse.json({ status: 200 });
  } catch (error) {
    return handleError(error);
  }
}
