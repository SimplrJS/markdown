import * as S from "string";

import {
    TableHeader,
    TableOptions,
    TableAlign
} from "../contracts";
import { Helpers } from "../utils/helpers";

export namespace TableGenerator {
    export function RenderTable(headers: Array<string | TableHeader>, content: string[][], options?: TableOptions): string[] {
        const columnsWidths: number[] = [];
        const removeColumnIfEmpty = options != null && options.removeColumnIfEmpty;

        let filledRows = content.map(row => {
            if (row.length < headers.length) {
                return Helpers.FillArray(row, headers.length, "");
            } else {
                return row;
            }
        });

        const finalHeaders = headers
            .map((header, headerIndex) => {
                const rows = filledRows.map(x => x[headerIndex]);
                columnsWidths[headerIndex] = GetMaxColumnWidth(GetHeaderText(header), rows, removeColumnIfEmpty);

                if (removeColumnIfEmpty && columnsWidths[headerIndex] === 0) {
                    filledRows = filledRows
                        .filter(x => x[headerIndex] != null)
                        .map(x => x.splice(0, headerIndex));

                    return null;
                }

                return header;
            })
            .filter(x => x != null) as Array<string | TableHeader>;

        const lines = [
            // Header
            ...RenderTableHeader(finalHeaders, columnsWidths),
            // Content
            ...RenderTableContents(filledRows, columnsWidths)
        ];

        return lines;
    }

    export function RenderTableHeader(headers: Array<string | TableHeader>, columnsWidths: number[]): string[] {
        // | Header | Header2 |
        let tableHeader = "";
        // | ------ | ------- |
        let headerSeparator = "";
        headers.forEach((header, headerIndex) => {
            const columnWidth = columnsWidths[headerIndex];
            const columnAlign = GetHeaderAlign(header);
            const isLast = (headerIndex + 1 === headers.length);
            tableHeader += RenderCell(GetHeaderText(header), columnWidth, isLast);

            let columnAlignText: string;
            switch (columnAlign) {
                case "left": {
                    // :----
                    columnAlignText = S(":").padRight(columnWidth, "-").s;
                    break;
                }
                case "right": {
                    // ----:
                    columnAlignText = S(":").padLeft(columnWidth, "-").s;
                    break;
                }
                case "center":
                    // :---:
                    columnAlignText = S(":").padRight(columnWidth, "-").s;
                    columnAlignText = columnAlignText.slice(0, -1) + ":";
                    break;
                case "none":
                default: {
                    columnAlignText = S("-").repeat(columnWidth).s;
                }
            }

            headerSeparator += RenderCell(columnAlignText, columnWidth, isLast);
        });

        return [
            tableHeader,
            headerSeparator
        ];
    }

    export function RenderTableContents(content: string[][], columnsWidths: number[]): string[] {
        return content.map<string>(row => {
            let rowText: string = "";

            row.forEach((column, columnIndex) => {
                const columnWidth = columnsWidths[columnIndex];
                const isLast = (columnIndex + 1 === row.length);

                rowText += RenderCell(column, columnWidth, isLast);
            });

            return rowText;
        });
    }

    export function RenderCell(text: string, width: number, close?: boolean): string {
        const sanitizedText = S(text).trim().s;
        let cell = `| ${S(sanitizedText).padRight(width).s} `;

        if (close) {
            cell += "|";
        }

        return cell;
    }

    export function GetHeaderText(header: string | TableHeader): string {
        let headerText: string;
        if (typeof header === "string") {
            headerText = header;
        } else {
            headerText = header.text;
        }

        return headerText;
    }

    export function GetHeaderAlign(header: string | TableHeader): TableAlign {
        if (typeof header === "string") {
            return "none";
        } else {
            return header.align;
        }
    }

    export function GetMaxColumnWidth(headerText: string, rows: string[], removeIfEmpty?: boolean): number {
        let maxWidth = 0;

        rows.forEach(x => {
            if (x != null && x.length > maxWidth) {
                maxWidth = x.length;
            }
        });

        if (maxWidth !== 0 || !removeIfEmpty) {
            if (headerText.length > maxWidth) {
                return headerText.length;
            }
        }

        return maxWidth;
    }
}
