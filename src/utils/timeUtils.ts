export namespace TimeUtils {
    /**
     * Converts a Date object to a string in the format 'YYYY/MM/DD'.
     *
     * @param {Date} date - The Date object to be converted.
     * @return {string} The formatted string representing the date in 'YYYY/MM/DD' format.
     */
    export function dateToYYYYMMDD(date: Date = new Date()): string {
        return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
    }

    /**
     * Converts a Date object to a string in the format DD/MM/YYYY.
     *
     * @param {Date} date - The Date object to convert.
     * @return {string} The string representation of the date in the format DD/MM/YYYY.
     */
    export function dateToDDMMYYYY(date: Date = new Date()): string {
        return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
    }
}
