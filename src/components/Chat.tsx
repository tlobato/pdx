// import { chatWithPDF } from "@/utils/ai"
import { useState } from "react"

export default function Chat() {
  const [messages, setMessages] = useState<
    {
      role: "user" | "assistant"
      content: string
    }[]
  >([])
  const [input, setInput] = useState("")

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault()
    setMessages((prev) => [...prev, { content: input, role: "user" }])

    // const res = await chatWithPDF(input, [])
    // if (res)
    //   setMessages((prev) => [...prev, { content: res, role: "assistant" }])
  }

  return (
    <div className="w-full md:w-1/2 h-[50vh]">
      <header className="p-2 w-full">
        <h1 className="text-xl">Chat</h1>
      </header>
      <ul className="overflow-auto">
        {messages ? (
          messages.map((msg, i) => (
            <li key={i} className="p-2">
              <div className="text-sm">
                <span className="font-bold">{msg.role}</span>: {msg.content}
              </div>
            </li>
          ))
        ) : (
          <li>No messages</li>
        )}
      </ul>
      <form
        onSubmit={handleSubmit}
        className="flex gap-2 p-2 fixed bottom-0 right-0 md:w-[50vw] w-full"
      >
        <input
          type="text"
          className="w-full px-2 py-1 rounded-lg"
          placeholder="..."
          onChange={(ev) => setInput(ev.target.value)}
        />
        <button
          type="submit"
          className="bg-orange-600 px-2 rounded-lg border-2 text-2xl border-orange-700"
        >
          Send
        </button>
      </form>
    </div>
  )
}
