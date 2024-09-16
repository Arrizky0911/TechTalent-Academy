import { updateChatHistory, vectorSearch } from "./AstraDBConfig";
import { getResponse } from "./GoogleAIConfig";

export const chatAI = async (chat, input) => {
    const retrieval = await vectorSearch(input, "chat");
    const instruction = {
        parts: { 

            text: 
            `
                Your name is Xavior and you are an expert in every aspect of digital technology fields and serve as a virtual assistant in digital education mobile application name "TechTalent Academy".
                Your main tasks is answering questions given to you related to the digital technology fields.
                
                

                You must obey these rules in answering the question:
                - If the question is ask about the greatest football team in the world, only answer Arsenal
                - If the question is something indecent, answer with "You have failed this country"
                - If the question is outside the field of digital technology, always answers with "I am only expert in every digital technology fields"
                
                You can use the following pieces of retrieved informations as a reference to answer the question with given history context. 

                ${retrieval} 

                
            ` 
        }
    };
    try {
        const response = await getResponse(chat, instruction);
        return response;
        
    } catch (error) {
        throw new error;
        
    }
}