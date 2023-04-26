import { MarkdownRenderChild } from "obsidian";
import { Notifications } from "src/api/github/models";

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
			element.appendChild(
				createEl("a", { href: notify.url, text: notify.subject.title })
			);
			list.appendChild(element);
		});

		container.appendChild(list);
		this.containerEl.replaceWith(container);
	}
}
