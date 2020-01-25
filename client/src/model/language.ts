export type ILanguageInfo = string;


export interface ILanguage {
    language: ILanguageInfo;
    name: string;
}

export const DefaultLanguageInfoValue: ILanguageInfo = "en";

export const DEFAULT_LANGUAGE = DefaultLanguageInfoValue;

export const DefaultLanguageValue = {language: DefaultLanguageInfoValue, name: "English"};

export const DefaultLanguages = [
    DefaultLanguageValue
];
