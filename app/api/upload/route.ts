import { CloudinaryFile } from "@/app/types";
import { v2 as cloudinary } from "cloudinary";
import { NextRequest, NextResponse } from "next/server";

cloudinary.config({
  cloud_name: "darjfiyou",
  api_key: "582881756283974",
  api_secret: process.env.CLOUDINARY_SECRET,
});

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get("pdf") as File;
  if (file.type !== "application/pdf") return;
  const arrayBuffer = await file.arrayBuffer();
  const mime = file.type;
  const encoding = "base64";
  const base64Data = Buffer.from(arrayBuffer).toString("base64");
  const fileUri = "data:" + mime + ";" + encoding + "," + base64Data;
  const uploadedFile = await new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload(fileUri, {
        invalidate: true,
        allowed_formats: ["pdf"],
        tags: ["uploaded-pdfs"],
      })
      .then((result) => {
        resolve(result);
      })
      .catch((err) => reject(err));
  });
  
  const { secure_url, pages, public_id } = uploadedFile as CloudinaryFile;

  return new NextResponse(JSON.stringify({ name: file.name, secure_url, pages, public_id }), { status: 200 });
}
