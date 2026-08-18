import { getCurrentSession } from "@/lib/Session";
import { ApiResponse } from "@/lib/ApiResponse";

export async function POST() {
  try {
    const session = await getCurrentSession();
    session.destroy();

    return ApiResponse.success(null, "Logged out successfully");
  } catch (err) {
    return ApiResponse.handle(err);
  }
}
