import { App, PluginSettingTab, Setting } from "obsidian";
import JontzePlugin from "./main";
import { getTokenPath } from "./token";

export interface JontzePluginSettings {
	personsDirectory: string;
	secretDirectory: string;
}

export const DEFAULT_SETTINGS: JontzePluginSettings = {
	personsDirectory: "persons",
	secretDirectory: "jontze/secrets",
};

export class JontzeSettingTab extends PluginSettingTab {
	plugin: JontzePlugin;

	constructor(app: App, plugin: JontzePlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		this.containerEl.empty();

		this.heading();

		this.personDirectory();
		this.secretsDirectory();
		this.githubApiToken();
	}

	private heading(): void {
		this.containerEl.createEl("h2", {
			text: "Settings for my personal plugin.",
		});
	}

	private personDirectory(): void {
		new Setting(this.containerEl)
			.setName("Persons Directory")
			.setDesc("Path to the directory where the persons are stored.")
			.addText((text) =>
				text
					.setPlaceholder("Enter the path to the persons directory")
					.setValue(this.plugin.settings.personsDirectory)
					.onChange(async (value) => {
						this.plugin.settings.personsDirectory = value;
						await this.plugin.saveSettings();
					})
			);
	}

	private secretsDirectory(): void {
		new Setting(this.containerEl)
			.setName("Secrets Directory")
			.setDesc(
				"Path to the directory where the secrets for this plugin are stored. Ensure that this folder is excluded from any sync tools"
			)
			.addText((text) =>
				text
					.setPlaceholder("Enter the path to the secrets directory")
					.setValue(this.plugin.settings.secretDirectory)
					.onChange(async (value) => {
						this.plugin.settings.secretDirectory = value;
						await this.plugin.saveSettings();
					})
			);
	}

	private githubApiToken(): void {
		new Setting(this.containerEl)
			.setName("Github Token")
			.setDesc(
				"The Github token to use when fetching notifications. You'll need to restart obisidan after setting this."
			)
			.addTextArea(async (text) => {
				try {
					console.log(
						getTokenPath(this.plugin.settings.secretDirectory)
					);
					text.setValue(
						await this.app.vault.adapter.read(
							getTokenPath(this.plugin.settings.secretDirectory)
						)
					);
				} catch (e) {
					/* Throw away read error if file does not exist. */
				}

				text.onChange(async (value) => {
					await this.app.vault.adapter.write(
						getTokenPath(this.plugin.settings.secretDirectory),
						value
					);
				});
			});
	}
}
