import OpenAI from "openai"

let openai: OpenAI | null = null
let documentChunks: string[] = []
let chunkEmbeddings: number[][] = []

export const initOpenAI = (apiKey: string) => {
  if (!openai) {
    openai = new OpenAI({
      apiKey,
      dangerouslyAllowBrowser: true,
    })
  }
}

export const processDocument = async (text: string, chunkSize = 1000) => {
  if (!openai) throw new Error("OpenAI client is not initialized!")

  documentChunks = chunkText(text, chunkSize)

  const embeddings = await Promise.all(
    documentChunks.map((chunk) => createEmbeddings(openai!, chunk))
  )

  chunkEmbeddings = embeddings.filter(
    (embedding): embedding is number[] => embedding !== null
  )

  if (chunkEmbeddings.length === 0) {
    throw new Error("Failed to generate embeddings for any chunks")
  }
}

const chunkText = (
  text: string,
  chunkSize = 1000,
  overlapSize = 200
): string[] => {
  const cleanedText = text.replace(/\s+/g, " ").trim()

  const words = cleanedText.split(" ")
  const chunks: string[] = []

  for (let i = 0; i < words.length; i += chunkSize - overlapSize) {
    const chunkWords = words.slice(i, i + chunkSize).join(" ")
    chunks.push(chunkWords)
  }

  return chunks
}

const createEmbeddings = async (
  openai: OpenAI,
  text: string,
  model = "text-embedding-3-small"
) => {
  try {
    const res = await openai.embeddings.create({
      model,
      input: text,
    })
    return res.data[0].embedding
  } catch (err) {
    console.error(err)
    return null
  }
}

export const chatWithPDF = async (
  query: string,
  messageHistory: {
    content: string
    role: "user" | "assistant" | "system"
  }[]
) => {
  if (!openai) throw new Error("OpenAI client is not initialized!")

  // Generate embedding for the query
  const queryEmbedding = await createEmbeddings(openai, query)
  if (!queryEmbedding) throw new Error("Failed to generate query embedding")

  // Find the most relevant chunks
  const relevantChunks = findRelevantChunks(
    queryEmbedding,
    chunkEmbeddings,
    documentChunks
  )

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "developer",
          content:
            "You are a helpful AI assistant answering questions based on a document. Here is the relevant context from the document:\n" +
            relevantChunks.join("\n\n"),
        },
        ...messageHistory,
        {
          role: "user",
          content: query,
        },
      ],
      store: true,
    })

    return response.choices[0].message.content
  } catch (err) {
    console.error(err)
    return "I'm sorry, I couldn't understand that. Could you please rephrase?"
  }
}

const findRelevantChunks = (
  queryEmbedding: number[],
  chunkEmbeddings: number[][],
  documentChunks: string[],
  topK = 3
) => {
  // Calculate similarities between query and chunks
  const similarities = chunkEmbeddings.map((chunkEmbedding, index) => ({
    chunk: documentChunks[index],
    similarity: calculateCosineSimilarity(queryEmbedding, chunkEmbedding),
  }))

  // Sort and return top K most similar chunks
  return similarities
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, topK)
    .map((item) => item.chunk)
}

function calculateCosineSimilarity(
  vectorA: number[],
  vectorB: number[]
): number {
  // Validate input vectors
  if (vectorA.length !== vectorB.length) {
    throw new Error("Vectors must be of equal length")
  }

  // Calculate dot product
  const dotProduct = vectorA.reduce(
    (sum, value, index) => sum + value * vectorB[index],
    0
  )

  // Calculate vector magnitudes
  const magnitudeA = Math.sqrt(
    vectorA.reduce((sum, value) => sum + value * value, 0)
  )
  const magnitudeB = Math.sqrt(
    vectorB.reduce((sum, value) => sum + value * value, 0)
  )

  // Prevent division by zero
  return magnitudeA && magnitudeB ? dotProduct / (magnitudeA * magnitudeB) : 0
}
