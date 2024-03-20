import {expect, test} from "vitest";
import {dateToDDMMYYYY, dateToYYYYMMDD} from "./timeHandler";

test("Time handler - Date to dd mm yyyy - Valid", () => {
    expect(dateToDDMMYYYY(new Date())).toEqual(expect.any(String))
})

test("Time handler - Date to yyyy mm dd - Valid", () => {
    expect(dateToYYYYMMDD(new Date())).toEqual(expect.any(String))
})
