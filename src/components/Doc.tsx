"use client"

import { Document, Page } from "react-pdf"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useState } from "react"
import { FileData } from "@/utils/db"

export default function Doc({ file }: { file: FileData | null }) {
  const [page, setPage] = useState(1)
  const [numPages, setNumPages] = useState<number | null>()

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages)
  }

  if (!file) {
    return <span>Loading...</span>
  }

  return (
    <div className="md:w-full md:h-screen flex justify-center box-border">
      <header className="py-2 px-4 h-12 flex items-center justify-between bg-stone-900 fixed top-0 left-0 w-full md:w-[50vw] z-10">
        <span className="text-lg">{file.name}</span>
        <div className="flex items-center gap-1">
          <button
            className="hover:bg-stone-700 p-1.5 rounded-lg"
            disabled={page == 1}
            onClick={() => {
              setPage(page - 1)
            }}
          >
            <ChevronLeft />
          </button>{" "}
          <input
            type="number"
            className="border p-1.5 box-border w-14 rounded-lg border-stone-700"
            min={1}
            value={page}
            onChange={(ev) => {
              if (ev.target.value) setPage(parseInt(ev.target.value))
            }}
          />
          <span>of {numPages}</span>
          <button
            className="hover:bg-stone-700 p-1.5 rounded-lg"
            disabled={page == numPages}
            onClick={() => {
              setPage(page + 1)
            }}
          >
            <ChevronRight />
          </button>
        </div>
      </header>
      <Document
        file={file.content}
        className="flex justify-center h-full pt-10"
        onLoadSuccess={onDocumentLoadSuccess}
      >
        <Page
          pageNumber={page}
          className="h-full flex justify-center items-center "
          width={
            window.innerWidth > 768
              ? window.innerWidth / 2.1
              : window.innerWidth
          }
          height={window.innerHeight}
        />
      </Document>
    </div>
  )
}
