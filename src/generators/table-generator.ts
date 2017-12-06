import * as S from "string";

import {
    TableHeader,
    TableOptions,
    TableAlign
} from "../contracts";

export namespace TableGenerator {
    export function RenderTable(headers: Array<string | TableHeader>, content: string[][], options?: TableOptions): string[] {
        let lines: string[] = [];
        const columnsWidths: number[] = [];
        const removeColumnIfEmpty = options != null && options.removeColumnIfEmpty;

        // Calculate maxWidths of columns
        headers.forEach((header, headerIndex) => {
            const rows = content.map<string>(x => {
                // Fill missing columns.
                if (x.length < headers.length) {
                    x = FillArray(x, headers.length);
                }

                return x[headerIndex];
            });
            columnsWidths[headerIndex] = GetMaxColumnWidth(GetHeaderText(header), rows, removeColumnIfEmpty);

            if (removeColumnIfEmpty && columnsWidths[headerIndex] === 0) {
                // Remove columns if they are empty
                headers.splice(headerIndex, 1);

                content
                    .filter(x => x[headerIndex] != null)
                    .forEach(x => x.splice(headerIndex, 1));
            }
        });

        // Header
        lines = lines.concat(RenderTableHeader(headers, columnsWidths));
        // Contents
        lines = lines.concat(RenderTableContents(content, columnsWidths));

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

    export function FillArray(arr: string[], length: number): string[] {
        const result = [...arr];

        const count = length - arr.length;
        if (count > 0) {
            for (let i = 0; i < count; i++) {
                result.push("");
            }

            return result;
        } else {
            return arr;
        }
    }
}
