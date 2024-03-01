import { message } from "./Chat"

type Props = {
    messages: message[]
    isPending: boolean
}

export default function Messages ({messages, isPending}: Props) {    
    return (
        <div className="max-h-full overflow-auto w-full">
            {messages.map((msg, index) => (
                <div key={index} className="py-3 border border-b-zinc-300 w-full">
                    <p>{msg.role}: {msg.content}</p>
                </div>
            ))}
            {isPending && '...'}
        </div>
    )
}