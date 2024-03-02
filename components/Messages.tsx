import { cn } from "@/lib/utils";
import { message } from "./Chat";
import { Loader } from "lucide-react";
import { useEffect, useRef } from "react";

type Props = {
  messages: message[];
  isPending: boolean;
  error: boolean;
};

export default function Messages({ messages, isPending, error }: Props) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  return (
    <div className="flex flex-col overflow-y-auto py-2 gap-2 pb-6">
      {messages.map(({ role, content }, index) => (
        <div
          key={index}
          className={cn(
            "min-h-12 flex flex-col justify-center w-full px-3 rounded-lg py-2",
            (role === 'user' ? 'bg-orange-200' : 'bg-blue-200')
          )}
        >
          <span>{role === "user" ? "You: " : "AI: "}</span>
          {content}
        </div>
      ))}

      {isPending && (
        <div className="flex flex-col w-full bg-blue-200 px-3 py-2 rounded-lg">
          <p>AI:</p>
          <Loader className="h-6 w-6 animate-spin"/>
        </div>
      )}
      {error && (
        <div className="h-12 py-2 flex items-center w-full bg-red-300 px-3 rounded-lg">
          There was an error sending your message, try again
        </div>
      )}

      <div ref={messagesEndRef}></div>
    </div>
  );
}