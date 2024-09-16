import axios from "axios";
import { embeddingWord } from "./GoogleAIConfig";

const chatHistoryCollection = process.env.ASTRA_DB_CHATHISTORY_COLLECTIONS;
const vectorSearchCollection = process.env.ASTRA_DB_VECTORSTORE_COLLECTIONS;
const userSessionsCollection = process.env.ASTRA_DB_CHATSESSION_COLLECTIONS;
const interviewResultCollection = process.env.ASTRA_DB_INTERVIEWHISTORY_COLLECTIONS;
const interviewSessionCollection = process.env.ASTRA_DB_INTERVIEWSESSION_COLLECTIONS;

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
        `${process.env.ASTRA_DB_ENDPOINT}/api/json/v1/${process.env.ASTRA_DB_KEYSPACE}/${collection}`,
        data,
        {
          headers:
          {
            'Content-Type': 'application/json',
            'Token': process.env.ASTRA_DB_TOKEN,
          }
        },
      );

      return result;
      
    } catch (error) {
      console.error("Error calling  Astra DB API:", error);
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
          "limit": 4
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

  
export const addChatHistory = async (sessionID, userID, chat, input) => {
    const addChatSessionRequest = {
        "insertOne": {
            "document": {
                "_id" : sessionID,
                "user_id": userID,
                "lastUpdate": date,
                "header": input,
                "status": "unarchived",
            }
        }
    }
    const addChatHistoryRequest = {
        "insertOne": {
            "document": {
                "_id" : sessionID,
                "chat": chat,
            }
        }
    }

    try {
        await AstraDBRequest(addChatSessionRequest, userSessionsCollection);
        await AstraDBRequest(addChatHistoryRequest, chatHistoryCollection);
        console.log("success add new chat history");

    } catch (error) {
        throw new error;

    }
    
}

export const loadChatHistory = async (sessionID) => {
    if (sessionID === "noSession") {
        console.log("new chat")
        return
    }
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
        "updateOne": {
            "filter": {
                "_id" : {
                    "$eq": sessionID
                }
            },
            "update":{
                "$set": {
                    "chat": chat,
                }
            }
        }
    }
    
    const updateUserSessionRequest = {
        "updateOne": {
            "filter": {
                "_id" : {
                    "$eq": sessionID
                }
            },
            "update":{
                "$set": {
                    "lastUpdate": date,
                }
            }
        }

    }
    
    try {
        const update = await AstraDBRequest(updateChatHistoryRequest, chatHistoryCollection);
        await AstraDBRequest(updateUserSessionRequest, userSessionsCollection);
        console.log(update.data)
        console.log("success update history");
        
    } catch (error) {
        throw new error;
        
    }
    
}

export const setArchiveChatHistory = async (sessionID, action) => {
    const updateChatHistoryRequest = {
        "updateOne": {
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
        await AstraDBRequest(updateChatHistoryRequest, userSessionsCollection);
        console.log(`success ${action} history`);
    
    } catch (error) {
        throw new error;
        
    }
    
}

export const loadUserSessions = async (userID, archive) => {
    if (archive) {
        filter = {
            "user_id" : userID,
            "status" : "archived"
        }
    } else {
        filter = {
            "user_id" : userID
        }
    }
    
    const loadUserSessionsRequest = {
        "find": {
            "filter": filter,
            "sort": {
                "lastUpdate": 1
            }
        }
    }
    
    try {
        const userSessions = await AstraDBRequest(loadUserSessionsRequest, userSessionsCollection);
        console.log("success load userSessions");
        return userSessions.data.data.documents;
        
    } catch (error) {
        throw new error;
        
    }
    
}

export const deleteMessage = async (sessionID) => {
    const deleteMessageRequest = {
        "deleteOne": {
            "filter": {
                "_id": sessionID
            }
        }
    }
    const deleteSessionRequest = {
        "deleteOne": {
            "filter": {
                "_id": sessionID
            },
        }
    }
    
    try {
        await AstraDBRequest(deleteMessageRequest, chatHistoryCollection);
        await AstraDBRequest(deleteSessionRequest, userSessionsCollection);
        console.log("success delete message");
        
    } catch (error) {
        throw new error;
        
    }

} 

export const addInterviewHistory = async (interviewResult, grade, userID, sessionID, job) => {
    const addInterviewSessionRequest = {
        "insertOne": {
            "document": {
                "_id" : sessionID,
                "user_id": userID,
                "createdAt": date,
                "grade": grade,
                "jobTitle": job
            }
        }
    }
    const addInterviewHistoryRequest = {
        "insertOne": {
            "document": {
                "_id" : sessionID,
                "result": interviewResult,
            }
        }
    }

    try {
        await AstraDBRequest(addInterviewSessionRequest, interviewSessionCollection);
        await AstraDBRequest(addInterviewHistoryRequest, interviewResultCollection);
        console.log("success add new interview history");

    } catch (error) {
        throw new error;

    }
}

export const loadAllInterviews = async (userID) => {
    const loadUserInterviewSessionsRequest = {
        "find": {
            "filter": {
                "user_id": userID,
            },
            "sort": {
                "createdAt": 1
            }
        }
    }
    
    try {
        const userSessions = await AstraDBRequest(loadUserInterviewSessionsRequest, interviewSessionCollection);
        console.log(userSessions.data);
        console.log("success load interview sessions");
        return userSessions.data.data.documents;
        
    } catch (error) {
        throw new error;
        
    }
}

export const loadInterviewResult = async (sessionID) => {
    const loadInterviewHistoryRequest = {
        "find": {
            "filter": {
                "_id" : sessionID,
            }
        }
    }
    
    try {
        const loadedChat = await AstraDBRequest(loadInterviewHistoryRequest, interviewResultCollection);
        console.log("success load interview history");
        return loadedChat.data.data.documents?.[0]?.result;
        
    } catch (error) {
        throw new error;
        
    }
}

export const deleteInterviewResult = async (sessionID) => {
    const deleteInterviewResultRequest = {
        "deleteOne": {
            "filter": {
                "_id": sessionID
            },
        }
    }
    const deleteSessionRequest = {
        "deleteOne": {
            "filter": {
                "_id": sessionID
            }
        }
    }
    
    try {
        await AstraDBRequest(deleteInterviewResultRequest, interviewResultCollection);
        await AstraDBRequest(deleteSessionRequest, interviewSessionCollection);
        console.log("success delete interview result");
        
    } catch (error) {
        throw new error;
        
    }
}

