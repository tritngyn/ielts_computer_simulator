import path from "path";
import fs from "fs/promises";
import { NextResponse } from "next/server";

export default function GET() {
  try {
    const filePath = path.join(process.cwd(), "data", "data.json");
    const fileContent = await fs.readFile(filePath, "utf-8");
    const data = JSON.parse(fileContent);
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: "Không thể đọc tệp" }, { status: 500 });
  }
}
