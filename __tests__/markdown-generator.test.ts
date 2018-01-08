import { MarkdownGenerator } from "../src/markdown-generator";
import { TableHeader } from "../src/contracts";
import * as S from "string";

const NEW_LINE = "\n";

describe("Header", () => {
    it("Throw error when number is not finite", () => {
        expect(() => MarkdownGenerator.Header("Some text", "a" as any)).toThrow();
    });

    it("Throw error when number is not valid (0 < x < 7)", () => {
        expect(() => MarkdownGenerator.Header("Some text", 7)).toThrow();
    });

    it("Working example", () => {
        const text = "Some text";
        const result = MarkdownGenerator.Header("Some text", 1);
        expect(result).toMatchSnapshot();
    });

    it("Working example with closing header", () => {
        const text = "Some text";
        const result = MarkdownGenerator.Header(text, 1, true);
        expect(result).toMatchSnapshot();
    });
});

describe("Underline header", () => {
    it("Throw error when number is not finite", () => {
        expect(() => MarkdownGenerator.UnderlineHeader("Some text", "a" as any)).toThrow();
    });

    it("Throw error when number is not valid (0 < x < 3)", () => {
        expect(() => MarkdownGenerator.UnderlineHeader("Some text", 3)).toThrow();
    });

    it("Working example", () => {
        const text = "Some text";
        const result = MarkdownGenerator.UnderlineHeader(text, 1);
        expect(result).toMatchSnapshot();
    });

    it("Working example 2", () => {
        const text = "Some text";
        const result = MarkdownGenerator.UnderlineHeader(text, 2);
        expect(result).toMatchSnapshot();
    });
});

describe("BlockQuotes", () => {
    it("Simple working example", () => {
        const text = "Some text";
        const result = MarkdownGenerator.Blockquote(text);
        expect(result).toMatchSnapshot();
    });

    it("Simple working example with escaping", () => {
        const text = ">Some text";
        const result = MarkdownGenerator.Blockquote(text, { escapeGreaterThanChar: "\\>" });
        expect(result).toMatchSnapshot();
    });

    it("Multiline working example", () => {
        const text = "Some text \n\nOther Text";
        const result = MarkdownGenerator.Blockquote(text);

        expect(result).toMatchSnapshot();
    });

    it("Multiline string array working example", () => {
        const text = [
            "Some text",
            "Other text"
        ];
        const result = MarkdownGenerator.Blockquote(text);

        expect(result).toMatchSnapshot();
    });

    /**
     * @see https://daringfireball.net/projects/markdown/syntax#blockquote
     */
    it("Contains other Markdown elements, including headers, lists, and code blocks", () => {
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

        text += MarkdownGenerator.Table(headers, rows).join(NEW_LINE);
        text += NEW_LINE;
        text += NEW_LINE;
        text += MarkdownGenerator.OrderedList(list).join(NEW_LINE);
        text += NEW_LINE;
        text += NEW_LINE;
        text += "Hello world";

        const result = MarkdownGenerator.Blockquote(text);
        expect(result).toMatchSnapshot();
    });
});

describe("Emphasis", () => {
    it("italic using asterisks", () => {
        const text = "Some text  ";
        const result = MarkdownGenerator.Italic(text);
        expect(result).toMatchSnapshot();
    });

    it("italic using underscores", () => {
        const text = "Some text  ";
        const result = MarkdownGenerator.Italic(text, { useUnderscores: true });
        expect(result).toMatchSnapshot();
    });

    it("bold using asterisks", () => {
        const text = "Some text  ";
        const result = MarkdownGenerator.Bold(text);
        expect(result).toMatchSnapshot();
    });

    it("bold using underscores", () => {
        const text = "Some text  ";
        const result = MarkdownGenerator.Bold(text, { useUnderscores: true });
        expect(result).toMatchSnapshot();
    });

    it("StrikeThrough", () => {
        const text = "Some text  ";
        const result = MarkdownGenerator.StrikeThrough(text);
        expect(result).toMatchSnapshot();
    });
});

