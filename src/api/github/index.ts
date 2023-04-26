import { debug, error } from "console";
import { RequestUrlResponse, requestUrl, type RequestUrlParam } from "obsidian";
import {
	Observable,
	from,
	interval,
	map,
	of,
	shareReplay,
	startWith,
	switchMap,
	tap,
} from "rxjs";
import { Notifications } from "./models";

export class GithubApi {
	constructor(private readonly token: string) {}

	private request(params: {
		method: "GET" | "POST";
		uri: string;
		jsonBody?: any;
	}): Observable<RequestUrlResponse> {
		const requestParams: RequestUrlParam = {
			url: "https://api.github.com" + params.uri,
			method: params.method,
			headers: {
				Authorization: `Bearer ${this.token}`,
				"X-GitHub-Api-Version": "2022-11-28",
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
		return from(requestUrl(requestParams)).pipe(
			tap((res) => {
				if (res.status >= 400) {
					error(
						`[Github Api]: ${requestParams.method} ${requestParams.url} returned error '[${res.status}]': ${res.text}`
					);
				}
			})
		);
	}

	fetchNotifications(isMock = false): Observable<Notifications> {
		if (isMock) {
			return of([{ reason: "Hello" }] as Notifications);
		}
		return this.request({
			method: "GET",
			uri: "/notifications?all=true",
		}).pipe(map((res) => res.json));
	}

	watchNotifications(
		refreshRate: number,
		isMock = false
	): Observable<Notifications> {
		return interval(refreshRate).pipe(
			startWith(0),
			switchMap(() => this.fetchNotifications(isMock)),
			shareReplay(1)
		);
	}
}
