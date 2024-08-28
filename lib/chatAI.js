import { DataAPIClient } from "@datastax/astra-db-ts";
import { AstraDBChatMessageHistory } from "@langchain/community/stores/message/astradb";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { HarmBlockThreshold, HarmCategory } from "@google/generative-ai";
import {
  ChatPromptTemplate,
  MessagesPlaceholder,
} from "@langchain/core/prompts";
import {
  RunnableSequence,
  RunnableWithMessageHistory,
} from "@langchain/core/runnables";
import { StringOutputParser } from "@langchain/core/output_parsers";

// Initialize the client
const client = new DataAPIClient(
  "AstraCS:GDuZhuUSapuZugoJYggycGWB:02fc981ca2785cab90f40bf44981de6a9ae5c3deb8acb7e8943ea9eafc140240"
);
const db = client.db(
  "https://c0621f6b-209b-4e34-8eec-52912ac940b8-us-east1.apps.astra.datastax.com",
  { namespace: "default_keyspace" }
);
const collection = db.collection("YOUR_COLLECTION_NAME");

export async function Chat(sessionId, text) {
  try {
    const prompt = ChatPromptTemplate.fromMessages([
      [
        "system",
        "You are a helpful assistant. Answer all questions to the best of your ability.",
      ],
      new MessagesPlaceholder("chat_history"),
      ["human", "{input}"],
    ]);

    // Call the multimodal model, and get a stream of results
    const model = new ChatGoogleGenerativeAI({
      apiKey: "AIzaSyCj8_4rGPoeHo_GbUQmH3qhI2s_8wGU2OU",
      modelName: "gemini-1.5-flash",
      safetySettings: [
        {
          category: HarmCategory.HARM_CATEGORY_HARASSMENT,
          threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
        },
      ],
    });

    const chain = RunnableSequence.from([
      prompt,
      model,
      new StringOutputParser(),
    ]);

    const chat = new RunnableWithMessageHistory({
      runnable: chain,
      getMessageHistory: async (sessionId) => {
        const chatHistory = new AstraDBChatMessageHistory({
          collection,
          sessionId: sessionId,
        });
        return chatHistory;
      },
      inputMessagesKey: "input",
      historyMessagesKey: "chat_history",
    });

    const response = await chat.invoke(
      {
        input: text,
      },
      {
        configurable: {
          sessionId: sessionId,
        },
      }
    );

    return response;
  } catch (error) {
    return error;
  }
}

export async function getHistory(sessionId) {
  const chatHistory = new AstraDBChatMessageHistory({
    collection,
    sessionId: sessionId,
  });
  return chatHistory;
}
