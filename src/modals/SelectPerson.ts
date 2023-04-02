import { App, FuzzySuggestModal, getAllTags, TFile } from "obsidian";

export interface Person {
	file: TFile;
	firstname: string;
	lastname: string;
	birthdate?: string;
}

export class SelectPersonModal extends FuzzySuggestModal<Person> {
	private readonly targetDir: string;

	constructor(app: App, targetDir: string) {
		super(app);
		this.targetDir = targetDir;
	}

	getItems(): Person[] {
		return this.app.vault
			.getMarkdownFiles()
			.filter((md) => md.path.startsWith(this.targetDir))
			.map((md) => ({
				md,
				cache: this.app.metadataCache.getFileCache(md),
			}))
			.filter(({ cache }) => {
				if (cache == null) {
					return false;
				}
				return getAllTags(cache)?.contains("#person");
			})
			.map(({ md, cache }) => {
				if (cache == null) {
					throw new Error("File Cache is null");
				}
				return {
					file: md,
					firstname: cache.frontmatter?.firstname,
					lastname: cache.frontmatter?.lastname,
					birthdate: cache.frontmatter?.birthdate,
				};
			});
	}

	getItemText(item: Person): string {
		return item.firstname + " " + item.lastname;
	}

	onChooseItem(item: Person, _: MouseEvent | KeyboardEvent): void {
		this.app.workspace.openLinkText(item.file.path, "", true);
	}
}
