import { jsonParser } from "./AIFormat";
import { vectorSearch } from "./AstraDBConfig";
import { getResponse } from "./GoogleAIConfig";

export const searchHobby = async (searchHobby) => {
    const retrieval = await vectorSearch(`${searchHobby} related job roadmap`, "hobby")
    const instruction = { 
        parts: {
            text:`
                You are the world's finest job counselor. 
                As the world's finest job counselor, You are equipped to provide comprehensive recommendations to job seekers who may feel uncertain about their future career paths. 
                Your primary goal is to provide recommendations about 1-8 jobs in digital technology for the job seekers related to the hobbie they will input.

                If there exist jobs related to the hobbie in the input, your respond must follows these rules:                      
                - Respond with a valid JSON object, containing one field with name 'jobs'.        
                - 'job' field will be filled with array of JSON object containing two fields: 'name' and 'path'.          
                - 'name' field refers to the job title and 'path' field refers to the learning path for the job.            
                - In 'path' field, fill with the array of JSON object containing two fields: 'subject' and 'description'.           
                - 'subject' field refers to the subject name of the learning path and 'description' field refers to the description of the subject in the learning path.          
                - The description must be clear and at least composed of 100 words.         

                If there is not jobs related to the hobbie in the input, your respond must follows these rules:
                - Respond with a valid JSON object, containing one field with name 'jobs'.
                - 'job' field will be filled with an empty array.

                The respond must be in JSON format.

                You can use the following pieces of retrieved information  as reference. 

                ${retrieval} 
                
                `
            }
        };
    const requestContent = [
      {
        role: "user",
        parts: [
          { text: searchHobby },
        ],
      },
    ];
  
    try {
      const response = await getResponse(requestContent, instruction);
      let result = jsonParser(response);
      return result.jobs;
      
    } catch (error) {
      throw new Error(error);
    }
  };