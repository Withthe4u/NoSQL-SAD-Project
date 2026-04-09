import { CreateMultipleMenusSchema } from "@/server/models";
import { handleError } from "@/server/presentation/response";
import {
  createMenusRepo,
  getAllMenusRepo,
} from "@/server/repositories/menu.repo";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const menus = await getAllMenusRepo();
    console.log(menus);
    return NextResponse.json(menus, { status: 200 });
  } catch (error) {
    return handleError(error);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validatedBody = CreateMultipleMenusSchema.parse(body);
    const createdMenus = await createMenusRepo(validatedBody);
    return NextResponse.json(createdMenus, { status: 201 });
  } catch (error) {
    return handleError(error);
  }
}
