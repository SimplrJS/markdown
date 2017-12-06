import { MarkdownGenerator } from "./markdown-generator";

function Main(): void {
    const headers: string[] = ["Property", "Value"];
    const rows = [
        ["Name"],
        ["Age"]
    ];

    const result = MarkdownGenerator.Table(headers, rows, { removeColumnIfEmpty: true });
    // tslint:disable-next-line:no-debugger
    debugger;
}

Main();
