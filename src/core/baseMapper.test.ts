import {expect, test} from "vitest";
import {BaseMapper} from "./baseMapper";
import {BaseDomain} from "./baseDomain";

interface MockDomain extends BaseDomain {

}

class MockMapper extends BaseMapper<MockDomain> {
    toDomain(raw: any): Required<MockDomain> {
        if (!raw) throw new Error("Invalid input");
        if (raw.id === undefined) throw new Error("Invalid input")
        return raw as Required<MockDomain>;
    }

    toPublicDomain(data: MockDomain): Partial<MockDomain> {
        return data;
    }
}

test("BaseMapper - To Domain list - Valid", () => {
    const mapper = new MockMapper()
    expect(mapper.toDomainList([{
        id: 1
    }])).toEqual([{id: 1}])
})

test("BaseMapper - To Public Domain list - Valid", () => {
    const mapper = new MockMapper()
    expect(mapper.toPublicDomainList([{
        id: 1
    }])).toEqual([{id: 1}])
})