import { MonoTypeOperatorFunction, map, pipe, tap } from "rxjs";
import { Notifications } from "./api/github/models";
import { QueryObject } from "./parser";

export const applyQuery = (
	query: QueryObject
): MonoTypeOperatorFunction<Notifications> => {
	// TODO: Mount filters in that are requested by the query
	return pipe(
		tap((query) => {
			console.log(query);
		})
	);
};

const isUnread = (unread: boolean): MonoTypeOperatorFunction<Notifications> => {
	return map((notifications) => {
		return notifications.filter((n) => n.unread === unread);
	});
};
