import { UseMutationResult, useMutation } from "@tanstack/react-query";
import { Button } from "./ui/Button";
import { Textarea } from "./ui/Textarea";
import axios from "axios";
import { Dispatch, FormEvent, SetStateAction, useRef } from "react";
import { message } from "./Chat";

type ChatInputProps = {
  input: string
  setInput: Dispatch<SetStateAction<string>>
  handleAsk: (ev: FormEvent) => void
  isPending: boolean
}

export default function ChatInput({input, setInput, handleAsk, isPending}: ChatInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  return (
    <form className="w-full absolute bottom-0 left-0 bg-white">
      <div className="flex flex-col items-end gap-1 p-2">
        <Textarea
          className="resize-none py-3 pr-20 border border-zinc-500 scrollbar-thumb-black scrollbar-thumb-rounded scrollbar-w-2 scrolling-touch"
          rows={1}
          maxRows={4}
          placeholder="Ask anything..."
          autoFocus
          ref={textareaRef}
          onKeyDown={(ev) => {
            if (ev.key === 'enter' && !ev.shiftKey) {
              ev.preventDefault()
              handleAsk(ev)
              textareaRef.current?.focus()
            }
          }}
          value={input}
          onChange={ev => setInput(ev.target.value)}
        />
        <Button
          type="submit"
          aria-label="send message"
          className="absolute bottom-3 right-4"
          disabled={isPending || input === ''}
          onClick={handleAsk}
        >
          Send
        </Button>
      </div>
    </form>
  );
}
