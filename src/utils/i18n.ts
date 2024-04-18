import {InternalError} from '../core/errors';
import {validateEnum} from './validations';

export enum i18nLanguages {
    'EN' = 'EN',
}

export type i18n = {
    [key in i18nLanguages]: {
        [key: string]: string;
    };
};

export function t(object: i18n, key: string, lang: i18nLanguages, defaultLang: i18nLanguages = i18nLanguages.EN): string {
    let usingLang: i18nLanguages = defaultLang;

    if (!validateEnum(i18nLanguages, lang)) usingLang = lang;

    const objectKeys = Object.keys(object[usingLang]);

    if (objectKeys.length === 0) throw new InternalError(`i18n lang ${usingLang} does not have any translations`);

    if (!objectKeys.includes(key)) throw new InternalError('i18n key does not exist');

    return object[usingLang][key];
}
