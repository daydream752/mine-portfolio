import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";

const UPLOAD_DIR = path.join(process.cwd(), "public", "c-menu-uploads");
const MAX_BYTES = 2 * 1024 * 1024;
const ALLOWED = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);

function extFromMime(mime: string): string {
  if (mime === "image/jpeg") return "jpg";
  if (mime === "image/png") return "png";
  if (mime === "image/webp") return "webp";
  return "gif";
}

export async function POST(req: Request) {
  try {
    const form = await req.formData();
    const file = form.get("file");
    if (!file || typeof file === "string" || !(file instanceof Blob)) {
      return NextResponse.json({ error: "파일이 없습니다." }, { status: 400 });
    }
    if (file.size > MAX_BYTES) {
      return NextResponse.json({ error: "2MB 이하 이미지만 업로드할 수 있습니다." }, { status: 400 });
    }
    const type = file.type;
    if (!ALLOWED.has(type)) {
      return NextResponse.json({ error: "JPEG, PNG, WebP, GIF만 가능합니다." }, { status: 400 });
    }
    const ext = extFromMime(type);
    const name = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}.${ext}`;
    await mkdir(UPLOAD_DIR, { recursive: true });
    const buf = Buffer.from(await file.arrayBuffer());
    await writeFile(path.join(UPLOAD_DIR, name), buf);
    return NextResponse.json({ url: `/c-menu-uploads/${name}` });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "업로드에 실패했습니다.";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
