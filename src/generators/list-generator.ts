import * as S from "string";

import { MarkdownList } from "../contracts";

export namespace ListGenerator {
    export function RenderList(list: MarkdownList, level: number, ordered: boolean, symbol?: string): string[] {
        let renderedList: string[] = [];

        list.forEach((x, index) => {
            // Handle if it's a string
            if (typeof x === "string") {
                // listSymbol can be "*" or "1."
                let listSymbol: string;
                if (!ordered && symbol != null) {
                    listSymbol = symbol;
                } else {
                    listSymbol = `${index + 1}.`;
                }

                renderedList.push(GetListItem(x, level, listSymbol));
            } else {
                // Handles if it's an array
                const result = RenderList(x, ++level, ordered, symbol);
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
