"use client";

import DropZone from "@/components/DropZone";
import { useState } from "react";
import { Pdf } from "./types";
import PdfRenderer from "@/components/PdfRenderer";
import Chat from "@/components/Chat";
import { useMutation } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";

export default function Home() {
  const [pdf, setPdf] = useState<Pdf | null>(null);

  const uploadFile = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("pdf", file);
      const res = await fetch("/api/upload", {
        method: 'POST',
        body: formData
      });
      const pdf = (await res.json()) as Pdf;
      setPdf(pdf);
    },
  });

  return (
    <>
      {pdf ? (
        <main className="flex flex-col md:flex-row justify-center">
          <PdfRenderer pdf={pdf} />
          <Chat fileId={pdf.public_id} />
        </main>
      ) : (
        <main className="flex justify-center pt-40 flex-col px-8 md:px-0">
          <h1 className="text-5xl text-center font-extrabold text-orange-500">
            <span className="text-6xl text-black">Chat with your PDFs </span>
            <br /> with just an upload
          </h1>
          {uploadFile.isPending ? (
            <section className="flex justify-center items-center py-12">
              <div className="bg-orange-200 rounded-2xl py-8 px-8 border-2 border-orange-600 border-dashed text-lg font-semibold">
                <Loader2 className="w-8 h-8 animate-spin text-black" />
              </div>
            </section>
          ) : (
            <DropZone uploadFile={uploadFile} />
          )}
        </main>
      )}
    </>
  );
}
