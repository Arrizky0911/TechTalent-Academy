export const formatInterviewResult = (questions, answers, job) => {
  questions.length = questions?.length - 1;
  answers.length = answers?.length - 1;
  console.log(questions);
  const question = questions
    ?.map((q, index) => `${index + 1}. ${q}`)
    .join("\n");
  const answer = answers?.map((a, index) => `${index + 1}. ${a}`).join("\n");

  const prompt = `
        I have the following ${job} job interview questions for training before face the real job interview.
  
        ${question}
  
        The following are my answers for the questions above.
  
        ${answer}
  
        Each question and answer are assigned by a number, which the same number indicates question-answer relation.
        There are 2 task you need to do:
        - Create a feedback for all answers with respect to the relative question-answer relation
        - Grade the overall interview based on the feedback you created with one of the these: "Very good", "Need an improvement", or "Terrible".
        `;

  return prompt;
};

export const feedbackOutputParser = (questions, answers, feedback) => {
  const result = [];
  console.log(questions);
  console.log(typeof questions);
  questions.map((q, index) => {
    let item = {
      question: q,
      answer: answers[index],
      feedback: feedback?.feedbacks?.[index]?.feedback,
    };
    result.push(item);
  });
  const grade = feedback?.grade;
  let icon = {};
  if (grade == "very good") {
    icon = {
      name: "checkmark-done",
      color: "green",
    };
  } else if (grade == "need an improvement") {
    icon = {
      name: "warning-outline",
      color: "yellow",
    };
  } else {
    icon = {
      name: "sad-outline",
      color: "red",
    };
  }
  let output = [
    {
      grade: grade,
      feedbacks: result,
      icons: icon,
    },
  ];
  return output;
};

// implemented from langchain jsonOutputParser
export const jsonParser = (input) => {
  let trimmedResponse = input?.trim();
  const match = /```(json)?(.*)```/s.exec(trimmedResponse);
  if (!match) {
    let output = JSON.parse(trimmedResponse);
    return output;
  } else {
    let output = JSON.parse(match[2]);
    return output;
  }
};
