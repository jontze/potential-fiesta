import { parse } from "yaml";

export interface QueryObject {
	filter?: {
		unread?: boolean;
		reason?: string[] | string;
		repo?: {
			name?: string[] | string;
			owner?: string[] | string;
			fullname?: string;
			fork?: boolean;
			private?: boolean;
		};
		subject?: {
			type: string[] | string;
		};
	};
}

export const parseQuery = (ast: string): QueryObject => {
	const parsedYaml: QueryObject = parse(ast);
	return parsedYaml;
};
