"use client"
import { useRecoilState } from "recoil";
import { languageStateAtom } from "@/store/data";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TranslatedText } from "./translatedUI";
import { SupportedLanguages } from "@/lib/utils";
// Implied import for SupportedLanguages type

export const LanguageSelector = () => {
  const [language, setLanguage] =
    useRecoilState<SupportedLanguages>(languageStateAtom); // Specify the type here

  const handleLanguageChange = (value: any) => {
    setLanguage(value);
  };

  return (
    <Select
      onValueChange={handleLanguageChange}
      value={language as SupportedLanguages}
    >
      <SelectTrigger className="w-[180px] text-white">
        <SelectValue
          placeholder={
            <TranslatedText language={language} textKey="selectLanguage" />
          }
        />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="en" className="text-white">English</SelectItem>
        <SelectItem value="pt" className="text-white">Portugues</SelectItem>

      </SelectContent>
    </Select>
  );
};
