"use client";
import { useMutation } from "@tanstack/react-query";
import Dropzone, { DropzoneProps, useDropzone } from "react-dropzone";
import axios from "axios";
import { Dispatch, SetStateAction } from "react";
import { Pdf } from "@/app/types";

type DropZoneProps = {
  setPdf: Dispatch<SetStateAction<Pdf | null>>;
};

export default function DropZone({ setPdf }: DropZoneProps) {
  const uploadFile = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("pdf", file);
      const res = (await axios.post("/api/upload", formData));
      const pdf = await res.data as Pdf
      setPdf(pdf);
    },
  });

  return (
    <Dropzone onDrop={(acceptedFiles) => uploadFile.mutate(acceptedFiles[0])}>
      {({ getRootProps, getInputProps }) => (
        <section className="flex justify-center items-center py-10 flex-col">
          <div
            {...getRootProps({ className: "dropzone" })}
            className="bg-orange-200 rounded-2xl py-10 px-8 border-2 border-orange-600 border-dashed text-lg font-semibold hover:cursor-pointer"
          >
            <input {...getInputProps()} accept="application/pdf" />
            <p>Drag and drop some files here, or click to select files</p>
          </div>
        </section>
      )}
    </Dropzone>
  );
}
