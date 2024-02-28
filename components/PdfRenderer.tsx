"use client";

import { ChevronDownIcon, ChevronUpIcon, Loader2Icon } from "lucide-react";
import { revalidatePath } from "next/cache";
import { Button } from "./ui/Button";
import { Input } from "./ui/Input";
import { useState } from "react";
import { toast } from "sonner";

import { Document, Page, pdfjs } from "react-pdf";
import { Pdf } from "@/app/types";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

import { useResizeDetector } from "react-resize-detector";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "@/lib/utils";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

type PdfRendererProps = {
  pdf: Pdf | null;
};

export default function PdfRenderer({ pdf }: PdfRendererProps) {
  const [currentPage, setCurrentPage] = useState<number>(1);

  //using react hook form to verify if the input from the navigator is valid
  const CustomPageValidator = z.object({
    page: z
      .string()
      .refine((num) => Number(num) >= 1 && Number(num) <= pdf?.pages!),
  });

  type TCustomPageValidator = z.infer<typeof CustomPageValidator>;

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<TCustomPageValidator>({
    defaultValues: {
      page: "1",
    },
    resolver: zodResolver(CustomPageValidator),
  });
  //

  const { width, ref } = useResizeDetector();

  //going to the correct page when keydown Enter and if passed the validators
  const handlePageSubmit = ({ page }: TCustomPageValidator) => {
    setCurrentPage(Number(page));
    setValue("page", String(page));
  };

  return (
    <div className="max-h-screen border-black border max-w-screen min-w-[40%] bg-white rounded-3xl rounded-b-none md:rounded-none border-b-transparent">
      <div className="flex justify-between border  border-transparent border-b-zinc-400 p-2 items-center gap-1 px-3">
        <h1 className="text-lg underline text-black">
          {pdf?.name}
        </h1>
        <div className="flex items-center">
          <Button
            disabled={currentPage <= 1}
            size="icon"
            variant="ghost"
            aria-label="previous page"
            onClick={
              () => setCurrentPage((prev) => (prev - 1 > 1 ? prev - 1 : 1)) //validating to move to > 0 pages
            }
          >
            <ChevronUpIcon className="h-4 w-4" />
          </Button>

          <div className="flex items-center gap-1.5">
            <Input
              {...register("page")}
              className={cn(
                "w-8 h-8",
                errors.page && "focus-visible:ring-red-500"
              )}
              onKeyDown={(ev) => {
                if (ev.key === "Enter") {
                  handleSubmit(handlePageSubmit)();
                }
              }}
            />
            <p className="text-zinc-700 text-sm space-x-1">
              <span>/</span>
              <span>{pdf?.pages ?? "x"}</span>
            </p>
          </div>

          <Button
            disabled={currentPage >= pdf?.pages!}
            size="icon"
            variant="ghost"
            aria-label="next page"
            onClick={
              () =>
                setCurrentPage((prev) =>
                  prev + 1 < pdf?.pages! ? pdf?.pages! + 1 : pdf?.pages!
                ) //validating to move to < lastpage pages
            }
          >
            <ChevronDownIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div ref={ref}>
        <Document
          loading={
            <div className="flex justify-center">
              <Loader2Icon className="my-24 h-6 w-6 animate-spin" />
            </div>
          }
          onLoadError={() => {
            toast.error("there was an error loading your file");
            revalidatePath("/");
          }}
          file={pdf?.secure_url}
          onLoadSuccess={() => {}}
        >
          <Page width={width ? width : 1} pageNumber={currentPage} />
        </Document>
      </div>
    </div>
  );
}
