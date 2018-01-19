import * as S from "string";

import {
    CodeOptions,
    EmphasisOptions,
    TableHeader,
    TableOptions,
    UnorderedListOptions,
    UnorderedListSymbols,
    MarkdownList,
    HorizontalRuleSymbol,
    BlockquoteOptions,
    InlineCodeOptions
} from "./contracts";

import { ListGenerator } from "./generators/list-generator";
import { TableGenerator } from "./generators/table-generator";

export namespace MarkdownGenerator {
    export function Header(text: string, headerLevel: number, closing: boolean = false): string {
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

    export function UnderlineHeader(text: string, headerLevel: number): string[] {
        if (!isFinite(headerLevel)) {
            throw Error("Heading number must be finite!");
        }
        if (headerLevel < 1 || headerLevel > 2) {
            throw Error("Heading number must be more than 0 and less than 2.");
        }

        const sanitizedText = S(text).trim().s;
        let header: string;
        if (headerLevel === 1) {
            header = S("=").repeat(sanitizedText.length).s;
        } else {
            header = S("-").repeat(sanitizedText.length).s;
        }

        return [
            sanitizedText,
            header
        ];
    }

    export function Blockquote(text: string | string[], options?: Partial<BlockquoteOptions>): string[] {
        let textLines: string[] = [];
        const resolvedOptions: BlockquoteOptions = {
            ...options
        };

        if (typeof text === "string") {
            textLines = S(text).trim().lines();
        } else {
            textLines = text;
        }

        // Escape string
        if (resolvedOptions.escapeGreaterThanChar != null) {
            textLines = textLines.map(x => x.replace(/\>/g, resolvedOptions.escapeGreaterThanChar!));
        }

        const lines: string[] = [];

        textLines.forEach(x => {
            if (x === "") {
                lines.push(">");
                return;
            }
            /**
             * Trimming only right.
             * Because other markdown elements could have on the left side of the text spacing,
             * for example: Lists.
             */
            const sanitizedText = S(x).trimRight().s;
            lines.push(`> ${sanitizedText}`);
        });

        return lines;
    }

    export function Link(text: string, definitionName: string, definition: boolean): string;
    export function Link(text: string, url: string, linkTitle?: string): string;
    export function Link(text: string, target: string, arg?: string | boolean): string {
        const sanitizedText = S(text).trim().s;

        // Link to a link definition
        if (typeof arg === "boolean") {
            return `[${sanitizedText}][${target}]`;
        }

        // Normal link
        let targetText = target;

        if (arg != null) {
            targetText += ` "${arg}"`;
        }

        return `[${sanitizedText}](${targetText})`;
    }

    export function LinkDefinition(text: string, url: string, linkTitle?: string): string {
        const sanitizedText = S(text).trim().s;
        let linkTitleText = "";

        if (linkTitle != null) {
            linkTitleText = `"${linkTitle}"`;
        }

        return S(`[${sanitizedText}]: ${url} ${linkTitleText}`).trim().s;
    }

    export function Image(altText: string, url: string, title?: string): string {
        return "!" + Link(altText, url, title);
    }

    export function UnorderedList(list: MarkdownList, options?: UnorderedListOptions): string[] {
        const allowedSymbols: UnorderedListSymbols[] = [
            "*",
            "+",
            "-"
        ];
        let symbol: UnorderedListSymbols = "*";

        if (options != null && options.symbol != null) {
            if (allowedSymbols.indexOf(options.symbol) === -1) {
                throw Error(`Unordered list: Symbol ${options.symbol} is not allowed. Please use: ${allowedSymbols.join(", ")} instead.`);
            }

            symbol = options.symbol;
        }

        return ListGenerator.RenderList(list, 0, false, symbol);
    }

    export function OrderedList(list: MarkdownList): string[] {
        return ListGenerator.RenderList(list, 0, true);
    }

    export function HorizontalRule(symbol?: HorizontalRuleSymbol, length?: number): string {
        const allowedSymbols: HorizontalRuleSymbol[] = [
            "*",
            "-",
            "_"
        ];
        const defaultSymbol: HorizontalRuleSymbol = "-";
        const defaultLength = 3;

        if (symbol != null && allowedSymbols.indexOf(symbol) === -1) {
            throw Error(`Horizontal Rule: Symbol ${symbol} is not allowed. Please use: ${allowedSymbols.join(", ")} instead.`);
        }

        if (length != null && length < 3) {
            throw Error(`Horizontal Rule: Minimum length is ${defaultLength}`);
        }

        const currentSymbol = symbol || defaultSymbol;
        const currentLength = length || defaultLength;

        return S(currentSymbol).pad(currentLength, currentSymbol).s;
    }

    export function Italic(text: string, options?: EmphasisOptions): string {
        const sanitizedText = S(text).trim().s;

        if (options != null && options.useUnderscores) {
            return `_${sanitizedText}_`;
        }

        return `*${sanitizedText}*`;
    }

    export function Bold(text: string, options?: EmphasisOptions): string {
        const sanitizedText = S(text).trim().s;

        if (options != null && options.useUnderscores) {
            return `__${sanitizedText}__`;
        }

        return `**${sanitizedText}**`;
    }

    export function StrikeThrough(text: string): string {
        const sanitizedText = S(text).trim().s;

        return `~~${sanitizedText}~~`;
    }

    /**
     * Github flavored markdown
     * @see https://help.github.com/articles/basic-writing-and-formatting-syntax/#quoting-code
     */
    export function InlineCode(text: string, options?: Partial<InlineCodeOptions>): string {
        const resolvedOptions: InlineCodeOptions = {
            escapeBacktickChar: "\\`",
            ...options
        };
        let sanitizedText = S(text).trim().s;

        // Escape
        if (resolvedOptions.escapeBacktickChar != null) {
            sanitizedText = sanitizedText.replace(/\`/g, resolvedOptions.escapeBacktickChar);
        }

        return `\`${sanitizedText}\``;
    }

    /**
     * Github flavored markdown
     * @see https://help.github.com/articles/basic-writing-and-formatting-syntax/#quoting-code
     */
    export function Code(text: string | string[], options?: Partial<CodeOptions>): string[] {
        let sanitizedText: string[] = [];
        const resolvedOptions: CodeOptions = {
            escapeBacktickChar: "\\`",
            ...options
        };

        if (typeof text === "string") {
            sanitizedText = S(text).trim().lines();
        } else {
            sanitizedText = text;
        }

        // Escape
        if (resolvedOptions.escapeBacktickChar != null) {
            sanitizedText = sanitizedText.map(x => x.replace(/\`/g, resolvedOptions.escapeBacktickChar!));
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

    export function Table(headers: Array<string | TableHeader>, content: string[][], options?: Partial<TableOptions>): string[] {
        return TableGenerator.RenderTable(headers, content, options);
    }

    /**
     * Escapes string.
     * @see https://daringfireball.net/projects/markdown/syntax#backslash
     */
    export function EscapeString(text: string): string {
        return text
            .replace(/[\\\`\*\_\{\}\[\]\(\)\#\+\-\.\!]/g, "\\$&")
            .replace(/\|/, "&#124;")
            .replace(/\</, "&#60;")
            .replace(/\>/, "&#62;");
    }
}
