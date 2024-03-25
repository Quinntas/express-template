import {expect, test} from 'vitest';
import {dateToDDMMYYYY, dateToYYYYMMDD} from './timeHandler';

test('Time handler - Date to dd mm yyyy - Valid', () => {
    const d = new Date()
    const day = d.getDate();
    const month = d.getMonth() + 1;
    const year = d.getFullYear();
    expect(dateToDDMMYYYY(d)).toEqual(`${day}/${month}/${year}`);
});

test('Time handler - Date to yyyy mm dd - Valid', () => {
    const d = new Date()
    const day = d.getDate();
    const month = d.getMonth() + 1;
    const year = d.getFullYear();
    expect(dateToYYYYMMDD(d)).toEqual(`${year}/${month}/${day}`);
});
