import { CreateMultipleMenusSchema } from "@/server/models";
import { handleError } from "@/server/presentation/response";
import {
  createMenusRepo,
  getAllMenusRepo,
} from "@/server/repositories/menu.repo";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    console.log("STEP 1: API route hit");
    const menus = await getAllMenusRepo();
    console.log("STEP 4: Sending response to client");
    return NextResponse.json(menus, { status: 200 });
  } catch (error) {
    return handleError(error);
  }
}

export async function POST(req: NextRequest) {
  try {
    console.log("STEP 1: API route hit");
    const body = await req.json();
    console.log("STEP 2: Request body:", body)
    const validatedBody = CreateMultipleMenusSchema.parse(body);
    const createdMenus = await createMenusRepo(validatedBody);
    console.log("STEP 3: Data saved in repository:", createdMenus);
    console.log("STEP 4: Menu successfully created");
    return NextResponse.json(createdMenus, { status: 201 });
  } catch (error) {
    return handleError(error);
  }
}
