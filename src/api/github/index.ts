import { debug, error } from "console";
import { RequestUrlResponse, requestUrl, type RequestUrlParam } from "obsidian";

export interface GithubRequestParams {
	method: "GET" | "POST";
	path: string;
	jsonBody?: any;
}

export class GithubApi {
	constructor(private readonly token: string) {}

	private async request(
		params: GithubRequestParams
	): Promise<RequestUrlResponse> {
		const requestParams: RequestUrlParam = {
			url: "https://api.github.com",
			method: params.method,
			headers: {
				Authorization: `Bearer ${this.token}`,
			},
		};

		if (params.jsonBody) {
			requestParams.body = JSON.stringify(params.jsonBody);
			requestParams.headers = {
				...requestParams.headers,
				...{
					"Content-Type": "application/json",
				},
			};
		}

		debug(`[Github Api]: ${requestParams.method} ${requestParams.url}`);

		let res = await requestUrl(requestParams);

		if (res.status >= 400) {
			error(
				`[Github Api]: ${requestParams.method} ${requestParams.url} returned error '[${res.status}]': ${res.text}`
			);
		}

		return res;
	}

	async fetchNotifications(): Promise<any[]> {
		const res = await this.request({
			method: "GET",
			path: "/notifications",
		});
		return res.json as [];
	}
}
