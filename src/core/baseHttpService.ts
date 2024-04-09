export abstract class BaseHttpService {
    public url: string;

    protected constructor(url: string) {
        this.url = url;
    }

    abstract makeAuthHeader(): {[key: string]: string};

    public createObjectToQueryString<T extends Record<string, string>>(data: T): string {
        const searchParams = new URLSearchParams(data);
        return searchParams.toString();
    }

    public createUrlWithQueryParams<T extends Record<string, string>>(url: string, data: T): string {
        const queryString = this.createObjectToQueryString(data);
        return `${url}?${queryString}`;
    }
}
