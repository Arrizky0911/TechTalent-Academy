import axios from "axios";
import path from 'path';
import * as FileSystem from 'expo-file-system';

export const getResponse = async (requestContent) => {
  try {
        const response = await axios.post(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=AIzaSyC9iIPHHg-eCKL4uuEiwuBXo0c4BDIFq4w`,
          {
            contents: requestContent,
      }
    );
    console.log("Gemini API Response:", response.data);
    
    const modelResponse =
    response.data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
    
    if (modelResponse) {
      console.log(modelResponse)
      return modelResponse;
      
    }
  } catch (error) {
    console.error("Error calling Gemini Pro API:", error);
    console.error("Error response:", error.response);
    
    return error;
  } 
  
}


export const searchHobby = async (searchHobby) => {
  const requestContent = [
    {
      role: "user",
      parts: [
        { text:"You are the world's finest job counselor. As the world's finest job counselor, You are equipped to provide comprehensive recommendations to job seekers who may feel uncertain about their future career paths. Your primary goal is to provide recommendations about 1-8 jobs in digital technology for the job seekers related to the hobbie they will input. If there exist jobs related to the hobbie in the input, your respond must follows these rules: - Respond with a valid JSON object, containing one field with name 'jobs'. - 'job' field will be filled with array of JSON object containing two fields: 'name' and 'path'. - 'name' field refers to the job title and 'path' field refers to the learning path for the job. - In 'path' field, fill with the array of JSON object containing two fields: 'subject' and 'description'. - 'subject' field refers to the subject name of the learning path and 'description' field refers to the description of the subject in the learning path. - The description must be clear and at least composed of 100 words. If there is not jobs related to the hobbie in the input, your respond must follows these rules: - Respond with a valid JSON object, containing one field with name 'jobs'. - 'job' field will be filled with an empty array. The content of the respond must be in Indonesian Language or English depending on the what language is the input text. The respond must be in JSON format."},
        { text: searchHobby },
      ],
    },
  ];

  try {
    const response = await getResponse(requestContent);
  let trimmedResponse = response?.trim();
  const match = /```(json)?(.*)```/s.exec(trimmedResponse);
  if (!match) {
    let result = JSON.parse(trimmedResponse);
    console.log(result.jobs[0].name)
    console.log(JSON.stringify(result));
    return result.jobs;
    
  } else {
    let result = JSON.parse(match[2]);
    console.log(result.jobs.map(jobs => `${jobs.name} : ${JSON.stringify(jobs.path)}`).join('\n'));
    console.log(JSON.stringify(result));
    return result.jobs;
  };
  } catch (error) {
    throw new Error(error)
  }
  
}

export const getQuestions = async (job) => {
  const requestContent = [
    {
      role: "user",
      parts: [
        { text:"You are the world'\''s finest job counselor.\nAs the world'\''s finest job counselor, you are equipped to provide comprehensive guide to job seekers who may feel uncertain about their abilities.\nYour primary goal is to provide real interview questions about 6-14 for jobs in digital technology related to the job the job seekers will input.\n\nYour respond must follows these rules:\n- Respond with a valid JSON object, containing one field with name '\''questions'\''.\n- '\''questions'\'' field will be filled with array of questions with string data type\n\nThe respond must be in JSON format."},
        { text: job},
      ],
    },
  ];
  const response = await getResponse(requestContent);
  try {
    let trimmedResponse = response?.trim();
    const match = /```(json)?(.*)```/s.exec(trimmedResponse);
    if (!match) {
      let result = JSON.parse(trimmedResponse);
      console.log(JSON.stringify(result.questions))
      return result.questions;
        
    } else {
      let result = JSON.parse(match[2]);
      console.log(JSON.stringify(result))
      return result.questions;
    };
    
  } catch (error) {
    throw new Error(error);
  }
}

export const getFeedbacks = async (questions, answers) => {
  questions.length -= 1;
  answers.length -= 1;
  console.log(questions);
  console.log(typeof questions);
  let prompt = formatInterviewResult(questions, answers);
  console.log(prompt);
  const requestContent = [
    {
      role: "user",
      parts: [
        { text:"You are the world'\''s finest job counselor. \nAs the world'\''s finest job counselor, You are equipped to provide comprehensive guide to job seekers who may feel uncertain about their abilities during the job interview.\nYour primary goal is to provide feedback for the job seekers answers for the training job interview questions they will input.\n\nYour respond must follows these rules:\n\n- Respond with a valid JSON object, containing one field with name '\''result'\''.\n- '\''result'\'' field containing two fields: '\''feedbacks'\'' and '\''grade'\''.\n- '\''feedbacks'\'' field containing array of a valid JSON object with two fields: '\''no'\'' and '\''feedback'\''.\n- The feedback must be clear, based on each answer of the question, and at least composed of 200 words.\n- '\''grade'\'' field refers to the grade for overall feedback.\n\nThe respond must be in JSON format."},
        { text: prompt}
      ],
    },
  ];
  
  const response = await getResponse(requestContent);
  try {
    let trimmedResponse = response?.trim();
    const match = /```(json)?(.*)```/s.exec(trimmedResponse);
    if (!match) {
      let result = JSON.parse(trimmedResponse);
      console.log(JSON.stringify(result));
      let output = feedbackOutputParser(questions, answers, result.result);
      return output;
      
    } else {
      let result = JSON.parse(match[2]);
      console.log(JSON.stringify(result));
      let output = feedbackOutputParser(questions, answers, result.result);
      return output;
    };
    
  } catch (error) {
    throw new Error(error);
    
  }

}

export const formatInterviewResult = (questions, answers) => {
  console.log("formatting")
  const question = questions?.map((q, index) => `${index + 1}. ${q}`).join('\n');
  const answer = answers?.map((a, index) => `${index + 1}. ${a}`).join('\n');

  const prompt = `
      I have the following {position} job interview questions for training before face the real job interview.

      ${question}

      The following are my answers for the questions above.

      ${answer}

      Each question and answer are assigned by a number, which the same number indicates question-answer relation.
      There are 2 task you need to do:
      - Create a feedback for all answers with respect to the relative question-answer relation
      - Grade the overall interview based on the feedback you created with one of the these: "very good", "need an improvement", or "Terrible".
      `

  return prompt
}


export const feedbackOutputParser = (questions, answers, feedback) => {
  const result = []
  console.log(questions)
  console.log(typeof questions)
  questions.map((q, index) => {
    let item = {
      question: q,
      answer: answers[index],
      feedback: feedback?.feedbacks?.[index]?.feedback
    }
    result.push(item);
  })
  const grade = feedback?.grade;
  let icon = {};
  if (grade == "very good") {
    icon = {
      name: "checkmark-done",
      color: "green"
    }
  } else if (grade == "need an improvement") {
    icon = {
      name: "warning-outline",
      color: "yellow"
    }
  } else {
    icon = {
      name: "sad-outline",
      color: "red"
    }

  }
  let output = [{
    grade: grade,
    feedbacks: result,
    icons: icon
  }]
  return output;
}

export const getTranscript = async (audio) => {
  // let gcsUri = await uploadGCS(audio);
  const base64Audio= await FileSystem.readAsStringAsync(audio, { encoding: 'base64' });
  let audioConfig = {
    "config": {
      "enableWordTimeOffsets": true,
      "sampleRateHertz": 48000,
      "encoding": 'MP3',
      "languageCode": "en-US",

    },
    "audio": {
        "content": base64Audio
    }
  }
  try {
    const response = await axios.post('https://speech.googleapis.com/v1/speech:recognize?key=AIzaSyC9iIPHHg-eCKL4uuEiwuBXo0c4BDIFq4w', audioConfig, {
      headers: {
          'Content-Type': 'application/json',
          Authorization: "Bearer ya29.a0AcM612zQd8er7V5ljHsA045YMkUY37ud9csicVLu5sL6m4BloVD9kz9vl4eOnP92ZYDvMOAQS9DH3XfkpifZVT9b0CuI-_wQX5Hd1I2VaKzjTrnVCc_hVavwd3fJjogENyZEBrY6bHKTeCfHLcoC3-s-Mwu4Bl-gwB6VgMtaaCgYKAYYSARMSFQHGX2MiO6OQN2hu3Q7MSzfV9Utsvw0175",
          "x-goog-user-project": "aic-triumphants-001001001"
      },
    })
    console.log(response.data);
    const modelResponse =
      response.data.results?.[0]?.alternatives?.[0]?.transcript || "";

    if (modelResponse) {
      console.log(modelResponse)
      return modelResponse;
      
    }
  } catch (error) {
    console.error("Error calling Gemini Pro API:", error);
    console.error("Error response:", error.response);
    
    return error;
  } 
  
}