describe("Code", () => {
    it("inline", () => {
        const text = "git status";
        const result = MarkdownGenerator.InlineCode(text);
        expect(result).toMatchSnapshot();
    });

    it("inline with escape", () => {
        const text = "git ` status";
        const result = MarkdownGenerator.InlineCode(text);
        expect(result).toMatchSnapshot();
    });

    it("inline without escape", () => {
        const text = "git `hello` status";
        const result = MarkdownGenerator.InlineCode(text, { escapeBacktickChar: undefined });
        expect(result).toMatchSnapshot();
    });

    it("block with array of text without language option", () => {
        const codeExample = [
            "function sum(a: number, b: number): number {",
            "   return a + b;",
            "}"
        ];
        const result = MarkdownGenerator.Code(codeExample);
        expect(result).toMatchSnapshot();
    });

    it("block with array of text without language option with escape", () => {
        const codeExample = [
            "function sum(a: number, b: number): number {",
            "```",
            "   return a + b;",
            "```",
            "}"
        ];
        const result = MarkdownGenerator.Code(codeExample);
        expect(result).toMatchSnapshot();
    });

    it("block with array of text without language option without escape", () => {
        const codeExample = [
            "function sum(a: number, b: number): number {",
            "```",
            "   return a + b;",
            "```",
            "}"
        ];
        const result = MarkdownGenerator.Code(codeExample, { escapeBacktickChar: undefined });
        expect(result).toMatchSnapshot();
    });

    it("block with text without language option", () => {
        const codeExample = "function sum(a: number, b: number): number {\n   return a + b;\n}";
        const result = MarkdownGenerator.Code(codeExample);
        expect(result).toMatchSnapshot();
    });

    it("block with array of text with language option", () => {
        const codeExample = [
            "function sum(a: number, b: number): number {",
            "   return a + b;",
            "}"
        ];
        const result = MarkdownGenerator.Code(codeExample, { lang: "typescript" });
        expect(result).toMatchSnapshot();
    });
});

describe("Lists", () => {
    it("Unordered simple list", () => {
        const list = [
            "One",
            "Two",
            "Three"
        ];

        const result = MarkdownGenerator.UnorderedList(list);
        expect(result).toMatchSnapshot();
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

        const result = MarkdownGenerator.UnorderedList(list);
        expect(result).toMatchSnapshot();
    });

    it("Unordered multi level list", () => {
        const list = [
            "Level 1",
            "Level 1",
            [
                "Level 2",
                "Level 2",
                [
                    "Level 3",
                    "Level 3",
                    [
                        "Level 4"
                    ],
                    "Level 3",
                    "Level 3"
                ],
                "Level 2",
                "Level 2"
            ],
            "Level 1",
            "Level 1"
        ];

        const result = MarkdownGenerator.UnorderedList(list);
        expect(result).toMatchSnapshot();
    });

    it("Unordered multi level list with empty levels", () => {
        const list = [
            "Level 1",
            "Level 1",
            [],
            [],
            [
                "Level 2",
                [],
                "Level 2",
                [
                    "Level 3",
                    [],
                    "Level 3",
                    [
                        "Level 4"
                    ],
                    "Level 3",
                    [],
                    "Level 3"
                ],
                "Level 2",
                [],
                "Level 2"
            ],
            "Level 1",
            [],
            "Level 1"
        ];

        const result = MarkdownGenerator.UnorderedList(list);
        expect(result).toMatchSnapshot();
    });

    it("Unordered simple list with a custom symbol", () => {
        const list = [
            "One",
            "Two",
            "Three"
        ];

        const result = MarkdownGenerator.UnorderedList(list, {
            symbol: "-"
        });
        expect(result).toMatchSnapshot();
    });

    it("UnorderedList should throw when given not supported symbol", () => {
        expect(() => MarkdownGenerator.UnorderedList([], {
            symbol: "a" as any
        })).toThrow();
    });

    it("Ordered simple list", () => {
        const list = [
            "One",
            "Two",
            "Three"
        ];

        const result = MarkdownGenerator.OrderedList(list);
        expect(result).toMatchSnapshot();
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

        const result = MarkdownGenerator.OrderedList(list);
        expect(result).toMatchSnapshot();
    });

    it("Ordered multi level list", () => {
        const list = [
            "Level 1 - 1",
            "Level 1 - 2",
            [
                "Level 2 - 1",
                "Level 2 - 2",
                [
                    "Level 3 - 1",
                    "Level 3 - 2",
                    [
                        "Level 4 - 1"
                    ],
                    "Level 3 - 3",
                    "Level 3 - 4"
                ],
                "Level 2 - 3",
                "Level 2 - 4"
            ],
            "Level 1 - 3",
            "Level 1 - 4"
        ];

        const result = MarkdownGenerator.UnorderedList(list);
        expect(result).toMatchSnapshot();
    });

    it("Ordered multi level list with empty levels", () => {
        const list = [
            "Level 1 - 1",
            "Level 1 - 2",
            [],
            [],
            [
                "Level 2 - 1",
                [],
                "Level 2 - 2",
                [
                    "Level 3 - 1",
                    [],
                    "Level 3 - 2",
                    [
                        "Level 4 - 1"
                    ],
                    "Level 3 - 3",
                    [],
                    "Level 3 - 4"
                ],
                "Level 2 - 3",
                [],
                "Level 2 - 4"
            ],
            "Level 1 - 3",
            [],
            "Level 1 - 4"
        ];

        const result = MarkdownGenerator.UnorderedList(list);
        expect(result).toMatchSnapshot();
    });
});

