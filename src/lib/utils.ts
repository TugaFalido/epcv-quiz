import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const storageEffect =
  (key: string) =>
  ({ setSelf, onSet }: any) => {
    // Read the initial value from localStorage
    const storedValue =
      typeof window !== "undefined" ? window.localStorage.getItem(key) : null;
    if (storedValue !== null) {
      setSelf(JSON.parse(storedValue));
    } else {
      setSelf(null);
    }

    // Subscribe to changes and update localStorage
    onSet((newValue: any) => {
      if (typeof window !== "undefined")
        window.localStorage.setItem(key, JSON.stringify(newValue));
    });
  };

// Define a type for supported languages
export type SupportedLanguages = "en" | "pt";

export type Translations = {
  [key: string]: {
    selectLanguage: string;
    submit: string;
    cancel: string;
    welcomeLabel: string;
    nameLabel: string;
    emailLabel: string;
    next: string;
    start: string;
    scene: string;
    finish: string;
    complete: string;
    outof: string;
    score: string;
    playagain: string;
    nextblock: string;
    previousblock: string;
    undo: string;
    dndtitle: string;
    testsubmit: string;
    correctAnswers: string;
    answers: string;
    yourAnswer: string;
    answer_info: string;
    close_info: string;
  };
};

export const translations: Translations = {
  en: {
    selectLanguage: "Select Language",
    submit: "Submit",
    cancel: "Cancel",
    welcomeLabel: "Welcome",
    nameLabel: "Name",
    emailLabel: "Email",
    next: "Next",
    scene: "Scene",
    finish: "Finish exercise",
    complete: "Exercise Completed",
    outof: "out of",
    score: "Your score was",
    playagain: "Play again",
    nextblock: "Next Block",
    previousblock: "Previous Block",
    start: "Start",
    undo: "Undo",
    dndtitle: "Complete the sentence",
    testsubmit: "Test Submit",
    correctAnswers: "Correct Answers",
    answers: "Answers",
    yourAnswer: "Your answer",
    answer_info: "Adictional information",
    close_info: "Close"
  },
  pt: {
    selectLanguage: "Selecionar Idioma",
    submit: "Enviar",
    cancel: "Cancelar",
    welcomeLabel: "Bem-vindo",
    nameLabel: "Nome",
    emailLabel: "Email",
    next: "Próximo",
    scene: "Cenário",
    finish: "Terminar exercício",
    complete: "Exercício completado",
    outof: "de",
    score: "Sua pontuação foi ",
    playagain: "Jogar novamente",
    nextblock: "Bloco seguinte",
    previousblock: "Bloco anterior",
    start: "Começar",
    undo: "Desfazer",
    dndtitle: "Complete a frase",
    testsubmit: "Teste submissao",
    correctAnswers: "Respostas corretas",
    answers: "Respostas",
    yourAnswer: "Sua resposta",
    answer_info: "Informação adicional",
    close_info: "Fechar"
  },
};
