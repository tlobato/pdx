"use client";

import Messages from "./Messages";
import ChatInput from "./ChatInput";
import { FormEvent, useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";

export type message = {
  role: "user" | "system";
  content: string;
};

type Props = { fileId: string, uploadIsPending: boolean }

export default function Chat({ fileId, uploadIsPending }: Props) {
  const [input, setInput] = useState<string>('');
  const [messages, setMessages] = useState<message[]>([]);

  const ask = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/ask", {
        method: "POST",
        body: JSON.stringify({
          userMessage: {role: 'user', content: input},
          fileId,
          formattedPrevMessages: messages,
        }),
      });

      setInput("");
      if (!res.ok) throw new Error("opusk");

      const answer = await res.json();
      const newMsg = { role: "system", content: answer } as message;
      setMessages((prev) => [...prev, newMsg]);

      return res.body;
    },
  });

  return (
    <div className="relative min-h-full bg-white flex-col justify-between gap-2 min-w-[30%] border border-black p-4 flex md:h-screen md:w-1/4">
      <h1 className="text-2xl border border-b-zinc-400">chat</h1>
      <div className="flex-1 overflow-auto h-3/4 pb-10">
        <Messages messages={messages} isPending={ask.status === "pending"} />
      </div>
      <ChatInput
        input={input}
        setInput={setInput}
        isPending={ask.status === "pending" || uploadIsPending}
        handleAsk={async (ev: FormEvent) => {
          ev.preventDefault();
          const newMsg = { role: "user", content: input } as message;
          setMessages((prev) => [...prev, newMsg]);
          ask.mutate(), 5000;
        }}
      />
    </div>
  );
}
