import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  // get form data
  const formData = await req.formData();
  // extract the file
  const file = (formData.get("file") as File) || null;

  // check
  if (!file) {
    return NextResponse.json({
      success: false,
      message: "File is required",
    });
  }
  // create s3Client
  const s3Client = new S3Client({
    region: "auto",
    endpoint: `${process.env.CLOUDFLARE_ENDPOINT}`,
    credentials: {
      accessKeyId: process.env.CLOUDFLARE_ACCESS_KEY_ID || "",
      secretAccessKey: process.env.CLOUDFLARE_SECRET_ACCESS_KEY || "",
    },
    forcePathStyle: true,
  });
  // set filename
  const fileName = file.name;
  // create upload params
  const uploadParams = {
    Bucket: process.env.CLOUDFLARE_BUCKET_NAME,
    Key: fileName,
    Body: Buffer.from(await file.arrayBuffer()),
    ContentType: file.type,
  };

  try {
    // upload
    await s3Client.send(new PutObjectCommand(uploadParams));
    // get the url
    const url = `${process.env.CLOUDFLARE_CDN_URL}/${fileName}`;
    // return the response
    return NextResponse.json({
      success: true,
      message: "Upload success",
      url,
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json({
      success: false,
      message: "Something went wrong, please try again..",
    });
  }
}
