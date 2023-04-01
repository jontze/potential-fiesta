import {
	App,
	Modal,
	Notice,
	Plugin,
	PluginSettingTab,
	Setting,
} from "obsidian";

// Remember to rename these classes and interfaces!

interface JontzePluginSettings {
	personsDirectory: string;
}

const DEFAULT_SETTINGS: JontzePluginSettings = {
	personsDirectory: "persons",
};

export default class JontzePlugin extends Plugin {
	settings: JontzePluginSettings;

	async onload() {
		await this.loadSettings();

		// This creates an icon in the left ribbon.
		// TODO: Define own icon
		const ribbonIconEl = this.addRibbonIcon(
			"dice",
			"Sample Plugin",
			(evt: MouseEvent) => {
				// Called when the user clicks the icon.
				new Notice("This is a notice!");
			}
		);

		this.addCommand({
			id: "jontze-add-person",
			name: "Add a new person",
			callback: () => {
				new AddPersonModal(this.app).open();
			},
		});

		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new JontzeSettingTab(this.app, this));
	}

	onunload() {}

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

class JontzeSettingTab extends PluginSettingTab {
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

class AddPersonModal extends Modal {
	constructor(app: App) {
		super(app);
	}

	onOpen() {
		// TODO: Add the form to the modal
		const { contentEl } = this;
		contentEl.setText("Woah!");
		contentEl.innerHTML = `
			<form>
				<label for="name">Name</label>
				<input type="text" id="name" name="name" />
				<label for="surname">Surname</label>
				</form>`;
	}

	onClose() {
		// TODO: Remove the form from the modal
		const { contentEl } = this;
		contentEl.empty();
	}
}
