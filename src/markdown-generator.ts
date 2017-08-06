import * as S from "string";

export class MarkdownGenerator {
    public static header(text: string, headerLevel: number, closing: boolean = false): string {
        if (!isFinite(headerLevel)) {
            throw Error("Heading number must be finite!");
        }
        if (headerLevel < 1 || headerLevel > 6) {
            throw Error("Heading number must be more than 0 and less than 7.");
        }

        const headers = S("#").repeat(headerLevel).s;
        const sanitizedText = S(text).trim().s;

        if (closing) {
            return `${headers} ${sanitizedText} ${headers}`;
        } else {
            return `${headers} ${sanitizedText}`;
        }
    }

    public static underlineHeader(text: string, headerLevel: number): string[] {
        if (!isFinite(headerLevel)) {
            throw Error("Heading number must be finite!");
        }
        if (headerLevel < 1 || headerLevel > 2) {
            throw Error("Heading number must be more than 0 and less than 2.");
        }

        const sanitizedText = S(text).trim().s;
        const header = headerLevel === 1 ? S("=").repeat(sanitizedText.length).s : S("-").repeat(sanitizedText.length).s;

        return [
            sanitizedText,
            header
        ];
    }

    public static blockquote(text: string): string[] {
        const lines: string[] = [];

        S(text).lines().forEach(x => {
            if (x === "") {
                lines.push(">");
                return;
            }
            const sanitizedText = S(x).trim().s;
            lines.push(`> ${sanitizedText}`);
        });

        return lines;
    }
}
