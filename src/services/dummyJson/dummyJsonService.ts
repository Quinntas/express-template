import {BaseHttpService} from '../../core/baseHttpService';
import {request} from '../../utils/fetcher';
import {CreateTodoDTO} from './dto/createTodoDTO';
import {GetTodoResponseDTO} from './dto/getTodoDTO';

export class DummyJsonService extends BaseHttpService {
    constructor() {
        super('https://dummyjson.com');
    }

    makeAuthHeader(): {[p: string]: string} {
        return {};
    }

    getTodo(id: number) {
        return request<null, GetTodoResponseDTO>({
            url: this.createUrlWithQueryParams(`${this.url}/todos/${id}`, {
                id: id.toString(),
            }),
            method: 'get',
        });
    }

    createTodo(dto: CreateTodoDTO) {
        return request<CreateTodoDTO, null>({
            url: `${this.url}/todos`,
            method: 'post',
            body: dto,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }
}

export const dummyJsonService = new DummyJsonService();
