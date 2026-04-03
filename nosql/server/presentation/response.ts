import { NextResponse } from "next/server";
import { ZodError } from "zod/v4";

export function handleError(error: Error | unknown) {
  console.error(error);
  if (error instanceof ZodError)
    return NextResponse.json(null, { status: 400 });
  return NextResponse.json(null, { status: 500 });
}
