import * as S from "string";

import { MarkdownList } from "../contracts";

export namespace ListGenerator {
    export function RenderList(list: MarkdownList, level: number, ordered: boolean, symbol?: string): string[] {
        let renderedList: string[] = [];

        let itemNumber = 1;
        list.forEach(item => {

            // Handle if it's a string
            if (typeof item === "string") {
                // listSymbol can be "*" or "1."
                let listSymbol: string;
                if (!ordered && symbol != null) {
                    listSymbol = symbol;
                } else {
                    listSymbol = `${itemNumber}.`;
                }

                renderedList.push(GetListItem(item, level, listSymbol));
                itemNumber++;
            } else {
                // Handles if it's an array
                // Array item is consider as sublist.
                const result = RenderList(item, ++level, ordered, symbol);
                --level;
                renderedList = renderedList.concat(result);
            }
        });

        return renderedList;
    }

    export function GetListItem(text: string, level: number, symbol: string): string {
        const space = S(" ").repeat(level * 4).s;
        const sanitizedText = S(text).trim();

        return `${space}${symbol} ${sanitizedText}`;
    }
}
