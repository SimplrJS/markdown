import * as S from "string";

import { ListGenerator, MarkdownList } from "./generators/list-generator";

export interface EmphasisOptions {
    useUnderscores?: boolean;
    //escape: boolean;
}

export interface CodeBlockOptions {
    lang?: string;
}

export interface UnorderedListOptions {
    symbol?: UnorderListSymbols;
}

export type UnorderListSymbols = "*" | "+" | "-";

export class MarkdownGenerator {
    public static header(text: string, headerLevel: number, closing: boolean = false): string {
        if (!isFinite(headerLevel)) {
            throw Error("Heading number must be finite!");
        }
        if (headerLevel < 1 || headerLevel > 6) {
            throw Error("Heading number must be more than 0 and less than 7.");
        }

        const headers = S("#").repeat(headerLevel).s;
        const sanitizedText = S(text).trim().s;

        if (closing) {
            return `${headers} ${sanitizedText} ${headers}`;
        } else {
            return `${headers} ${sanitizedText}`;
        }
    }

    public static underlineHeader(text: string, headerLevel: number): string[] {
        if (!isFinite(headerLevel)) {
            throw Error("Heading number must be finite!");
        }
        if (headerLevel < 1 || headerLevel > 2) {
            throw Error("Heading number must be more than 0 and less than 2.");
        }

        const sanitizedText = S(text).trim().s;
        const header = headerLevel === 1 ? S("=").repeat(sanitizedText.length).s : S("-").repeat(sanitizedText.length).s;

        return [
            sanitizedText,
            header
        ];
    }

    public static blockquote(text: string): string[] {
        const lines: string[] = [];

        S(text).lines().forEach(x => {
            if (x === "") {
                lines.push(">");
                return;
            }
            const sanitizedText = S(x).trim().s;
            lines.push(`> ${sanitizedText}`);
        });

        return lines;
    }

    public static unorderedList(list: MarkdownList, options?: UnorderedListOptions): string[] {
        const allowedSymbols: UnorderListSymbols[] = [
            "*",
            "+",
            "-"
        ];
        let symbol = "*";

        if (options != null && options.symbol != null) {
            if (allowedSymbols.indexOf(options.symbol) === -1) {
                throw Error(`Unordered list: Symbol ${options.symbol} is not allowed. Please use: ${allowedSymbols.join(", ")} instead.`);
            }

            symbol = options.symbol;
        }

        return ListGenerator.renderList(list, 0, false, symbol);
    }

    public static orderedList(list: MarkdownList): string[] {
        return ListGenerator.renderList(list, 0, true);
    }

    public static italic(text: string, options?: EmphasisOptions): string {
        const sanitizedText = S(text).trim().s;

        if (options != null && options.useUnderscores) {
            return `_${sanitizedText}_`;
        }

        return `*${sanitizedText}*`;
    }

    public static bold(text: string, options?: EmphasisOptions): string {
        const sanitizedText = S(text).trim().s;

        if (options != null && options.useUnderscores) {
            return `__${sanitizedText}__`;
        }

        return `**${sanitizedText}**`;
    }

    public static strikethrough(text: string): string {
        const sanitizedText = S(text).trim().s;

        return `~~${sanitizedText}~~`;
    }

    /**
     * Github flavored markdown
     * @see https://help.github.com/articles/basic-writing-and-formatting-syntax/#quoting-code
     */
    public static inlineCode(text: string): string {
        const sanitizedText = S(text).trim().s;

        return `\`${sanitizedText}\``;
    }

    /**
     * Github flavored markdown
     * @see https://help.github.com/articles/basic-writing-and-formatting-syntax/#quoting-code
     */
    public static codeBlock(text: string | string[], options?: CodeBlockOptions): string[] {
        let sanitizedText: string[] = [];

        if (typeof text === "string") {
            sanitizedText = S(text).trim().lines();
        } else {
            sanitizedText = text;
        }

        const codeBlockTag = "```";
        let header = codeBlockTag;

        if (options != null && options.lang != null) {
            header += options.lang;
        }

        return [
            header,
            ...sanitizedText,
            codeBlockTag
        ];
    }
}
