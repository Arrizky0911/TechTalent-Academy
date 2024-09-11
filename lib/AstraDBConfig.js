import axios from "axios";
import { embeddingWord } from "./GoogleAIConfig";

const chatHistoryCollection = "chat_history"
const vectorSearchCollection = "rag"
const options = {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  };
const date = new Date().toLocaleDateString("en-US", options);

const AstraDBRequest = async (data, collection) => {
    try {
      const result = await axios.post(
        `https://c0621f6b-209b-4e34-8eec-52912ac940b8-us-east1.apps.astra.datastax.com/api/json/v1/default_keyspace/${collection}`,
        data,
        {
          headers:
          {
            'Content-Type': 'application/json',
            'Token': 'AstraCS:eczuiOLXOZUXSzGpSXIkIYtr:7eefc5006a23a8976414f9de887104012de9b0c08221237afbeeaa08e819fe2b',
          }
        },
      );

      return result;
      
    } catch (error) {
      console.error("Error calling API:", error);
      console.error("Error response:", error.response);
    
      return error;
    
    }

}

export const vectorSearch = async (input, feature) => {
    const vectorized = await embeddingWord(input);

    if (feature == "chat") {
      filter = {"$in": ["hobby", "interview", "agent"] };
    } else {
      filter = {"$eq": feature };
    } 
    
    const vectorSearchConfig = {
      "find": {
        "sort": {"$vector": vectorized},
        "projection": {"$vectorize": 1},
        "filter": {
          "metadata.feature": filter
        },
        "options": {
          "includeSimilarity": true,
          "limit": 20
        }
      }
    }

    try {
        const result = await AstraDBRequest(vectorSearchConfig, vectorSearchCollection);
        const output = result.data.data.documents?.map((item) => `- ${item.content}`).join("\n");
        return output;

    } catch (error) {
        throw new error;

    }
}

  
export const addChatHistory = async (sessionID, chat) => {
    
    const addChatHistoryRequest = {
        "insertOne": {
            "document": {
                "_id" : sessionID,
                "status": "unarchived",
                "lastUpdate": date,
                "chat": chat,
            }
        }
    }

    try {
        await AstraDBRequest(addChatHistoryRequest, chatHistoryCollection);
        console.log("success add history");

    } catch (error) {
        throw new error;

    }
    
}

export const loadChatHistory = async (sessionID) => {
    const loadChatHistoryRequest = {
        "find": {
            "filter": {
                "_id" : sessionID,
            }
        }
    }
    
    try {
        const loadedChat = await AstraDBRequest(loadChatHistoryRequest, chatHistoryCollection);
        console.log("success load history");
        return loadedChat.data.data.documents;
    
    } catch (error) {
        throw new error;
    
    }
    
}

export const updateChatHistory = async (sessionID, chat) => {
    const updateChatHistoryRequest = {
        "find": {
            "filter": {
                "_id" : sessionID,
            },
            "update":{
                "$set": {
                    "chat": chat,
                    "lastUpdate": date
                }
            }
        }
    }
    
    try {
        await AstraDBRequest(updateChatHistoryRequest, chatHistoryCollection);
        console.log("success update history");
    
    } catch (error) {
        throw new error;
    
    }
    
}

export const setArchiveChatHistory = async (sessionID, action) => {
    const updateChatHistoryRequest = {
        "find": {
            "filter": {
                "_id" : sessionID,
            },
            "update":{
                "$set": {
                    "status": action,
                    "lastUpdate": date
                }
            }
        }
    }
    
    try {
        await AstraDBRequest(updateChatHistoryRequest, chatHistoryCollection);
        console.log(`success ${action} history`);
    
    } catch (error) {
        throw new error;
    
    }

}


