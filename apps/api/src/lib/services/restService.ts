type AuthHeader = Record<string, string>;

/**
 * BaseHttpService is an abstract class that provides common functionality for making HTTP requests.
 */
export abstract class RestService {
    public url: string;

    protected constructor(url: string) {
        this.url = url;
    }

    /**
     * Creates an authorization header for the request.
     *
     * @returns An object representing the authorization header.
     */
    abstract authHeader(): Promise<AuthHeader> | AuthHeader;

    /**
     * Converts an object to a query string.
     * @param data - The object to convert.
     * @returns The query string representation of the object.
     */
    public objectToQueryString<T extends Record<string, string>>(data: T): string {
        const searchParams = new URLSearchParams(data);
        return searchParams.toString();
    }

    /**
     * Create a URL with query parameters.
     *
     * @param {string} url - The base URL.
     * @param {Record<string, string>} data - The object containing query parameters.
     * @returns {string} The final URL with query parameters.
     */
    public urlWithQueryParams<T extends Record<string, string>>(url: string, data: T): string {
        const queryString = this.objectToQueryString(data);
        return `${url}?${queryString}`;
    }
}
