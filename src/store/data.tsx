import { QuizType, QuestionType, AnswerType, LTIData } from "@/lib/types";
import { storageEffect, SupportedLanguages } from "@/lib/utils";
import { atom } from "recoil";

export const qaAtom = atom<any>({
  key: "qa",
  default: [
    {
      id: "qa",
      text: "any",
      points: "any",
      module_id: "any",
    },
  ],
  effects: [storageEffect("qas")],
});

export const answerAtom = atom<any>({
  key: "answer",
  default: {
    text: "any",
    isCorrect: "any",
    question_id: "any",
  },
});

export const ltiDataState = atom<LTIData | null>({
  key: "ltiDataState",
  default: null,
  // effects: [storageEffect("ltiData")]
});

export const gameOverAtom = atom({
  key: "gameOverAtom",
  default: false,
});

export const hasScoredNowAtom = atom({
  key: "hasScoredAtom",
  default: false,
});
export const hasAnsweredAtom = atom({
  key: "hasAnsweredAtom",
  default: false,
});

export const languageStateAtom = atom<SupportedLanguages>({
  key: "languageStateAtom",
  default: "en",
});

export const selectedAnswerAtom = atom<any>({
  key: "selectedAnswerAtom",
  default: null,
});

export const scoreStateAtom = atom<any>({
  key: "scoreStateAtom",
  default: 0,
});

export const currentQuestionIndexAtom = atom<any>({
  key: "currentQuestionIndexAtom",
  default: 0,
});

export const quizAtom = atom<QuizType[] | null>({
  key: "quiz",
  default: [
    {
      id: 1,
      name: "Introduction to React",
      description: "Basic concepts of React",
      time_limit: 30,
      approval_percentage: 70,
      module_reference: "MOD001",
      position: 1,
      //   questions: [],
      image: "",
    },
    {
      id: 2,
      name: "Advanced JavaScript",
      description: "Deep dive into JS",
      time_limit: 45,
      approval_percentage: 75,
      module_reference: "MOD002",
      position: 2,
      //   questions: [],
      image: "",
    },
  ],
  effects: [storageEffect("quizzes")],
});

export const EditingQuizAtom = atom<QuizType | null>({
  key: "editingQuiz",
  default: null,
});

export const EditingQuestionAtom = atom<QuestionType | null>({
  key: "editingQuestion",
  default: null,
});
export const SelectedCorrectAnswerAtom = atom<any>({
  key: "selectedCorrectedAnswerAtom",
  default: null,
});
