import { Notice, Plugin } from "obsidian";
import { Observable, Subscription } from "rxjs";
import {
	DEFAULT_SETTINGS,
	JontzePluginSettings,
	JontzeSettingTab,
} from "./Settings";
import { GithubApi } from "./api";
import { Notifications } from "./api/github/models";
import { AddPersonModal, SelectPersonModal } from "./modals";
import { getTokenPath } from "./token";

export default class JontzePlugin extends Plugin {
	private githubApi!: GithubApi;
	private notifications$!: Observable<Notifications>;
	private readonly sub = new Subscription();

	settings!: JontzePluginSettings;

	async onload() {
		await this.loadSettings();
		this.githubApi = new GithubApi(
			getTokenPath(this.settings.secretDirectory)
		);
		this.notifications$ = this.githubApi.watchNotifications(
			this.settings.githubNotificationRefreshRate,
			true
		);

		const ribbonIconEl = this.addRibbonIcon(
			"bot",
			"Jontze Plugin",
			(evt: MouseEvent) => {
				// TODO: Do something meaningful if the user clicks the ribbon icon
				new Notice("This is a notice!");
			}
		);

		this.registerCommands();

		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new JontzeSettingTab(this.app, this));

		this.registerMarkdownCodeBlockProcessor(
			"github-notifications",
			(src, el, ctx) => {
				this.sub.add(
					this.notifications$.subscribe((notifications) => {
						notifications.forEach((notify) => {
							el.appendChild(createSpan({ text: notify.reason }));
						});
					})
				);
			}
		);
	}

	onunload() {
		console.log("Jontze: Unloading plugin");
		this.sub.unsubscribe();
	}

	async loadSettings() {
		this.settings = Object.assign(
			{},
			DEFAULT_SETTINGS,
			await this.loadData()
		);
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}

	private registerCommands(): void {
		this.addCommand({
			id: "jontze-add-person",
			name: "Add a new person",
			callback: () => {
				new AddPersonModal(
					this.app,
					this.settings.personsDirectory
				).open();
			},
		});

		this.addCommand({
			id: "jontze-select-person",
			name: "Select a person",
			callback: () => {
				new SelectPersonModal(
					this.app,
					this.settings.personsDirectory
				).open();
			},
		});
	}
}
