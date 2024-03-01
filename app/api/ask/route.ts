import { pinecone } from "@/lib/pinecone";
import { OpenAIEmbeddings } from "@langchain/openai";
import { PineconeStore } from "@langchain/pinecone";
import { NextRequest, NextResponse } from "next/server";
import {openai} from '@/lib/openai'
import { message } from "@/components/Chat";
import {OpenAIStream, StreamingTextResponse} from 'ai'

export async function POST(req: NextRequest) {
  const { fileId, userMessage, formattedPrevMessages } = await req.json();
  console.log(formattedPrevMessages)
  //vectorize user message
  const embeddings = new OpenAIEmbeddings({
    openAIApiKey: process.env.OPENAI_KEY,
  });

  const pineconeIndex = pinecone.Index("pdx");

  const vectorStore = await PineconeStore.fromExistingIndex(embeddings, {
    pineconeIndex, 
    namespace: fileId 
  })

  const results = await vectorStore.similaritySearch(userMessage.content, 8)

  const response = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    temperature: 0,
    stream: true,
    messages: [
        {
          role: 'system',
          content:
            'Use the following pieces of context (or previous conversaton if needed) to answer the users question in markdown format.',
        },
        {
          role: 'user',
          content: `Use the following pieces of context (or previous conversaton if needed) to answer the users question in markdown format. \nIf you don't know the answer, just say that you don't know, don't try to make up an answer.
          
    \n----------------\n
    
    PREVIOUS CONVERSATION:
    ${formattedPrevMessages.map((message: message) => {
      if (message.role === 'user') return `User: ${message.content}\n`
      return `Assistant: ${message.content}\n`
    })}
    
    \n----------------\n
    
    CONTEXT:
    ${results.map((r) => r.pageContent).join('\n\n')}
    
    USER INPUT: ${userMessage}`,
        },
      ],
  })

  const stream = OpenAIStream(response, {
    async onCompletion (completion) {}
  })

  return new StreamingTextResponse(stream)
}
