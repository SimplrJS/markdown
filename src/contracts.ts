export interface EmphasisOptions {
    useUnderscores?: boolean;
}

export interface CodeOptions {
    lang?: string;
}

export interface UnorderedListOptions {
    symbol?: UnorderedListSymbols;
}

export type UnorderedListSymbols = "*" | "+" | "-";

export interface TableOptions {
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

export interface BlockquoteOptions {
    escape: boolean;
    escapeCharacter: string;
}
