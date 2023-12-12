import axios from "axios";

export default class Vault {
    private readonly host: string;
    private readonly engineName: string;

    constructor(host: string, engineName: string) {
        this.host = host;
        this.engineName = engineName;
    }

    private async getAuth(roleId: string, secretId: string) {
        return axios.post(`${this.host}/v1/auth/approle/login`, {
            role_id: roleId,
            secret_id: secretId,
        });
    }

    private async getSecret(authToken: string, secretPath: string) {
        return axios.get(`${this.host}/v1/${this.engineName}/${secretPath}`, {
            headers: {
                "X-Vault-Token": authToken,
            },
        });
    }

    async getData(roleId: string, secretId: string, secretPath: string) {
        const authRes = await this.getAuth(roleId, secretId);
        const authToken = authRes.data?.auth?.client_token;
        if (!authToken) throw new Error("인증 토큰이 존재하지 않음");

        const dataRes = await this.getSecret(authToken, secretPath);
        const data = dataRes.data?.data;
        if (!data) throw new Error("데이터가 존재하지 않음");

        return data;
    }
}
