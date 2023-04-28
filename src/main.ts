import { Notice, Plugin } from "obsidian";
import { Observable, Subscription } from "rxjs";
import {
	DEFAULT_SETTINGS,
	JontzePluginSettings,
	JontzeSettingTab,
} from "./Settings";
import { GithubApi } from "./api";
import { Notifications } from "./api/github/models";
import { applyQuery } from "./filter";
import { AddPersonModal, SelectPersonModal } from "./modals";
import { parseQuery } from "./parser";
import { getTokenPath } from "./token";
import { NotificationList } from "./view";

export default class JontzePlugin extends Plugin {
	private githubApi!: GithubApi;
	private notifications$?: Observable<Notifications>;
	private readonly sub = new Subscription();

	settings!: JontzePluginSettings;

	async onload() {
		await this.loadSettings();
		const tokenPath = getTokenPath(this.settings.secretDirectory);
		try {
			const token = await this.app.vault.adapter.read(tokenPath);
			this.githubApi = new GithubApi(token);
			this.notifications$ = this.githubApi.watchNotifications(
				this.settings.githubNotificationRefreshRate
			);
		} catch (err) {
			console.error(err);
			const _ = new Notice(
				"No github token provided! Please add a token and restart obsidian.",
				6000
			);
		}

		const ribbonIconEl = this.addRibbonIcon(
			"bot",
			"Jontze Plugin",
			(evt: MouseEvent) => {
				// TODO: Do something meaningful if the user clicks the ribbon icon
				const _ = new Notice("This is a notice!");
			}
		);

		this.registerCommands();

		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new JontzeSettingTab(this.app, this));

		this.registerMarkdownCodeBlockProcessor(
			"github-notifications",
			(src, el, ctx) => {
				const query = parseQuery(src.trim());
				this.sub.add(
					this.notifications$
						?.pipe(applyQuery(query))
						.subscribe((notifications) => {
							console.log(notifications);
							ctx.addChild(
								new NotificationList(el, notifications)
							);
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
