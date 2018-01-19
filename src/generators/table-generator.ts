import * as S from "string";

import {
    TableHeader,
    TableOptions,
    TableAlign
} from "../contracts";
import { Helpers } from "../utils/helpers";

export namespace TableGenerator {
    export function RenderTable(headers: Array<string | TableHeader>, content: string[][], options?: Partial<TableOptions>): string[] {
        const resolvedOptions: TableOptions = {
            escapePipeChar: "&#124;",
            ...options
        };
        const patternToEscape = /\|/g;

        // Escape
        if (resolvedOptions.escapePipeChar != null) {
            const escapePipeChar = resolvedOptions.escapePipeChar;

            // Headers
            headers = headers.map(header => {
                if (typeof header === "string") {
                    return header.replace(patternToEscape, escapePipeChar);
                } else {
                    return {
                        ...header,
                        text: header.text.replace(patternToEscape, escapePipeChar)
                    };
                }
            });

            // Content
            content = content.map(x => x.map(y => y.replace(patternToEscape, resolvedOptions.escapePipeChar!)));
        }

        const columnsWidths: number[] = [];
        const removeColumnIfEmpty = options != null && options.removeColumnIfEmpty;
        const removeRowIfEmpty = options != null && options.removeRowIfEmpty;

        let filledRows = content.map(row => {
            if (row.length < headers.length) {
                return Helpers.FillArray(row, headers.length, "");
            } else {
                return row;
            }
        });

        // Removing empty rows if option `removeRowIfEmpty` enabled.
        if (removeRowIfEmpty) {
            filledRows = filledRows.filter(row => !row.every(cell => cell.length === 0));
        }

        // Indexes of empty columns, that should be removed.
        const columnsToRemove: number[] = [];

        // Filling columns widths.
        headers.forEach((header, index) => {
            // Getting rows of a single column
            const rows = filledRows.map(x => x[index]);
            columnsWidths[index] = GetMaxColumnWidth(GetHeaderText(header), rows, removeColumnIfEmpty);

            if (removeColumnIfEmpty && columnsWidths[index] === 0) {
                columnsToRemove.push(index);
            }
        });

        // Removing unnecessary columns.
        const finalHeaders = headers.filter((x, index) => columnsToRemove.indexOf(index) === -1);
        const finalRows = filledRows.map(row => row.filter((x, index) => columnsToRemove.indexOf(index) === -1));
        const finalColumnsWidths = columnsWidths.filter((x, index) => columnsToRemove.indexOf(index) === -1);

        const lines = [
            // Header
            ...RenderTableHeader(finalHeaders, finalColumnsWidths),
            // Content
            ...RenderTableContents(finalRows, finalColumnsWidths)
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
