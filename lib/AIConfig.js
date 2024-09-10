import axios from "axios";
import * as FileSystem from "expo-file-system";
import { vec } from "react-native-redash";

export const getResponse = async (requestContent, systemInstructions) => {
  try {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=AIzaSyC9iIPHHg-eCKL4uuEiwuBXo0c4BDIFq4w`,
      {
        "system_instruction": systemInstructions,
        contents: requestContent,
      }
    );

    const modelResponse =
      response.data?.candidates?.[0]?.content?.parts?.[0]?.text || "";

    if (modelResponse) {
      return modelResponse;
    }
  } catch (error) {
    console.error("Error calling Gemini Pro API:", error);
    console.error("Error response:", error.response);

    return error;
  }
};

export const getTranscript = async (audio) => {
  const base64Audio = await FileSystem.readAsStringAsync(audio, {
    encoding: "base64",
  });
  let audioConfig = {
    config: {
      enableWordTimeOffsets: true,
      sampleRateHertz: 48000,
      encoding: "MP3",
      languageCode: "en-US",
    },
    audio: {
      content: base64Audio,
    },
  };
  try {
    // let access_token = await getToken();
    const response = await axios.post(
      `https://speech.googleapis.com/v1/speech:recognize?key=AIzaSyC9iIPHHg-eCKL4uuEiwuBXo0c4BDIFq4w`,
      audioConfig
    );
    console.log(response.data);
    const modelResponse =
      response.data.results?.[0]?.alternatives?.[0]?.transcript || "";

    if (modelResponse) {
      console.log(modelResponse);
      return modelResponse;
    }
  } catch (error) {
    console.error("Error calling Gemini Pro API:", error);
    console.error("Error response:", error.response);

    return error;
  }
};

// const getToken = async () => {
//   const access_token = await axios.post(
//     "https://accounts.google.com/o/oauth2/token",
//     {
//       client_id: process.env.client_id,
//       client_secret: process.env.client_secret,
//       refresh_token: process.env.refresh_token,
//       grant_type: "refresh_token",
//     }
//   );

//   console.log(access_token.data);
//   console.log(access_token.data.access_token);
//   return access_token.data.access_token;
// };

const embeddingWord = async (text) => {
  const embeddingConfig = {
    "model": "models/text-embedding-004",
    "content": {
      "parts":[
        {"text": text}
      ]
    } 
  }
  try {
    const vectorized = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/text-embedding-004:embedContent?key=AIzaSyC9iIPHHg-eCKL4uuEiwuBXo0c4BDIFq4w`,
      embeddingConfig
    );
    return vectorized.data.embedding.values;
    
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
    const result = await axios.post(
      `https://c0621f6b-209b-4e34-8eec-52912ac940b8-us-east1.apps.astra.datastax.com/api/json/v1/default_keyspace/rag`,
      vectorSearchConfig,
      {
        headers:
        {
          'Content-Type': 'application/json',
          'Token': 'AstraCS:eczuiOLXOZUXSzGpSXIkIYtr:7eefc5006a23a8976414f9de887104012de9b0c08221237afbeeaa08e819fe2b',
        }
      },
    );
    const output = result.data.data.documents?.map((item) => `- ${item.content}`).join("\n");
    return output;
    
  } catch (error) {
    console.error("Error calling API:", error);
    console.error("Error response:", error.response);

    return error;

  }
}
