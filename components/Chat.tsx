"use client";

import Messages from "./Messages";
import ChatInput from "./ChatInput";
import { FormEvent, useState } from "react";
import { useMutation } from "@tanstack/react-query";

export type message = {
  role: "user" | "system";
  content: string;
};

type Props = { fileId: string };

export default function Chat({ fileId }: Props) {
  const [input, setInput] = useState<string>("");
  const [messages, setMessages] = useState<message[]>([]);

  const ask = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/ask", {
        method: "POST",
        body: JSON.stringify({
          userMessage: { role: "user", content: input },
          fileId,
          formattedPrevMessages: messages,
        }),
      });
      if (!res.ok) throw new Error("failed to ask");

      const { response: answer } = await res.json();
      setMessages([...messages, { role: "system", content: answer }]);

      return res.body;
    },
    onSuccess: () => setInput(""),
  });

  return (
    <div className="relative h-96 md:h-screen flex-col justify-between flex md:w-full lg:border-none lg:w-[36%] bg-white">
      <h1 className="text-xl flex items-center h-12 bg-orange-400 px-3 font-mono">
        CHAT
      </h1>
      <div className="flex-1 overflow-auto box-border pb-10 px-3">
        <Messages
          messages={messages}
          isPending={ask.status === "pending"}
          error={ask.status === "error"}
        />
      </div>
      <ChatInput
        input={input}
        setInput={setInput}
        isLoading={ask.status === "pending"}
        handleAsk={async (ev: FormEvent) => {
          ev.preventDefault();
          const newMsg = { role: "user", content: input } as message;
          setMessages((prev) => [...prev, newMsg]);
          ask.mutate();
        }}
      />
    </div>
  );
}
