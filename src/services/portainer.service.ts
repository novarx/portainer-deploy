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
    private readonly BASE_URL: string;

    constructor(url: string) {
        this.BASE_URL = url;
    }

    get token(): null | string {
        return this._token;
    }

    async deploy(stackId: number, composeContent: string, endpointId: number, envs: Env[]): Promise<any> {
        return axios.put(
            `${this.getUrl()}/stacks/${stackId}?endpointId=${endpointId}`,
            {
                env: envs,
                prune: true,
                stackFileContent: composeContent
            },
            this.getAuthorizationHeaders()
        );
    }

    public async login(user: PortainerUser): Promise<boolean> {
        return axios.post<GetBearer>(`${this.getUrl()}/auth`, user).then(response => {
            this._token = response?.data?.jwt;
            return response?.data?.jwt != null;
        });
    }

    private getAuthorizationHeaders(): Partial<AxiosRequestConfig> {
        return {headers: {Authorization: `Bearer ${this._token}`}};
    }

    private getUrl() {
        return this.BASE_URL + this.BASE_PATH;
    }
}