describe("Table", () => {
    it("Simple example", () => {
        const headers: string[] = ["Property", "Value"];
        const rows = [
            ["Name", "string"],
            ["Age", "number"]
        ];
        const result = MarkdownGenerator.Table(headers, rows);
        expect(result).toMatchSnapshot();
    });

    it("Simple example with escape", () => {
        const headers: string[] = ["Property", "Value"];
        const rows = [
            ["Name", "string"],
            ["Age", "number | string"]
        ];
        const result = MarkdownGenerator.Table(headers, rows);
        expect(result).toMatchSnapshot();
    });

    it("Simple example without escape", () => {
        const headers: string[] = ["Property", "Value"];
        const rows = [
            ["Name", "string"],
            ["Age", "number | string"]
        ];
        const result = MarkdownGenerator.Table(headers, rows, { escapePipeChar: undefined });
        expect(result).toMatchSnapshot();
    });

    it("Removes a column if it's empty", () => {
        const headers: string[] = ["Property", "Value"];
        const rows = [
            ["Name"],
            ["Age"]
        ];
        const result = MarkdownGenerator.Table(headers, rows, { removeColumnIfEmpty: true });
        expect(result).toMatchSnapshot();
    });

    it("Table with a single column filled.", () => {
        const headers = ["Name", "Constraint type", "Default type"];
        const rows = [
            ["TValue", "", ""]
        ];

        const result = MarkdownGenerator.Table(headers, rows, { removeColumnIfEmpty: true });
        expect(result).toMatchSnapshot();
    });

    it("Table with an empty column in the middle.", () => {
        const headers = ["Name", "Constraint type", "Default type"];
        const rows = [
            ["TValue", "", "string"],
            ["T", "", "string"],
            ["TKey ", "", "string"],
        ];

        const result = MarkdownGenerator.Table(headers, rows, { removeColumnIfEmpty: true });
        expect(result).toMatchSnapshot();
    });

    it("Table with empty rows", () => {
        const headers = ["Name", "Constraint type", "Default type", "InitialValue"];
        const rows = [
            ["TValue", "", "", "{}"],
            ["", "", "", ""],
            ["TKey", "", "", "{}"],
            ["", "", "", ""]
        ];

        const result = MarkdownGenerator.Table(headers, rows, { removeColumnIfEmpty: true, removeRowIfEmpty: true });
        expect(result).toMatchSnapshot();
    });

    it("Table with rows that has a single cell filled", () => {
        const headers = ["Name", "Constraint type", "Default type", "InitialValue"];
        const rows = [
            ["TValue", "", "", ""],
            ["", "Object", "", ""],
            ["", "", "Object", ""],
            ["", "", "", "{}"]
        ];

        const result = MarkdownGenerator.Table(headers, rows, { removeColumnIfEmpty: true });
    });

    it("Simple example with mixed alignments", () => {
        const headers: Array<TableHeader | string> = [
            {
                text: "Property",
                align: "center"
            },
            "Value"
        ];

        const rows = [
            ["Name", "string"],
            ["Age", "number"]
        ];
        const result = MarkdownGenerator.Table(headers, rows);
        expect(result).toMatchSnapshot();
    });

    it("Headers with all alignments", () => {
        const headers: TableHeader[] = [
            {
                text: "Text1",
                align: "center"
            },
            {
                text: "Text2",
                align: "left"
            },
            {
                text: "Text3",
                align: "none"
            },
            {
                text: "Text4",
                align: "right"
            }
        ];

        const rows = [
            ["One", "Two", "Three", "Four"],
            ["One", "Two", "Three", "Four"]
        ];
        const result = MarkdownGenerator.Table(headers, rows);
        expect(result).toMatchSnapshot();
    });

    it("Headers with missing data in rows", () => {
        const headers: TableHeader[] = [
            {
                text: "Text1",
                align: "center"
            },
            {
                text: "Text2",
                align: "left"
            },
            {
                text: "Text3",
                align: "none"
            },
            {
                text: "Text4",
                align: "right"
            }
        ];

        const rows = [
            ["One", "Two", "Three"],
            ["One"],
            ["One", "Two"]
        ];
        const result = MarkdownGenerator.Table(headers, rows, { removeColumnIfEmpty: true });
        expect(result).toMatchSnapshot();
    });
});

