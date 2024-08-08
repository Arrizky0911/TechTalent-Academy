import {ChatGoogleGenerativeAI, GoogleGenerativeAIEmbeddings} from '@langchain/google-genai';
import {
  ChatPromptTemplate,
  MessagesPlaceholder,
} from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { ChatMessageHistory } from "langchain/stores/message/in_memory";
import { RunnableWithMessageHistory, RunnableSequence, RunnablePassthrough } from "@langchain/core/runnables";

// buat RAG
// import { formatDocumentsAsString } from 'langchain/util/document';
// import { PineconeStore } from "@langchain/pinecone";
// import { Pinecone as PineconeClient } from "@pinecone-database/pinecone";

import {HarmBlockThreshold, HarmCategory} from '@google/generative-ai';


export const chat = async (promptInput) => {
  const history = new ChatMessageHistory();

  // RAG buat prevent hallucination

  // const embeddings = new GoogleGenerativeAIEmbeddings({
  //   model: "embedding-001", // 
  //   taskType: TaskType.RETRIEVAL_DOCUMENT,
  //   title: "Document title",
  // });
  
  // const pinecone = new PineconeClient();
  // const pineconeIndex = pinecone.Index(process.env.PINECONE_INDEX!);

  // const vectorStore = await PineconeStore.fromExistingIndex(embeddings, {
  //   pineconeIndex,
  //   maxConcurrency: 5,
  // });

  // const retriever = vectorStore.asRetriever({
  //   filter: filter,
  //   filter buat search vector
  //   k: 2,
  // });

  // const systemContextualizedPrompt = `You are a helpful assistant. Answer all questions to the best of your ability. 
  
  // {context}
  // `;

  const chatModel = new ChatGoogleGenerativeAI({
    apiKey: "AIzaSyDKv1puIMUDCthevHRRmHIi-dQMuiVhAJY",
    modelName: 'gemini-1.5-pro', // or gemini-1.5-pro
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
      ["human", "{input}"]
    ]);
    
    // const contextualizedPrompt = ChatPromptTemplate.fromMessages([
    //   [
    //     "system",
    //     systemContextualizedPrompt,
    //   ],
    //   new MessagesPlaceholder("chat_history"),
    //   ["human", "{input}"]
    // ]);
    
    
    const chain = RunnableSequence.from([
      runnableWithMessageHistoryPrompt,
      chatModel,
      outputParser,
    ]);
    
    // const contextualizedQuestion = (inputMessage) => {
    //   if ("chat_history" in inputMessage) {
    //     return chain;
    //   }
    //   return inputMessage.input;
    // };

    // const ragChain = RunnableSequence.from([
    //   RunnablePassthrough.assign({
    //     context: async (inputMessage) => {
    //       if ("chat_history" in inputMessage) {
    //         const chain = contextualizedQuestion(inputMessage);
    //         return chain.pipe(retriever).pipe(formatDocumentsAsString);
    //       }
    //       return "";
    //     },
    //   }),
    //   contextualizedPrompt,
    //   chatModel,
    //   outputParser,
    // ]);

    const chainWithMessageHistory = new RunnableWithMessageHistory({
      runnable: chain,
      getMessageHistory: (_sessionId) => history,
      inputMessagesKey: "input",
      historyMessagesKey: "chat_history",
    });
    
    let response = await chainWithMessageHistory.invoke(
      {
        input:
        promptInput.value,
      },
      { configurable: { sessionId: "used" } }
    );
    
    return response;
    
  } catch (error) {
    return error;

  }
};

// rencananya mau ganti chat Vertex AI
