"use client";

import { useRecoilValue } from "recoil";
import { TranslatedText } from "../game/shared/translatedUI";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import { languageStateAtom } from "@/store/data";
import { Button } from "../ui/button";
import { Info } from "lucide-react";

export function AnswerDescription({ info }: { info: string }) {
  const language = useRecoilValue(languageStateAtom);
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button className="z-10">
          <Info color="#ee892b" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="bg-white">
        <AlertDialogHeader>
          <TranslatedText textKey="answer_info" language={language} />
        </AlertDialogHeader>
        <AlertDialogDescription>{info}</AlertDialogDescription>
        <AlertDialogFooter><AlertDialogCancel><TranslatedText textKey="close_info" language={language} /></AlertDialogCancel></AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
