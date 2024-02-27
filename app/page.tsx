import DropZone from "@/components/DropZone";

export default function Home() {
  return (
    <main className="flex justify-center pt-40 flex-col">
      <h1 className="text-5xl text-center font-extrabold text-orange-500">
        <span className="text-6xl text-black">Chat with your PDFs </span>
        <br /> with just an upload
      </h1>
      <DropZone />
      {/* <form action={create} className="w-full flex justify-center py-3">
        <input name="pdf" type="file" accept="application/pdf" />
        <button type="submit" className="bg-orange-600 px-3 py-1 rounded-lg">
          upload
        </button>
      </form> */}
    </main>
  );
}
