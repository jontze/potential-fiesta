import { parse } from "yaml";

export interface QueryObject {
	filter?: {
		unread?: boolean;
	};
}

export const parseQuery = (ast: string): QueryObject => {
	const parsedYaml: QueryObject = parse(ast);
	return parsedYaml;
};
