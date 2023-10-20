import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { Result, failure, success } from './util/result';

export class ServerResponseError extends Error {
    data: any;
    status: number;
    headers: any;

    constructor(data: any, status: number, headers: any) {
        super(`Server responded with status: ${status}`);
        this.data = data;
        this.status = status;
        this.headers = headers;
    }
}

export class NoResponseError extends Error {
    // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
    // http.ClientRequest in node.js
    request: any;

    constructor(request: any) {
        super('The request was made but no response was received');
        this.request = request;
    }
}

export class RequestSetupError extends Error {
    constructor(message: string) {
        super(message);
    }
}

class ParsingError extends Error {
    status: number;
    statusText: string;
    headers: any;

    constructor(status: number, statusText: string, headers: any) {
        super('Failed to parse response data');
        this.status = status;
        this.statusText = statusText;
        this.headers = headers;
    }
}

class UnexpectedStatusError extends Error {
    status: number;
    statusText: string;
    headers: any;

    constructor(status: number, statusText: string, headers: any) {
        super(`Received an unexpected status code: ${status} - ${statusText}`);
        this.status = status;
        this.statusText = statusText;
        this.headers = headers;
    }
}

class ResponseTypeError extends Error {
    data: any;

    constructor(data: any) {
        super("Got unexpected data type.");
        this.data = data;
    }
}

export class HomeAssistantInstance {
    private axios: AxiosInstance

    constructor(host: string, token: string) {
        this.axios = axios.create({
            baseURL: host,
            timeout: 5000,
            headers: { 'Authorization': 'Bearer ' + token }
        });
    }

    async getStates(): Promise<Result<any[], Error>> {
        const result = await this.doGet(`/api/states`);
        return HomeAssistantInstance.validateArrayResponse(result);
    }

    async getEvents(): Promise<Result<any[], Error>> {
        const result = await this.doGet(`/api/events`);
        return HomeAssistantInstance.validateArrayResponse(result);
    }

    async getServices(): Promise<Result<any[], Error>> {
        const result = await this.doGet(`/api/services`);
        return HomeAssistantInstance.validateArrayResponse(result);
    }

    async getState(entityId: string): Promise<Result<any[], Error>> {
        return await this.doGet(`/api/states/${entityId}`);
    }

    async getEntities(): Promise<Result<string[], Error>> {
        const data = {
            template: `{{ states | map(attribute='entity_id') | list }}`
        }
        const result = await this.doPost(`/api/template`, data);
        return HomeAssistantInstance.validateArrayResponse(result);
    }

    async getEntitiesByType(type: string): Promise<Result<string[], Error>> {
        const data = {
            template: `{{ states.${type} | map(attribute='entity_id') | list }}`
        }
        const result = await this.doPost(`/api/template`, data);
        return HomeAssistantInstance.validateArrayResponse(result);
    }

    private static validateArrayResponse(result: Result<any, Error>): Result<any[], Error> {
        if (result.error) {
            return result;
        }
        if (Array.isArray(result.value)) {
            // result.value is an array of type T
            return result;
        } else {
            // Handle the case where result.value is not an array of type T
            return failure(new ResponseTypeError(result.value));
        }
    }

    private static parseResponse(response: AxiosResponse): Result<any, Error> {
        // Check for unexpected 2xx status codes
        if (response.status !== 200) {
            return failure(new UnexpectedStatusError(response.status, response.statusText, response.headers));
        }
        if (response.data == null) {
            return failure(new ParsingError(response.status, response.statusText, response.headers));
        }

        let ret;
        if (typeof response.data === 'string') {
            try {
                if (ret == null) { ret = JSON.parse(response.data); };
            } catch { }
            try {
                if (ret == null) { ret = JSON.parse(response.data.replace(/^'/, '').replace(/'$/, '').replace(/'/g, '"')); }
            } catch { }
        }
        if (ret == null) {
            ret = response.data;
        }

        // console.log(ret);
        return success(ret);
    }

    private static parseAxiosError(error: any): Error {
        if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            const { data, status, headers } = error.response;
            return new ServerResponseError(data, status, headers);
        } else if (error.request) {
            // The request was made but no response was received
            // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
            // http.ClientRequest in node.js
            return new NoResponseError(error.request);
        } else {
            // Something happened in setting up the request that triggered an Error
            return new RequestSetupError(error.message);
        }
    }

    private async doGet(url: string): Promise<Result<any, Error>> {
        try {
            const response = await this.axios.get(url);
            return HomeAssistantInstance.parseResponse(response);
        } catch (error) {
            return failure(HomeAssistantInstance.parseAxiosError(error));
        }
    }

    private async doPost(url: string, data: any): Promise<Result<any, Error>> {
        try {
            const response = await this.axios.post(url, data);
            return HomeAssistantInstance.parseResponse(response);
        } catch (error) {
            console.error(error);
            return failure(HomeAssistantInstance.parseAxiosError(error));
        }
    }
}