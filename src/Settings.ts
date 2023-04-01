import { App, PluginSettingTab, Setting } from "obsidian";
import JontzePlugin from "./main";

export interface JontzePluginSettings {
	personsDirectory: string;
}

export const DEFAULT_SETTINGS: JontzePluginSettings = {
	personsDirectory: "persons",
};

export class JontzeSettingTab extends PluginSettingTab {
	plugin: JontzePlugin;

	constructor(app: App, plugin: JontzePlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();

		containerEl.createEl("h2", {
			text: "Settings for my personal plugin.",
		});

		new Setting(containerEl)
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
}
