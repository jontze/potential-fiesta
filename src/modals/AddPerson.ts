import { render } from "eta";
import { App, Modal, Notice, Setting } from "obsidian";
import { PERSON_TEMPLATE } from "./templates";

export class AddPersonModal extends Modal {
	private firstname?: string;
	private lastname?: string;
	private birthdate?: string;

	private readonly targetDir: string;

	constructor(app: App, targetDir: string) {
		super(app);
		this.targetDir = targetDir;
	}

	onOpen() {
		const { contentEl } = this;
		contentEl.createEl("h1", { text: "Add a new person" });
		new Setting(contentEl)
			.setName("First name")
			.setDesc("The first name of the person")
			.addText((text) =>
				text
					.setPlaceholder("Enter the first name")
					.onChange((value) => (this.firstname = value))
			);

		new Setting(contentEl)
			.setName("Last name")
			.setDesc("The last name of the person")
			.addText((text) =>
				text
					.setPlaceholder("Enter the last name")
					.onChange((value) => (this.lastname = value))
			);

		new Setting(contentEl)
			.setName("Birthdate")
			.setDesc("The birthdate of the person")
			.addMomentFormat((date) =>
				date
					.setDefaultFormat("YYYY-MM-DD")
					.onChange((value) => (this.birthdate = value))
			);

		new Setting(contentEl).addButton((button) =>
			button
				.setButtonText("Save")
				.setCta()
				.onClick(async () => {
					if (!this.firstname || !this.lastname) {
						new Notice(
							"First name and last name are required.",
							5000
						);
					} else {
						await this.onSubmit(
							this.firstname,
							this.lastname,
							this.birthdate
						);
					}
				})
		);
	}

	onClose() {
		const { contentEl } = this;
		contentEl.empty();
	}

	private async onSubmit(
		firstname: string,
		lastname: string,
		birthdate?: string
	): Promise<void> {
		try {
			const fileContent = render(PERSON_TEMPLATE, {});
			const personFile = await this.app.vault.create(
				`${this.targetDir}/${firstname} ${lastname}.md`,
				fileContent
			);
			await this.app.fileManager.processFrontMatter(
				personFile,
				(frontmatter) => {
					frontmatter.nodeType = "person";
					frontmatter.firstname = firstname;
					frontmatter.lastname = lastname;
					frontmatter.birthdate = birthdate;
					frontmatter.excludeFields = ["nodeType", "excludeFields"];
				}
			);
			this.close();
			await this.app.workspace.openLinkText(personFile.path, "", true);
			new Notice(`Added ${firstname} ${lastname}`, 5000);
		} catch (err) {
			new Notice(
				"Couldn't create person. Does the person already exist?",
				5000
			);
			console.error(err);
		}
	}
}
