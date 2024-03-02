"use client";
import { UseMutationResult, useMutation } from "@tanstack/react-query";
import Dropzone, { DropzoneProps, useDropzone } from "react-dropzone";

type DropZoneProps = {
  uploadFile: UseMutationResult<void, Error, File, unknown>
};

export default function DropZone({ uploadFile }: DropZoneProps) {
  return (
    <Dropzone onDrop={(acceptedFiles) => uploadFile.mutate(acceptedFiles[0])}>
      {({ getRootProps, getInputProps }) => (
        <section className="flex justify-center items-center py-12 flex-col">
          <div
            {...getRootProps({ className: "dropzone" })}
            className="bg-orange-200 rounded-2xl py-12 px-8 border-2 border-orange-600 border-dashed text-lg font-semibold hover:cursor-pointer"
          >
            <input {...getInputProps()} accept="application/pdf" />
            <p>Drag and drop some files here, or click to select files</p>
          </div>
        </section>
      )}
    </Dropzone>
  );
}
