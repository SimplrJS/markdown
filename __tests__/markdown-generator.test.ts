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

    fit("Multiline working example", () => {
        const text = S("Some text\n").repeat(3).s;
        const result = MarkdownGenerator.blockquote(text);
        expect(result).toBe(`> ${text}`);
    });
});
