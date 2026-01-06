import fs from "fs";
import path from "path";

const PHOTOS_DIR = path.join(process.cwd(), "public", "photos");

export async function GET() {
  try {
    const entries = await fs.promises.readdir(PHOTOS_DIR, { withFileTypes: true });
    const files = entries
      .filter((entry) => entry.isFile())
      .map((entry) => entry.name)
      // basic image filter
      .filter((name) => /\.(png|jpe?g|webp|gif)$/i.test(name));

    return new Response(JSON.stringify({ files }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error reading photos directory:", error);
    return new Response(JSON.stringify({ files: [] }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

