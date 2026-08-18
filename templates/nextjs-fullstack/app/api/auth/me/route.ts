import { getCurrentSession } from "@/lib/Session";
import { ApiResponse } from "@/lib/ApiResponse";

export async function GET() {
  try {
    const session = await getCurrentSession();

    if (!session.isLoggedIn || !session.user) {
      return ApiResponse.success({ user: null, isLoggedIn: false });
    }

    return ApiResponse.success({
      user: session.user,
      isLoggedIn: true,
    });
  } catch (err) {
    return ApiResponse.handle(err);
  }
}
