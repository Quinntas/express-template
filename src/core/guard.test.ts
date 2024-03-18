import {expect, test} from "vitest";
import {
    againstAtLeast,
    againstAtLeastOneElement,
    againstAtMost,
    againstBadEnumValue,
    againstBadFormat,
    againstNullOrUndefined
} from "./guard";

test("Guard - Null or Undefined - Valid with null", () => {
    expect(() => {
        againstNullOrUndefined("key", null)
    }).toThrowError()
})

test("Guard - Null or Undefined - Valid with undefined", () => {
    expect(() => {
        againstNullOrUndefined("key", undefined)
    }).toThrowError()
})

test("Guard - Null or Undefined - Invalid", () => {
    expect(() => {
        againstNullOrUndefined("key", 1)
    })
})

// **********************

test("Guard - At most - Valid", () => {
    expect(() => {
        againstAtMost("key", 1, 2)
    })
})

test("Guard - At most - Valid equal", () => {
    expect(() => {
        againstAtMost("key", 2, 2)
    })
})

test("Guard - At most - Invalid", () => {
    expect(() => {
        againstAtMost("key", 3, 2)
    }).toThrowError()
})

// **********************

test("Guard - At least - Valid", () => {
    expect(() => {
        againstAtLeast("key", 2, 1)
    })
})

test("Guard - At least - Valid equal", () => {
    expect(() => {
        againstAtLeast("key", 1, 1)
    })
})

test("Guard - At least - Invalid", () => {
    expect(() => {
        againstAtLeast("key", 0, 1)
    }).toThrowError()
})

// **********************

test("Guard - At least one element - Valid", () => {
    expect(() => {
        againstAtLeastOneElement("key", [1])
    })
})

test("Guard - At least one element - Invalid", () => {
    expect(() => {
        againstAtLeastOneElement("key", [])
    }).toThrowError()
})

// **********************

test("Guard - Bad format - Valid", () => {
    expect(() => {
        againstBadFormat("key", "test@gmail.com", /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/)
    })
})

test("Guard - Bad format - Invalid", () => {
    expect(() => {
        againstBadFormat("key", "test", /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/)
    }).toThrowError()
})

// **********************

test("Guard - Bad enum - Valid", () => {
    enum TestEnum {
        A = "A",
        B = "B"
    }

    expect(() => {
        againstBadEnumValue("key", TestEnum, TestEnum.A)
    })
})

test("Guard - Bad enum - Valid String", () => {
    enum TestEnum {
        A = "A",
        B = "B"
    }

    expect(() => {
        againstBadEnumValue("key", TestEnum, "A")
    })
})

test("Guard - Bad enum - Valid", () => {
    enum TestEnum {
        A = "A",
        B = "B"
    }

    expect(() => {
        againstBadEnumValue("key", TestEnum, "C")
    }).toThrowError()
})