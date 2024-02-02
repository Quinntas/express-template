import fetch, {Response} from "node-fetch";

import FormData from "form-data";
import {Method} from "../types/methods";

export interface FetcherRetryDTO {
    retryCount: number;
    retryDelay: number;
}

export interface FetcherDTO<BodyType> {
    url: string;
    action: Method;
    retryDTO: FetcherRetryDTO;
    headers?: any;
    body?: BodyType;
}

interface InternalFetcherDTO {
    url: string;
    action: Method;
    headers?: any;
    body?: any;
}

export interface FetcherResponseDTO<ResponseType> {
    status: number;
    ok: boolean;
    response: ResponseType;
}

class Fetcher {
    private readonly defaultHeaders = {
        "Content-Type": "application/json",
        Accept: "application/json",
        "cache-control": "no-cache",
        "Access-Control-Allow-Origin": "*",
        "User-Agent": "Revpay3.0",
        "Access-Control-Allow-Headers":
            "Origin, X-Requested-With, Content-Type, Accept",
    };

    private async makeRequest(
        fetcherDTO: InternalFetcherDTO
    ): Promise<Response> {
        return await fetch(fetcherDTO.url, {
            method: fetcherDTO.action,
            headers: fetcherDTO.headers,
            body: fetcherDTO.body,
        });
    }

    public async request<BodyType, ResponseType>(
        fetcherDTO: FetcherDTO<BodyType>
    ): Promise<FetcherResponseDTO<ResponseType>> {
        let headers = Object.assign(
            {},
            this.defaultHeaders,
            fetcherDTO.headers
        );

        let body: any = undefined;
        if (fetcherDTO.body) {
            if (fetcherDTO.body instanceof FormData) {
                body = fetcherDTO.body;
                delete headers["Content-Type"];
            } else if (headers["Content-Type"] === "application/json") {
                body = JSON.stringify(fetcherDTO.body);
            } else {
                body = fetcherDTO.body;
            }
        }

        const internalFetcherDTO: InternalFetcherDTO = {
            url: fetcherDTO.url,
            action: fetcherDTO.action,
            headers,
            body,
        };

        let response: Response;

        for (let i = 0; i < fetcherDTO.retryDTO.retryCount; i++) {
            try {
                response = await this.makeRequest(internalFetcherDTO);

                if (response.ok) break;
            } catch (err) {
                console.log(`Attempt ${i + 1} failed:`, err);
            }

            if (
                i < fetcherDTO.retryDTO.retryCount - 1 &&
                fetcherDTO.retryDTO.retryDelay > 0
            ) {
                await new Promise((resolve) =>
                    setTimeout(resolve, fetcherDTO.retryDTO.retryDelay)
                );
            }
        }

        let responseBody = null;

        switch (response.headers.get("Content-Type")) {
            case "application/json; charset=utf-8":
            case "application/json;charset=UTF-8":
            case "application/json":
                responseBody = await response.json();
                break;
            case "application/ssml+xml":
                responseBody = await response.text();
                break;
            case "audio/webm; codec=opus":
            case "audio/wav":
            case "audio/x-wav":
                responseBody = await response.blob();
                break;
            default:
                responseBody = await response.text();
        }

        return {
            status: response.status,
            ok: response.ok,
            response: responseBody ? (responseBody as ResponseType) : undefined,
        };
    }
}

export const fetcher = new Fetcher();
