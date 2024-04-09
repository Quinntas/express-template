import {expect, test} from 'vitest';
import {BaseHttpService} from './baseHttpService';

class MockHttpService extends BaseHttpService {
    constructor(url: string) {
        super(url);
    }

    makeAuthHeader(): {[p: string]: string} {
        return {};
    }
}

test('BaseHttpService - createObjectToQueryString', () => {
    const url = 'http://example.com';
    const service = new MockHttpService(url);
    const data = {key1: 'value1', key2: 'value2'};
    const expectedQueryString = 'key1=value1&key2=value2';

    const result = service.createObjectToQueryString(data);

    expect(result).toEqual(expectedQueryString);
});

test('BaseHttpService - createUrlWithQueryParams', () => {
    const url = 'http://example.com';
    const service = new MockHttpService(url);
    const data = {key1: 'value1', key2: 'value2'};
    const expectedUrl = 'http://example.com?key1=value1&key2=value2';

    const result = service.createUrlWithQueryParams(url, data);

    expect(result).toEqual(expectedUrl);
});
