import { MarkdownGenerator } from "../src/markdown-generator";
import * as S from "string";

describe("Header", () => {
    it("Throw error when number is not finite", () => {
        expect(() => MarkdownGenerator.header("Some text", "a" as any)).toThrow();
    });

    it("Throw error when number is not valid (0 < x < 7)", () => {
        expect(() => MarkdownGenerator.header("Some text", 7)).toThrow();
    });

    it("Working example", () => {
        const text = "Some text";
        const result = MarkdownGenerator.header("Some text", 1);
        expect(result).toBe(`# ${text}`);
    });

    it("Working example with closing header", () => {
        const text = "Some text";
        const result = MarkdownGenerator.header(text, 1, true);
        expect(result).toBe(`# ${text} #`);
    });
});

describe("Underline header", () => {
    it("Throw error when number is not finite", () => {
        expect(() => MarkdownGenerator.underlineHeader("Some text", "a" as any)).toThrow();
    });

    it("Throw error when number is not valid (0 < x < 3)", () => {
        expect(() => MarkdownGenerator.underlineHeader("Some text", 3)).toThrow();
    });

    it("Working example", () => {
        const text = "Some text";
        const result = MarkdownGenerator.underlineHeader(text, 1);
        expect(result[0]).toBe(text);
        expect(result[1]).toBe(S("=").repeat(text.length).s);
    });
});

describe("Blockquotes", () => {
    it("Simple working example", () => {
        const text = "Some text";
        const result = MarkdownGenerator.blockquote(text);
        expect(result[0]).toBe(`> ${text}`);
    });

    it("Multiline working example", () => {
        const text = "Some text \n\n Other Text";
        const result = MarkdownGenerator.blockquote(text);

        const expectedResult = [
            "> Some text",
            ">",
            "> Other Text"
        ];

        expectedResult.forEach((x, index) => {
            expect(result[index]).toBe(x);
        });
    });

    /**
     * TODO: "Blockquotes can contain other Markdown elements, including headers, lists, and code blocks"
     * @see https://daringfireball.net/projects/markdown/syntax#blockquote
     */
});

describe("Emphasis", () => {
    it("italic using asterisks", () => {
        const text = "Some text  ";
        const result = MarkdownGenerator.italic(text);
        expect(result).toBe("*Some text*");
    });

    it("italic using underscores", () => {
        const text = "Some text  ";
        const result = MarkdownGenerator.italic(text, { useUnderscores: true });
        expect(result).toBe("_Some text_");
    });

    it("bold using asterisks", () => {
        const text = "Some text  ";
        const result = MarkdownGenerator.bold(text);
        expect(result).toBe(`**Some text**`);
    });

    it("bold using underscores", () => {
        const text = "Some text  ";
        const result = MarkdownGenerator.bold(text, { useUnderscores: true });
        expect(result).toBe("__Some text__");
    });

    it("strikethrough", () => {
        const text = "Some text  ";
        const result = MarkdownGenerator.strikethrough(text);
        expect(result).toBe("~~Some text~~");
    });
});

describe("Code", () => {
    it("inline", () => {
        const text = "git status";
        const result = MarkdownGenerator.inlineCode(text);
        expect(result).toBe("`git status`");
    });

    it("block with array of text without language option", () => {
        const codeExample = [
            "function sum(a: number, b: number): number {",
            "   return a + b;",
            "}"
        ];
        const result = MarkdownGenerator.codeBlock(codeExample);

        const expectedResult = [
            "```",
            "function sum(a: number, b: number): number {",
            "   return a + b;",
            "}",
            "```"
        ];

        expectedResult.forEach((x, index) => {
            expect(result[index]).toBe(x);
        });
    });

    it("block with array of text with language option", () => {
        const codeExample = [
            "function sum(a: number, b: number): number {",
            "   return a + b;",
            "}"
        ];
        const result = MarkdownGenerator.codeBlock(codeExample, { lang: "typescript" });

        const expectedResult = [
            "```typescript",
            "function sum(a: number, b: number): number {",
            "   return a + b;",
            "}",
            "```"
        ];

        expectedResult.forEach((x, index) => {
            expect(result[index]).toBe(x);
        });
    });
});
