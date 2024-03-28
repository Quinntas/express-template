export abstract class BaseHttpService {
    public url: string;

    protected constructor(url: string) {
        this.url = url;
    }

    abstract makeAuthHeader(): { [key: string]: string };
}