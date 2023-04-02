import { Notice, Plugin } from "obsidian";
import { AddPersonModal, SelectPersonModal } from "./modals";
import {
	DEFAULT_SETTINGS,
	JontzePluginSettings,
	JontzeSettingTab,
} from "./Settings";

export default class JontzePlugin extends Plugin {
	settings!: JontzePluginSettings;

	async onload() {
		await this.loadSettings();

		const ribbonIconEl = this.addRibbonIcon(
			"bot",
			"Jontze Plugin",
			(evt: MouseEvent) => {
				// TODO: Do something meaningful if the user clicks the ribbon icon
				new Notice("This is a notice!");
			}
		);

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

		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new JontzeSettingTab(this.app, this));
	}

	onunload() {
		console.log("Jontze: Unloading plugin");
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
}
