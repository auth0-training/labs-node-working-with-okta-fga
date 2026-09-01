import "server-only";
import { auth0 } from "@/lib/auth0";
import { readFile } from "fs/promises";
import mime from "mime";
import { NextRequest, NextResponse } from "next/server";
import { getFile } from "@/app/actions";
import { fgaClient } from "@/app/authorization";

export const dynamic = "force-dynamic";
export const GET = async function (
  request: NextRequest,
  { params }: { params: Promise<{ file: string }> },
) {
  try {
    const session = await auth0.getSession();
    const user = session?.user;
    const fileId = (await params)?.file;

    // If we're allowed to see the file, return it
    const { allowed } = await fgaClient.check({
      user: `user:${user?.sub}`,
      relation: 'can_view',
      object: `file:${fileId}`
    })

    if (allowed) {
      const { file, error } = await getFile(fileId);

      if (file) {
        const filePath = `${process.cwd()}/upload/${file?.fileName}`;
        const mimeType = mime.getType(filePath);
        const data = await readFile(filePath);
        return new NextResponse(data, {
          headers: { "content-type": mimeType ?? "text/plain" },
        });
      }
      return new NextResponse(`Error: ${error}`, {
        status: 500,
      });
    }

    // We're not allowed to see the file, returen a 403, forbidden error
    return new NextResponse("Forbidden", {
      status: 403,
    });
  } catch (error) {
    return new NextResponse(`Error: ${error}`, {
      status: 500,
    });
  }
};
