import { revalidateTag } from "next/cache";
import { NextResponse, type NextRequest } from "next/server";

/**
 * On-demand ISR webhook — called by the NestJS backend after any admin write:
 *   POST /api/revalidate?tag=<tag>&secret=<REVALIDATE_SECRET>
 *
 * REVALIDATE_SECRET must be identical to the backend's env value.
 * Tags mirror the fetch tags used in services (e.g. "products", "blogs", "cms-<key>").
 */
export async function POST(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const tag = searchParams.get("tag");
  const secret = searchParams.get("secret");

  if (!process.env.REVALIDATE_SECRET || secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ revalidated: false, message: "Invalid secret" }, { status: 401 });
  }

  if (!tag) {
    return NextResponse.json({ revalidated: false, message: "Missing tag" }, { status: 400 });
  }

  // Next.js 16: revalidateTag takes a cache profile as the second argument.
  revalidateTag(tag, "max");
  return NextResponse.json({ revalidated: true, tag, now: Date.now() });
}
