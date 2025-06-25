import { Button } from "@/components/ui/button";
import { SupportedLanguages, translations, Translations } from "@/lib/utils";

// Define a type for translations

export const TranslatedText = ({
  textKey,
  language,
}: {
  textKey: keyof Translations[SupportedLanguages]; // Use the defined type here
  language: SupportedLanguages;
}) => {
  return translations[language][textKey] || textKey;
};

// TranslatedButton component
export const TranslatedButton = ({
  textKey,
  language,
  ...props
}: {
  textKey: keyof Translations[SupportedLanguages]; // Use the defined type here
  language: SupportedLanguages;
}) => {
  return (
    <Button {...props}>{translations[language][textKey] || textKey}</Button>
  );
};
