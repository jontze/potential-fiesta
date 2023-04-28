import { MarkdownRenderChild, setIcon } from "obsidian";
import { Notifications, Thread } from "src/api/github/models";

export class NotificationList extends MarkdownRenderChild {
	private notifications: Notifications;

	constructor(containerEl: HTMLElement, notifications: Notifications) {
		super(containerEl);
		this.notifications = notifications;
	}

	onload(): void {
		const container = createDiv({ cls: "notification__container" });
		const list = createEl("ul", { cls: "notification__list" });
		this.notifications.forEach((notify) => {
			const element = createEl("li", {
				cls: "notification__entry",
			});
			const notifyIconBox = createDiv();
			setIcon(notifyIconBox, "bell-ring");
			const nameLink = createEl("a", {
				href: parseNotificationEventUrl(notify),
				text: " " + notify.subject.title,
			});
			const fullRepoName = createEl("a", {
				text: "" + notify.repository.full_name,
				href: `https://github.com/${notify.repository.full_name}`,
			});
			const reason = createSpan({ text: notify.reason });
			const githubIconBox = createDiv();
			setIcon(githubIconBox, "github");
			const orientationIconBox = createDiv();
			setIcon(orientationIconBox, "compass");

			element.appendChild(notifyIconBox).appendChild(nameLink);
			element.appendChild(githubIconBox).appendChild(fullRepoName);
			element.appendChild(orientationIconBox).appendChild(reason);

			list.appendChild(element);
		});

		container.appendChild(list);
		this.containerEl.replaceWith(container);
	}
}

const parseNotificationEventUrl = (notify: Thread): string => {
	const baseUrl = "https://github.com/" + notify.repository.full_name + "/";
	switch (notify.subject.type) {
		case "PullRequest":
			const prNumber = notify.subject.url.split("/").pop()?.trim();
			return baseUrl + "pull/" + prNumber;
		case "Issue":
			const issueNumber = notify.subject.url.split("/").pop()?.trim();
			return baseUrl + "issues/" + issueNumber;
		case "CheckSuite":
			return baseUrl + "actions";
		default:
			console.error(notify);
			throw new Error("Unable to create link. Unknown event.");
	}
};
