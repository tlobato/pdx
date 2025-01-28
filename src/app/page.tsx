"use client"

import { deleteFile, FileData, getFiles, uploadFile } from "@/utils/db"
import { InfoIcon, Trash2Icon, UploadIcon } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import Cookies from "js-cookie"

export default function Home() {
  const [fileList, setFileList] = useState<FileData[]>([])
  const apiKeyInputRef = useRef<HTMLInputElement>(null)

  async function fetchFiles() {
    const files = (await getFiles()) as FileData[]
    setFileList(files)
  }

  useEffect(() => {
    fetchFiles()
    const savedApiKey = Cookies.get("openai-api-key")
    if (savedApiKey && apiKeyInputRef.current) {
      apiKeyInputRef.current.value = savedApiKey
    }
  }, [])

  const handleFileUpload = async (ev: React.ChangeEvent<HTMLInputElement>) => {
    if (ev.target.files && ev.target.files[0]) {
      const file = ev.target.files[0]
      try {
        await uploadFile(file)
        await fetchFiles()
      } catch (error) {
        console.error("Error processing PDF:", error)
      }
    }
  }

  const handleDeleteFile = async (
    ev: React.MouseEvent<HTMLButtonElement>,
    id: number,
  ) => {
    ev.preventDefault()
    ev.stopPropagation()

    try {
      await deleteFile(id)
      await fetchFiles()
    } catch (error) {
      console.error("Error deleting file:", error)
    }
  }

  const handleSaveKey = () => {
    const apiKey = apiKeyInputRef.current?.value
    if (apiKey) {
      Cookies.set("openai-api-key", apiKey, { expires: 30 })
      alert("API key saved successfully!")
    }
  }

  return (
    <main className="pt-16 flex flex-col items-center ">
      <h1 className="text-4xl md:text-5xl max-w-xl px-auto text-center font-bold">
        A new way of <span className="text-orange-500">learning</span> from{" "}
        <span className="text-orange-600 underline">PDFs</span>
      </h1>
      <div className="mt-8 flex flex-col gap-4 items-center">
        <div className="flex flex-col">
          <label
            htmlFor="apikey"
            className="flex items-center gap-1 text-xs font-bold py-1"
          >
            <span>OPENAI API KEY</span>
            <Link href="/get-key">
              <InfoIcon size={18} />
            </Link>
          </label>
          <div className="flex gap-1 w-80">
            <input
              type="password"
              placeholder="sk-proj-tXDsW..."
              className="py-1 px-2 text-sm rounded-lg border-2 border-stone-800 w-full"
              ref={apiKeyInputRef}
            />
            <button
              className="bg-stone-900 p-1.5 rounded-lg"
              onClick={handleSaveKey}
            >
              Save
            </button>
          </div>
        </div>
        <input
          id="fileinput"
          type="file"
          accept="application/pdf"
          hidden
          onChange={handleFileUpload}
        />
        <label
          htmlFor="fileinput"
          className="text-center flex text-xl items-center border-2 border-stone-800 border-dashed gap-2 cursor-pointer hover:bg-stone-800 p-2 rounded-xl"
        >
          <UploadIcon /> <span>Upload your files here </span>
        </label>
      </div>
      <ul className="mt-8 flex flex-wrap gap-2 box-border justify-center w-[90%]">
        {fileList.map((file) => (
          <li key={file.id} className="border border-stone-700 p-2 rounded-xl ">
            <Link
              href={`files/${file.id}`}
              className="flex flex-col gap-2 md:w-56"
            >
              {file.thumbnail ? (
                <Image
                  src={file.thumbnail}
                  alt={file.name}
                  width={0}
                  height={0}
                  className="w-full h-80"
                />
              ) : (
                <div className="h-80">no thumbnail yet</div>
              )}

              <div className="flex justify-between items-center h-14">
                <span className="w-[90%]">{file.name}</span>
                <button
                  className="bg-red-600 px-1.5 py-2 rounded flex justify-center items-center"
                  onClick={(ev) => {
                    if (file.id) handleDeleteFile(ev, file.id)
                  }}
                >
                  <Trash2Icon size={20} />
                </button>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  )
}
