"use client";
import Image from "next/image";
import { QuestionCard } from "./QuestionCArd";
import { useRef, useEffect } from "react";
import { selectedAnswerAtom, languageStateAtom } from "@/store/data";
import { AnswerType } from "@/lib/types";
import { useRecoilState } from "recoil";

export function GameBaseLayout() {
  const clockSoundRef = useRef<HTMLAudioElement | null>(null);

  const [language, setLanguage] = useRecoilState(languageStateAtom);

  useEffect(() => {
    const browserLang = navigator.language.split("-")[0];
    setLanguage(browserLang === "pt" ? "pt" : "en");
  }, [setLanguage]);

  return (
    <div className="flex relative items-center justify-center w-full min-h-screen bg-gradient-to-b from-purple-dark to-purple-light ">
      <audio
        ref={(audio) => {
          if (audio) {
            // @ts-ignore
            window.correctSound = audio;
          }
        }}
        src="/sounds/correct-answer.mp3"
      />
      <audio ref={clockSoundRef} src="/sounds/wrong.wav" loop />

      <QuestionCard />
    </div>
  );
}
