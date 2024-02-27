import type { Metadata } from "next";
import "./globals.css";
import { v2 as cloudinary } from "cloudinary";
import Providers from "@/components/Providers";

cloudinary.config({
  cloud_name: "darjfiyou",
  api_key: "582881756283974",
  api_secret: process.env.CLOUDINARY_SECRET,
});

export const metadata: Metadata = {
  title: "PDX",
  description: "Chat with your files with just an upload",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Providers>
    <html lang="en">
      <body>
        <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:6rem_4rem]">
          {children}
        </div>{" "}
      </body>
    </html>
    </Providers>
  );
}
