import {expect, test} from "vitest";
import {userMapper} from "./userMapper";

test("UserMapper - To Domain - Valid", () => {
    expect(userMapper.toDomain({
        id: 1,
        pid: "123",
        name: "name",
        email: "email",
        password: "password",
        createdAt: new Date(),
        updatedAt: new Date()
    })).toEqual({
        id: 1,
        pid: "123",
        name: "name",
        email: "email",
        password: "password",
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date)
    })
})

test("UserMapper - To Domain - Invalid", () => {
    expect(() => {
        userMapper.toDomain({})
    }).toThrowError()
})

test("UserMapper - To Public Domain - Valid", () => {
    expect(userMapper.toPublicDomain({
        id: 1,
        pid: "123",
        name: "name",
        email: "email",
        password: "password",
        createdAt: new Date(),
        updatedAt: new Date()
    })).toEqual({
        pid: "123",
        name: "name",
        email: "email",
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date)
    })
})
