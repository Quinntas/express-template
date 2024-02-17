import {expect, test} from "vitest";
import {validateUserName} from "./userName";
import {validateUserPassword} from "./userPassword";

test("ValueObject - UserPassword - Invalid password less than 6 chars", () => {
    expect(() => {
        validateUserPassword('12345')
    }).toThrowError()
})

test("ValueObject - UserPassword - Invalid name more than 20 chars", () => {
    expect(() => {
        validateUserName('123456'.repeat(10))
    }).toThrowError()
})

test("ValueObject - UserPassword - Valid password", () => {
    const result = validateUserName('123456')
    expect(result).toBeDefined()
    expect(result).toBe('123456')
})



