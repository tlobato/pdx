"use client";
import { useMutation } from "@tanstack/react-query";
import Dropzone, { useDropzone } from "react-dropzone";
import axios from 'axios'

export default function DropZone() {
  const { acceptedFiles, getRootProps, getInputProps } = useDropzone();

  const uploadFile = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData()
      formData.append('pdf', file)
      const res = await axios.post('/api/upload', formData)
      console.log(res)
      return {res}
    }
  })
  
  return (
    <Dropzone onDrop={(acceptedFiles) => uploadFile.mutate(acceptedFiles[0])}>
      {({ getRootProps, getInputProps }) => (
        <section className="flex justify-center items-center py-10 flex-col">
          <div
            {...getRootProps({ className: "dropzone" })}
            className="bg-orange-200 rounded-2xl py-10 px-8 border-2 border-orange-600 border-dashed text-lg font-semibold hover:cursor-pointer"
          >
            <input {...getInputProps()} />
            <p>Drag 'n' drop some files here, or click to select files</p>
          </div>
        </section>
      )}
    </Dropzone>
  );
}