describe("Links", () => {
    it("Simple link", () => {
        const result = MarkdownGenerator.Link("Some text", "https://google.com/");
        expect(result).toMatchSnapshot();
    });

    it("Simple link with a hover text", () => {
        const result = MarkdownGenerator.Link("Some text", "https://google.com/", "Hover text");
        expect(result).toMatchSnapshot();
    });

    it("Link to definition", () => {
        const result = MarkdownGenerator.Link("Some text", "Google", true);
        expect(result).toMatchSnapshot();
    });

    it("Link definition", () => {
        const result = MarkdownGenerator.LinkDefinition("Some text", "https://google.com/");
        expect(result).toMatchSnapshot();
    });

    it("Link definition with a hover text", () => {
        const result = MarkdownGenerator.LinkDefinition("Some text", "https://google.com/", "Hover text");
        expect(result).toMatchSnapshot();
    });
});

describe("Image", () => {
    it("Simple image", () => {
        const result = MarkdownGenerator.Image("Alt text", "https://path.com/image.jpg");
        expect(result).toMatchSnapshot();
    });

    it("Simple image with a hover text", () => {
        const result = MarkdownGenerator.Image("Alt text", "https://google.com/", "Hover text");
        expect(result).toMatchSnapshot();
    });
});

describe("Horizontal rule", () => {
    it("Simple horizontal rule", () => {
        const result = MarkdownGenerator.HorizontalRule();
        expect(result).toMatchSnapshot();
    });

    it("Custom length", () => {
        const result = MarkdownGenerator.HorizontalRule(undefined, 10);
        expect(result).toMatchSnapshot();
    });

    it("Custom symbol", () => {
        const result = MarkdownGenerator.HorizontalRule("*");
        expect(result).toMatchSnapshot();
    });

    it("Throws when length is lower than 3", () => {
        expect(() => MarkdownGenerator.HorizontalRule(undefined, 0)).toThrow();
    });

    it("Throws when symbol is not in allowed list.", () => {
        expect(() => MarkdownGenerator.HorizontalRule("1" as any)).toThrow();
    });
});

describe("Escape string", () => {
    it("Escape url", () => {
        const textToEscape = MarkdownGenerator.Link("Google", "https://google.com/");
        const result = MarkdownGenerator.EscapeString(textToEscape);
        expect(result).toMatchSnapshot();
    });

    it("Escape symbols", () => {
        const textToEscape = "\ ` * _ { } [ ] ( ) # + - . ! | < >";
        const result = MarkdownGenerator.EscapeString(textToEscape);
        expect(result).toMatchSnapshot();
    });

    it("Escaped character in table", () => {
        const headers = ["Name", "Constraint type", "Default type"];
        const rows = [
            ["TValue", "string", "text"],
            ["T", MarkdownGenerator.EscapeString("string | undefined"), "text"],
            ["TKey ", "string", "text"],
            ["TValue", MarkdownGenerator.EscapeString("Map<string>"), "text"]
        ];

        const result = MarkdownGenerator.Table(headers, rows);
        expect(result).toMatchSnapshot();
    });
});
