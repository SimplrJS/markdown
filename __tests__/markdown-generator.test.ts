import { MarkdownGenerator } from "../src/markdown-generator";
import { TableHeader } from "../src/contracts";
import * as S from "string";

const NEW_LINE = "\n";

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
        const text = "Some text \n\nOther Text";
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
     * @see https://daringfireball.net/projects/markdown/syntax#blockquote
     */
    it("contains other Markdown elements, including headers, lists, and code blocks", () => {
        let text: string = "";
        const list = [
            "One",
            "Two",
            "Three",
            [
                "Three One",
                "Three Two",
                [
                    "Three Two One"
                ]
            ]
        ];

        const headers: string[] = ["Property", "Value"];
        const rows = [
            ["Name", "string"],
            ["Age", "number"]
        ];

        text += MarkdownGenerator.table(headers, rows).join(NEW_LINE);
        text += NEW_LINE;
        text += NEW_LINE;
        text += MarkdownGenerator.orderedList(list).join(NEW_LINE);
        text += NEW_LINE;
        text += NEW_LINE;
        text += "Hello world";

        const result = MarkdownGenerator.blockquote(text);
        const expectedResult = [
            "> | Property | Value  |",
            "> | -------- | ------ |",
            "> | Name     | string |",
            "> | Age      | number |",
            ">",
            "> 1. One",
            "> 2. Two",
            "> 3. Three",
            ">     1. Three One",
            ">     2. Three Two",
            ">         1. Three Two One",
            ">",
            "> Hello world"
        ];

        expectedResult.forEach((x, index) => {
            expect(result[index]).toBe(x);
        });
    });
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
        const result = MarkdownGenerator.code(codeExample);

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
        const result = MarkdownGenerator.code(codeExample, { lang: "typescript" });

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

describe("Lists", () => {
    it("Unordered simple list", () => {
        const list = [
            "One",
            "Two",
            "Three"
        ];

        const result = MarkdownGenerator.unorderedList(list);
        const expectedResult = [
            "* One",
            "* Two",
            "* Three"
        ];

        expectedResult.forEach((x, index) => {
            expect(result[index]).toBe(x);
        });
    });

    it("Unordered deep list", () => {
        const list = [
            "One",
            "Two",
            "Three",
            [
                "Three One",
                "Three Two",
                [
                    "Three Two One"
                ]
            ]
        ];

        const result = MarkdownGenerator.unorderedList(list);
        const expectedResult = [
            "* One",
            "* Two",
            "* Three",
            "    * Three One",
            "    * Three Two",
            "        * Three Two One",
        ];

        expectedResult.forEach((x, index) => {
            expect(result[index]).toBe(x);
        });
    });

    it("Unordered simple list with a custom symbol", () => {
        const list = [
            "One",
            "Two",
            "Three"
        ];

        const result = MarkdownGenerator.unorderedList(list, {
            symbol: "-"
        });
        const expectedResult = [
            "- One",
            "- Two",
            "- Three"
        ];

        expectedResult.forEach((x, index) => {
            expect(result[index]).toBe(x);
        });
    });

    it("UnorderedList should throw when given not supported symbol", () => {
        expect(() => MarkdownGenerator.unorderedList([], {
            symbol: "a" as any
        })).toThrow();
    });

    it("Ordered simple list", () => {
        const list = [
            "One",
            "Two",
            "Three"
        ];

        const result = MarkdownGenerator.orderedList(list);
        const expectedResult = [
            "1. One",
            "2. Two",
            "3. Three"
        ];

        expectedResult.forEach((x, index) => {
            expect(result[index]).toBe(x);
        });
    });

    it("Ordered deep list", () => {
        const list = [
            "One",
            "Two",
            "Three",
            [
                "Three One",
                "Three Two",
                [
                    "Three Two One"
                ]
            ]
        ];

        const result = MarkdownGenerator.orderedList(list);
        const expectedResult = [
            "1. One",
            "2. Two",
            "3. Three",
            "    1. Three One",
            "    2. Three Two",
            "        1. Three Two One",
        ];

        expectedResult.forEach((x, index) => {
            expect(result[index]).toBe(x);
        });
    });
});

describe("Table", () => {
    it("Simple example", () => {
        const headers: string[] = ["Property", "Value"];
        const rows = [
            ["Name", "string"],
            ["Age", "number"]
        ];
        const result = MarkdownGenerator.table(headers, rows);
        const expectedResult = [
            "| Property | Value  |",
            "| -------- | ------ |",
            "| Name     | string |",
            "| Age      | number |"
        ];

        expectedResult.forEach((x, index) => {
            expect(result[index]).toBe(x);
        });
    });

    it("Removes a column if it's empty", () => {
        const headers: string[] = ["Property", "Value"];
        const rows = [
            ["Name"],
            ["Age"]
        ];
        const result = MarkdownGenerator.table(headers, rows, { removeColummIfEmpty: true });
        const expectedResult = [
            "| Property |",
            "| -------- |",
            "| Name     |",
            "| Age      |"
        ];

        expectedResult.forEach((x, index) => {
            expect(result[index]).toBe(x);
        });
    });

    // TODO: Add more tests.
});

describe("Links", () => {
    it("Simple link", () => {
        const result = MarkdownGenerator.link("Some text", "https://google.com/");
        expect(result).toBe("[Some text](https://google.com/)");
    });

    it("Simple link with a hover text", () => {
        const result = MarkdownGenerator.link("Some text", "https://google.com/", "Hover text");
        expect(result).toBe("[Some text](https://google.com/ \"Hover text\")");
    });

    it("Link to definition", () => {
        const result = MarkdownGenerator.link("Some text", "Google", true);
        expect(result).toBe("[Some text][Google]");
    });

    it("Link definition", () => {
        const result = MarkdownGenerator.linkDefinition("Some text", "https://google.com/");
        expect(result).toBe("[Some text]: https://google.com/");
    });

    it("Link definition with a hover text", () => {
        const result = MarkdownGenerator.linkDefinition("Some text", "https://google.com/", "Hover text");
        expect(result).toBe("[Some text]: https://google.com/ \"Hover text\"");
    });
});

describe("Image", () => {
    it("Simple image", () => {
        const result = MarkdownGenerator.image("Alt text", "https://path.com/image.jpg");
        expect(result).toBe("![Alt text](https://path.com/image.jpg)");
    });

    it("Simple image with a hover text", () => {
        const result = MarkdownGenerator.image("Alt text", "https://google.com/", "Hover text");
        expect(result).toBe("![Alt text](https://google.com/ \"Hover text\")");
    });
});

describe("Horizontal rule", () => {
    it("Simple horizontal rule", () => {
        const result = MarkdownGenerator.horizontalRule();
        expect(result).toBe("---");
    });

    it("Custom length", () => {
        const result = MarkdownGenerator.horizontalRule(undefined, 10);
        expect(result).toBe("----------");
    });

    it("Custom symbol", () => {
        const result = MarkdownGenerator.horizontalRule("*");
        expect(result).toBe("***");
    });

    it("Throws when length is lower than 3", () => {
        expect(() => MarkdownGenerator.horizontalRule(undefined, 0)).toThrow();
    });

    it("Throws when symbol is not in allowed list.", () => {
        expect(() => MarkdownGenerator.horizontalRule("1" as any)).toThrow();
    });
});
