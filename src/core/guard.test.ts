import {expect, test} from 'vitest';
import {
    againstAtLeast,
    againstAtLeastOneElement,
    againstAtMost,
    againstBadEnumValue,
    againstBadFormat,
    againstNotArray,
    againstNotBoolean,
    againstNotNumber,
    againstNotObject,
    againstNotString,
    againstNullOrUndefined,
    againstNullOrUndefinedBulk,
} from './guard';

test('Guard - Null or Undefined - Invalid with null', () => {
    expect(() => {
        againstNullOrUndefined('key', null);
    }).toThrowError();
});

test('Guard - Null or Undefined - Invalid with undefined', () => {
    expect(() => {
        againstNullOrUndefined('key', undefined);
    }).toThrowError();
});

test('Guard - Null or Undefined - Valid', () => {
    expect(() => {
        againstNullOrUndefined('key', 1);
    });
});

// **********************

test('Guard - At most - Valid', () => {
    expect(() => {
        againstAtMost('key', 1, 2);
    });
});

test('Guard - At most - Valid equal', () => {
    expect(() => {
        againstAtMost('key', 2, 2);
    });
});

test('Guard - At most - Invalid', () => {
    expect(() => {
        againstAtMost('key', 3, 2);
    }).toThrowError();
});

// **********************

test('Guard - At least - Valid', () => {
    expect(() => {
        againstAtLeast('key', 2, 1);
    });
});

test('Guard - At least - Valid equal', () => {
    expect(() => {
        againstAtLeast('key', 1, 1);
    });
});

test('Guard - At least - Invalid', () => {
    expect(() => {
        againstAtLeast('key', 0, 1);
    }).toThrowError();
});

// **********************

test('Guard - At least one element - Valid', () => {
    expect(() => {
        againstAtLeastOneElement('key', [1]);
    });
});

test('Guard - At least one element - Invalid', () => {
    expect(() => {
        againstAtLeastOneElement('key', []);
    }).toThrowError();
});

// **********************

test('Guard - Bad format - Valid', () => {
    expect(() => {
        againstBadFormat('key', 'test@gmail.com', /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/);
    });
});

test('Guard - Bad format - Invalid', () => {
    expect(() => {
        againstBadFormat('key', 'test', /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/);
    }).toThrowError();
});

// **********************

test('Guard - Bad enum - Valid', () => {
    enum TestEnum {
        A = 'A',
        B = 'B',
    }

    expect(() => {
        againstBadEnumValue('key', TestEnum, TestEnum.A);
    });
});

test('Guard - Bad enum - Valid String', () => {
    enum TestEnum {
        A = 'A',
        B = 'B',
    }

    expect(() => {
        againstBadEnumValue('key', TestEnum, 'A');
    });
});

test('Guard - Bad enum - Valid', () => {
    enum TestEnum {
        A = 'A',
        B = 'B',
    }

    expect(() => {
        againstBadEnumValue('key', TestEnum, 'C');
    }).toThrowError();
});

// **********************

test('Guard - Not String - Valid', () => {
    expect(() => {
        againstNotString('key', '123');
    });
});

test('Guard - Not String - Invalid', () => {
    expect(() => {
        againstNotString('key', 123);
    }).toThrowError();
});

// **********************

test('Guard - Not Number - Valid', () => {
    expect(() => {
        againstNotNumber('key', 123);
    });
});

test('Guard - Not Number - Invalid', () => {
    expect(() => {
        againstNotNumber('key', '123');
    }).toThrowError();
});

// **********************

test('Guard - Not Boolean - Valid', () => {
    expect(() => {
        againstNotBoolean('key', false);
    });
});

test('Guard - Not Boolean - Invalid', () => {
    expect(() => {
        againstNotBoolean('key', 'false');
    }).toThrowError();
});

// **********************

test('Guard - Not Array - Valid', () => {
    expect(() => {
        againstNotArray('key', [1, 2, 3]);
    });
});

test('Guard - Not Array - Invalid', () => {
    expect(() => {
        againstNotArray('key', {});
    }).toThrowError();
});

// **********************

test('Guard - Not Object - Valid', () => {
    expect(() => {
        againstNotObject('key', {foo: 'bar'});
    });
});

test('Guard - Not Object - Invalid', () => {
    expect(() => {
        againstNotObject('key', 123);
    }).toThrowError();
});

test('Guard - Not Object - Invalid with array', () => {
    expect(() => {
        againstNotObject('key', []);
    }).toThrowError();
});

test('Guard - Not Object - Invalid with null value', () => {
    expect(() => {
        againstNotObject('key', null);
    }).toThrowError();
});

// **********************

test('Guard - Null or Undefined Bulk - Valid', () => {
    expect(() => {
        againstNullOrUndefinedBulk([
            ['key', 123],
            ['key', '123'],
        ]);
    });
});

test('Guard - Null or Undefined Bulk - Invalid', () => {
    expect(() => {
        againstNullOrUndefinedBulk([
            ['key', 123],
            ['key', undefined],
        ]);
    }).toThrowError();
});
