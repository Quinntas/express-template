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

/**
 * Retrieve a translation key from i18n object based on the provided language.
 *
 * @param {i18n} object - The i18n object containing translations in different languages.
 * @param {string} key - The translation key to be retrieved.
 * @param {i18nLanguages} lang - The language to use for retrieving the translation.
 * @param {i18nLanguages} [defaultLang=i18nLanguages.EN] - The default language to fallback to if the provided lang parameter is not valid.
 *
 * @return {string} - The translation value for the given key and language.
 *
 * @throws {InternalError} - If the provided language is not a valid enum value or if the translation for the key does not exist.
 */
export function t(object: i18n, key: string, lang: i18nLanguages, defaultLang: i18nLanguages = i18nLanguages.EN): string {
    let usingLang: i18nLanguages = defaultLang;

    if (!validateEnum(i18nLanguages, lang)) usingLang = lang;

    const objectKeys = Object.keys(object[usingLang]);

    if (objectKeys.length === 0) throw new InternalError(`i18n lang ${usingLang} does not have any translations`);

    if (!objectKeys.includes(key)) throw new InternalError('i18n key does not exist');

    return object[usingLang][key];
}
