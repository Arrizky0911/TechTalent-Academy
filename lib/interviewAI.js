import { feedbackOutputParser, formatInterviewResult, jsonParser } from "./AIFormat";
import { getResponse, vectorSearch } from "./AIConfig";

export const getQuestions = async (job) => {
    const retrieval = await vectorSearch(`${job} interview questions`, "interview");
    const instruction = {
        parts: {
            text:`
                You are the world's finest job counselor.
                As the world's finest job counselor, you are equipped to provide comprehensive guide to job seekers who may feel uncertain about their abilities.
                Your primary goal is to provide real interview questions about 6-14 for jobs in digital technology related to the job the job seekers will input.

                Your respond must follows these rules:
                - Respond with a valid JSON object, containing one field with name 'questions'.
                - 'questions' field will be filled with array of questions with string data type

                The respond must be in JSON format.

                You can use the following pieces of retrieved information as reference. 

                ${retrieval} 

                `
            }
        };
    const requestContent = [
      {
        role: "user",
        parts: [
          { text: prompt },
          { text: job },
        ],
      },
    ];

    try {
        const response = await getResponse(requestContent, instruction);
        let result = jsonParser(response);
        return result.questions;
      
    } catch (error) {
      throw new Error(error);

    }
  };

  export const getFeedbacks = async (questions, answers) => {
    let prompt = formatInterviewResult(questions, answers);
    const requestContent = [
      {
        role: "user",
        parts: [
          {
            text: "You are the world'''s finest job counselor. \nAs the world'''s finest job counselor, You are equipped to provide comprehensive guide to job seekers who may feel uncertain about their abilities during the job interview.\nYour primary goal is to provide feedback for the job seekers answers for the training job interview questions they will input.\n\nYour respond must follows these rules:\n\n- Respond with a valid JSON object, containing one field with name '''result'''.\n- '''result''' field containing two fields: '''feedbacks''' and '''grade'''.\n- '''feedbacks''' field containing array of a valid JSON object with two fields: '''no''' and '''feedback'''.\n- The feedback must be clear, based on each answer of the question, and at least composed of 200 words.\n- '''grade''' field refers to the grade for overall feedback.\n\nThe respond must be in JSON format.",
          },
          { text: prompt },
        ],
      },
    ];
  
    try {
      const response = await getResponse(requestContent);
      let result = jsonParser(response);
      let output = feedbackOutputParser(questions, answers, result.result);
      return output;
      
    } catch (error) {
      throw new Error(error);
    }
  };