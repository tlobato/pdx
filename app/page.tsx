"use client";

import DropZone from "@/components/DropZone";
import { useState } from "react";
import { Pdf } from "./types";
import PdfRenderer from "@/components/PdfRenderer";
import Chat from "@/components/Chat";

export default function Home() {
  const [pdf, setPdf] = useState<Pdf | null>(null);

  return (
    <>
      {pdf ? (
        <main className="flex flex-col md:flex-row justify-center md:gap-5 box-border px-4 py-2 md:py-0">
          <PdfRenderer pdf={pdf} />
          <Chat />          
        </main>
      ) : (
        <main className="flex justify-center pt-40 flex-col">
          <h1 className="text-5xl text-center font-extrabold text-orange-500">
            <span className="text-6xl text-black">Chat with your PDFs </span>
            <br /> with just an upload
          </h1>
          <DropZone setPdf={setPdf} />
        </main>
      )}
    </>
  );
}
