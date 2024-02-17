import {expect, test} from "vitest";
import {validateUserEmail} from "./userEmail";

test("ValueObject - UserEmail - Invalid email missing .com", () => {
    expect(() => {
        validateUserEmail('caio@gmail')
    }).toThrowError()
})

test("ValueObject - UserEmail - Invalid email missing @", () => {
    expect(() => {
        validateUserEmail('caiogmail.com')
    }).toThrowError()
})

test("ValueObject - UserEmail - Valid email", () => {
    const result = validateUserEmail('caio@gmail.com')
    expect(result).toBeDefined()
    expect(result).toBe('caio@gmail.com')
})

