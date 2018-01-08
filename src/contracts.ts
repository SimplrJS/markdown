/**
 * Base options for escape.
 */
export interface EscapeOptions {
    escape: boolean;
    escapeCharacter: string;
}

export interface EmphasisOptions {
    useUnderscores?: boolean;
}

export interface CodeOptions extends EscapeOptions {
    lang?: string;
}

export type InlineCodeOptions = EscapeOptions;

export interface UnorderedListOptions {
    symbol?: UnorderedListSymbols;
}

export type UnorderedListSymbols = "*" | "+" | "-";

export interface TableOptions extends EscapeOptions {
    removeColumnIfEmpty?: boolean;
    removeRowIfEmpty?: boolean;
}

export interface TableHeader {
    text: string;
    align: TableAlign;
}

export type TableAlign = "left" | "center" | "right" | "none";

export interface MarkdownList extends Array<string | MarkdownList> { }

export type HorizontalRuleSymbol = "-" | "*" | "_";

export type BlockquoteOptions = EscapeOptions;
