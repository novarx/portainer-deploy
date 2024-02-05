import axios, {AxiosResponse} from 'axios';
import {Observable, of, throwError} from 'rxjs';
import {fromPromise} from 'rxjs/internal/observable/innerFrom';
import {mergeMap} from 'rxjs/operators';

export interface Env {
    name: string;
    value: string;
}

interface GetBearer {
    jwt: string
}

export class PortainerService {

    private readonly BASE_PATH = '/api';
    private readonly BASE_URL: string;
    private user: { password: string; username: string };

    constructor(username: string, password: string, url: string) {
        this.user = {password, username};
        this.BASE_URL = url;
    }

    deploy(stackId: number, composeContent: string, endpointId: number, envs: Env[]): Observable<unknown> {
        return this.loadBearer().pipe(
            mergeMap(bearer => axios.put(`${this.getUrl()}/stacks/${stackId}?endpointId=${endpointId}`, {
                body: {
                    Env: envs,
                    Prune: true,
                    StackFileContent: composeContent
                },
                headers: {Authorization: bearer},
                json: true
            })),
            mergeMap(response => this.hasError(response) ? throwError(response.data) : of(response))
        );
    }

    private getUrl() {
        return this.BASE_URL + this.BASE_PATH;
    }

    private hasError(response: AxiosResponse) {
        return response.status >= 400;
    }

    private loadBearer(): Observable<null | string> {
        return fromPromise(axios.post<GetBearer>(`${this.getUrl()}/auth`, {
            body: this.user,
            json: true
        })).pipe(mergeMap((response) =>
            this.hasError(response) || !response.data.jwt ? throwError(response.data) : of('Bearer ' + response.data.jwt)
        ));
    }
}
