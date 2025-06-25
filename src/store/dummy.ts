import { AnswerType, QuestionType } from "@/lib/types";

export const questionsWithAnswers: (QuestionType & { answers: AnswerType[] })[] = [
    {
      id: "ques1",
      text: "What is the capital of France?",
      points: "10", // If points should be numeric, change this to a number
      module_id: "mod1",
      type: "multiple_choice", // This question is multiple choice
      answers: [
        {
          id: "ans1",
          text: "Paris",
          isCorrect: 1, // This is the correct answer
          question_id: "ques1",
          correct_order: 1,
          pair: null,
        },
        {
          id: "ans2",
          text: "Berlin",
          isCorrect: 0,
          question_id: "ques1",
          correct_order: 2,
          pair: null,
        },
        {
          id: "ans3",
          text: "Madrid",
          isCorrect: 0,
          question_id: "ques1",
          correct_order: 3,
          pair: null,
        }
      ]
    },
    {
      id: "ques2",
      text: "Which planet is known as the Red Planet?",
      points: "15",
      module_id: "mod2",
      type: "multiple_choice",
      answers: [
        {
          id: "ans4",
          text: "Earth",
          isCorrect: 0,
          question_id: "ques2",
          correct_order: 1,
          pair: null,
        },
        {
          id: "ans5",
          text: "Mars",
          isCorrect: 1, // Correct answer
          question_id: "ques2",
          correct_order: 2,
          pair: null,
        },
        {
          id: "ans6",
          text: "Venus",
          isCorrect: 0,
          question_id: "ques2",
          correct_order: 3,
          pair: null,
        }
      ]
    },
    {
      id: "ques3",
      text: "What is the largest ocean on Earth?",
      points: "20",
      module_id: "mod3",
      type: "multiple_choice",
      answers: [
        {
          id: "ans7",
          text: "Atlantic Ocean",
          isCorrect: 0,
          question_id: "ques3",
          correct_order: 1,
          pair: null,
        },
        {
          id: "ans8",
          text: "Indian Ocean",
          isCorrect: 0,
          question_id: "ques3",
          correct_order: 2,
          pair: null,
        },
        {
          id: "ans9",
          text: "Pacific Ocean",
          isCorrect: 1, // Correct answer
          question_id: "ques3",
          correct_order: 3,
          pair: null,
        }
      ]
    }
  ];