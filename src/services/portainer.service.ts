import axios, {AxiosRequestConfig} from 'axios';

export interface Env {
    name: string;
    value: string;
}

interface GetBearer {
    jwt: string;
}

export interface PortainerUser {
    password: string;
    username: string;
}

export class PortainerService {
    private _token: null | string = null;
    private readonly BASE_PATH = '/api';

    get token(): null | string {
        return this._token;
    }

    async deploy(url: string, stackId: number, composeContent: string, endpointId: number, envs: Env[]): Promise<any> {
        return axios.put(
            `${this.getUrl(url)}/stacks/${stackId}?endpointId=${endpointId}`,
            {
                env: envs,
                prune: true,
                stackFileContent: composeContent
            },
            this.getAuthorizationHeaders()
        );
    }

    public async login(url: string, user: PortainerUser): Promise<boolean> {
        return axios.post<GetBearer>(`${this.getUrl(url)}/auth`, user).then(response => {
            this._token = response?.data?.jwt;
            return response?.data?.jwt != null;
        });
    }

    private getAuthorizationHeaders(): Partial<AxiosRequestConfig> {
        return {headers: {Authorization: `Bearer ${this._token}`}};
    }

    private getUrl(url: string) {
        return url + this.BASE_PATH;
    }
}
