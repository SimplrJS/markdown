import * as S from "string";

import { MarkdownList } from "../contracts";

export class ListGenerator {
    public static renderList(list: MarkdownList, level: number, ordered: boolean, symbol?: string): string[] {
        let renderedList: string[] = [];

        list.forEach((x, index) => {
            // Handle if it's a string
            if (typeof x === "string") {
                // Order can be "*" or "1."
                let listSymbol: string;
                if (!ordered && symbol != null) {
                    listSymbol = symbol;
                } else {
                    listSymbol = `${index + 1}.`;
                }

                renderedList.push(this.getListItem(x, level, listSymbol));
            } else {
                // Handles if it's an array
                const result = this.renderList(x, ++level, ordered, symbol);
                renderedList = renderedList.concat(result);
            }
        });

        return renderedList;
    }

    protected static getListItem(text: string, level: number, symbol: string): string {
        const space = S(" ").repeat(level * 4).s;
        const sanitizedText = S(text).trim();

        return `${space}${symbol} ${sanitizedText}`;
    }
}
