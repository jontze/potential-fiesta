import { MonoTypeOperatorFunction, map } from "rxjs";
import { Notifications } from "./api/github/models";
import { QueryObject } from "./parser";

export const applyQuery = (
	query: QueryObject
): MonoTypeOperatorFunction<Notifications> => {
	return map((notifications) => {
		if (query.filter == null) {
			return notifications;
		}
		let filteredNotifications = notifications;
		const { unread, reason, repo, subject } = query.filter;

		// Filter if is unread
		if (unread != null) {
			filteredNotifications = filteredNotifications.filter(
				(n) => n.unread === query.filter?.unread
			);
		}

		// Filter by reason: "subscribed", "state_change", "ci_activity", "manual"
		if (reason) {
			const reasonFilter = Array.isArray(reason) ? reason : [reason];
			filteredNotifications = filteredNotifications.filter((n) =>
				reasonFilter.includes(n.reason)
			);
		}

		if (repo != null) {
			const { name, fullname, owner, fork, private: isPrivate } = repo;
			// Filter by repo name
			if (name) {
				const nameFilter = Array.isArray(name) ? name : [name];
				filteredNotifications = filteredNotifications.filter((n) =>
					nameFilter.includes(n.repository.name)
				);
			}

			// Filter by fullname orga/repo
			if (fullname) {
				const fullNameFilter = Array.isArray(fullname)
					? fullname
					: [fullname];
				filteredNotifications = filteredNotifications.filter((n) =>
					fullNameFilter.includes(n.repository.full_name)
				);
			}

			if (owner) {
				const ownerFilter = Array.isArray(owner) ? owner : [owner];
				filteredNotifications = filteredNotifications.filter((n) =>
					ownerFilter.includes(n.repository.owner.login)
				);
			}

			// Filter if is fork
			if (fork != null) {
				filteredNotifications = filteredNotifications.filter(
					(n) => n.repository.fork === fork
				);
			}

			// Filter if is private
			if (isPrivate != null) {
				filteredNotifications = filteredNotifications.filter(
					(n) => n.repository.private === isPrivate
				);
			}
		}

		if (subject != null) {
			const { type: subType } = subject;

			if (subType) {
				const subTypeFilter = Array.isArray(subType)
					? subType
					: [subType];
				filteredNotifications = filteredNotifications.filter((n) =>
					subTypeFilter.includes(n.subject.type)
				);
			}
		}

		return filteredNotifications;
	});
};
