export interface EmphasisOptions {
    useUnderscores?: boolean;
}

export interface CodeOptions {
    lang?: string;
}

export interface UnorderedListOptions {
    symbol?: UnorderListSymbols;
}

export type UnorderListSymbols = "*" | "+" | "-";

export interface TableOptions {
    removeColummIfEmpty?: boolean;
}

export interface TableHeader {
    text: string;
    align: TableAlign;
}

export type TableAlign = "left" | "center" | "right" | "none";

// tslint:disable-next-line:no-empty-interface
export interface MarkdownList extends Array<string | MarkdownList> { }

export type HorizontalRuleSymbol = "-" | "*" | "_";
