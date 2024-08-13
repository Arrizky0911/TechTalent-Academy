import {
  ChatGoogleGenerativeAI,
  GoogleGenerativeAIEmbeddings,
} from "@langchain/google-genai";
import {
  ChatPromptTemplate,
  MessagesPlaceholder,
} from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { ChatMessageHistory } from "langchain/stores/message/in_memory";
import {
  RunnableWithMessageHistory,
  RunnableSequence,
  RunnablePassthrough,
} from "@langchain/core/runnables";

import { HarmBlockThreshold, HarmCategory } from "@google/generative-ai";
import { useState } from "react";

export const chat = async (promptInput) => {
  const [history, setHistory] = useState(new ChatMessageHistory());

  const chatModel = new ChatGoogleGenerativeAI({
    apiKey: "AIzaSyDKv1puIMUDCthevHRRmHIi-dQMuiVhAJY",
    modelName: "gemini-1.5-pro", // or gemini-1.5-pro
    safetySettings: [
      {
        category: HarmCategory.HARM_CATEGORY_HARASSMENT,
        threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
      },
    ],
  });

  const outputParser = new StringOutputParser();

  try {
    const runnableWithMessageHistoryPrompt = ChatPromptTemplate.fromMessages([
      [
        "system",
        "You are a helpful assistant. Answer all questions to the best of your ability.",
      ],
      new MessagesPlaceholder("chat_history"),
      ["human", "{input}"],
    ]);

    const chain = RunnableSequence.from([
      runnableWithMessageHistoryPrompt,
      chatModel,
      outputParser,
    ]);

    const chainWithMessageHistory = new RunnableWithMessageHistory({
      runnable: chain,
      getMessageHistory: (_sessionId) => setHistory({ ...history, _sessionId }),
      inputMessagesKey: "input",
      historyMessagesKey: "chat_history",
    });

    await chainWithMessageHistory.invoke(
      {
        input: promptInput.value,
      },
      { configurable: { sessionId: "used" } }
    );

    return history;
  } catch (error) {
    return error;
  }
};

// rencananya mau ganti chat Vertex AI
