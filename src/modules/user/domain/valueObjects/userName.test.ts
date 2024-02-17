import {expect, test} from "vitest";
import {validateUserName} from "./userName";

test("ValueObject - UserName - Invalid name less than 3 chars", () => {
    expect(() => {
        validateUserName('ca')
    }).toThrowError()
})

test("ValueObject - UserName - Invalid name more than 50 chars", () => {
    expect(() => {
        validateUserName('caio'.repeat(15))
    }).toThrowError()
})

test("ValueObject - UserName - Valid name", () => {
    const name = 'caio quintas'
    const result = validateUserName(name)
    expect(result).toBeDefined()
    expect(result).toBe(name.toUpperCase())
})



