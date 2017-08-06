import * as S from "string";

import {
    TableHeader,
    TableOptions,
    TableAlign
} from "../contracts";

// TODO: Make real column content alignments.
export class TableGenerator {
    public static renderTable(headers: Array<string | TableHeader>, content: string[][], options?: TableOptions): string[] {
        let lines: string[] = [];
        const columnsWidths: number[] = [];
        const removeColumnIfEmpty = options != null && options.removeColummIfEmpty;

        // Calculate maxWidths of columns
        headers.forEach((header, headerIndex) => {
            const rows = content.map<string>(x => {
                // Fill missing columns.
                if (x.length < headers.length) {
                    this.fillArray(x, headers.length);
                }

                return x[headerIndex];
            });
            columnsWidths[headerIndex] = this.getMaxColumnWidth(this.getHeaderText(header), rows, removeColumnIfEmpty);

            if (removeColumnIfEmpty && columnsWidths[headerIndex] === 0) {
                // Remove columns if they are empty
                headers.splice(headerIndex, 1);

                content.forEach(row => {
                    if (row[headerIndex] != null) {
                        row.splice(headerIndex, 1);
                    }
                });
            }
        });

        // Header
        lines = lines.concat(this.renderTableHeader(headers, columnsWidths));
        // Contents
        lines = lines.concat(this.renderTableContents(content, columnsWidths));

        return lines;
    }

    protected static renderTableHeader(headers: Array<string | TableHeader>, columnsWidths: number[]): string[] {
        // | Header | Header2 |
        let tableHeader = "";
        // | ------ | ------- |
        let headerSeparator = "";
        headers.forEach((header, headerIndex) => {
            const columnWidth = columnsWidths[headerIndex];
            const columnAlign = this.getHeaderAlign(header);
            const isLast = (headerIndex + 1 === headers.length);
            tableHeader += this.renderCell(this.getHeaderText(header), columnWidth, isLast);

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
                // TODO: Implement center.
                // :---:
                case "center":
                case "none":
                default: {
                    columnAlignText = S("-").repeat(columnWidth).s;
                }
            }

            headerSeparator += this.renderCell(columnAlignText, columnWidth, isLast);
        });

        return [
            tableHeader,
            headerSeparator
        ];
    }

    protected static renderTableContents(content: string[][], columnsWidths: number[]): string[] {
        return content.map<string>(row => {
            let rowText: string = "";

            row.forEach((column, columnIndex) => {
                const columnWidth = columnsWidths[columnIndex];
                const isLast = (columnIndex + 1 === row.length);

                rowText += this.renderCell(column, columnWidth, isLast);
            });

            return rowText;
        });
    }

    protected static renderCell(text: string, width: number, close?: boolean): string {
        const sanitizedText = S(text).trim().s;
        let cell = `| ${S(sanitizedText).padRight(width).s} `;

        if (close) {
            cell += "|";
        }

        return cell;
    }

    protected static getHeaderText(header: string | TableHeader): string {
        let headerText: string;
        if (typeof header === "string") {
            headerText = header;
        } else {
            headerText = header.text;
        }

        return headerText;
    }

    protected static getHeaderAlign(header: string | TableHeader): TableAlign {
        if (typeof header === "string") {
            return "none";
        } else {
            return header.align;
        }
    }

    protected static getMaxColumnWidth(headerText: string, rows: string[], removeIfEmpty?: boolean): number {
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

    protected static fillArray(arr: string[], length: number): void {
        const count = length - arr.length;
        if (count > 0) {
            for (let i = 0; i < count; i++) {
                arr.push("");
            }
        }
    }
}
