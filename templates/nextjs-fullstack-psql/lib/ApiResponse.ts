import { NextResponse } from "next/server";
import { ZodError } from "zod";

export class ApiResponse {
  static success<T>(data: T, message?: string, status = 200) {
    return NextResponse.json(
      {
        success: true,
        message,
        data,
      },
      { status }
    );
  }

  static error(message: string, status = 400, errorKey?: string) {
    return NextResponse.json(
      {
        success: false,
        error: message,
        errorKey,
      },
      { status }
    );
  }

  static validationError(err: ZodError) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of err.issues) {
      const field = issue.path.join(".");
      if (!fieldErrors[field]) {
        fieldErrors[field] = issue.message;
      }
    }

    return NextResponse.json(
      {
        success: false,
        error: "Validation failed",
        errors: fieldErrors,
      },
      { status: 422 }
    );
  }

  static handle(err: unknown) {
    if (err instanceof ZodError) {
      return ApiResponse.validationError(err);
    }

    const message = err instanceof Error ? err.message : "An unexpected error occurred";
    // Log internal error on server without leaking details
    console.error("[API_ERROR]", err);

    return NextResponse.json(
      {
        success: false,
        error: message,
      },
      { status: 500 }
    );
  }
}
