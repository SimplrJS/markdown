import { MarkdownGenerator } from "../src/markdown-generator";
import { TableHeader } from "../src/contracts";
import * as S from "string";

const NEW_LINE = "\n";

describe("Header", () => {
    it("throw error when number is not finite", () => {
        expect(() => MarkdownGenerator.Header("Some text", "a" as any)).toThrow();
    });

    it("throw error when number is not valid (0 < x < 7)", () => {
        expect(() => MarkdownGenerator.Header("Some text", 7)).toThrow();
    });

    it("working example", () => {
        const text = "Some text";
        const result = MarkdownGenerator.Header("Some text", 1);
        expect(result).toMatchSnapshot();
    });

    it("working example with closing header", () => {
        const text = "Some text";
        const result = MarkdownGenerator.Header(text, 1, true);
        expect(result).toMatchSnapshot();
    });
});

describe("Underline header", () => {
    it("throw error when number is not finite", () => {
        expect(() => MarkdownGenerator.UnderlineHeader("Some text", "a" as any)).toThrow();
    });

    it("throw error when number is not valid (0 < x < 3)", () => {
        expect(() => MarkdownGenerator.UnderlineHeader("Some text", 3)).toThrow();
    });

    it("working example", () => {
        const text = "Some text";
        const result = MarkdownGenerator.UnderlineHeader(text, 1);
        expect(result).toMatchSnapshot();
    });

    it("working example 2", () => {
        const text = "Some text";
        const result = MarkdownGenerator.UnderlineHeader(text, 2);
        expect(result).toMatchSnapshot();
    });
});

describe("BlockQuotes", () => {
    it("simple working example", () => {
        const text = "Some text";
        const result = MarkdownGenerator.Blockquote(text);
        expect(result).toMatchSnapshot();
    });

    it("simple working example with escaping", () => {
        const text = ">Some text";
        const result = MarkdownGenerator.Blockquote(text, { escapeGreaterThanChar: "\\>" });
        expect(result).toMatchSnapshot();
    });

    it("multiline working example", () => {
        const text = "Some text \n\nOther Text";
        const result = MarkdownGenerator.Blockquote(text);

        expect(result).toMatchSnapshot();
    });

    it("multiline string array working example", () => {
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

    it("strikeThrough", () => {
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
    it("simple unordered", () => {
        const list = [
            "One",
            "Two",
            "Three"
        ];

        const result = MarkdownGenerator.UnorderedList(list);
        expect(result).toMatchSnapshot();
    });

    it("unordered deep", () => {
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

    it("unordered multi level", () => {
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

    it("unordered multi level with empty levels", () => {
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

    it("unordered simple list with a custom symbol", () => {
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

    it("unordered should throw when given not supported symbol", () => {
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

    it("ordered deep", () => {
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

    it("ordered multi level", () => {
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

    it("ordered multi level list with empty levels", () => {
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
    it("simple", () => {
        const headers: string[] = ["Property", "Value"];
        const rows = [
            ["Name", "string"],
            ["Age", "number"]
        ];
        const result = MarkdownGenerator.Table(headers, rows);
        expect(result).toMatchSnapshot();
    });

    it("simple with escape", () => {
        const headers: string[] = ["Property", "Value"];
        const rows = [
            ["Name", "string"],
            ["Age", "number | string"]
        ];
        const result = MarkdownGenerator.Table(headers, rows);
        expect(result).toMatchSnapshot();
    });

    it("simple without escape", () => {
        const headers: string[] = ["Property", "Value"];
        const rows = [
            ["Name", "string"],
            ["Age", "number | string"]
        ];
        const result = MarkdownGenerator.Table(headers, rows, { escapePipeChar: undefined });
        expect(result).toMatchSnapshot();
    });

    it("removes a column if it's empty", () => {
        const headers: string[] = ["Property", "Value"];
        const rows = [
            ["Name"],
            ["Age"]
        ];
        const result = MarkdownGenerator.Table(headers, rows, { removeColumnIfEmpty: true });
        expect(result).toMatchSnapshot();
    });

    it("with a single column filled", () => {
        const headers = ["Name", "Constraint type", "Default type"];
        const rows = [
            ["TValue", "", ""]
        ];

        const result = MarkdownGenerator.Table(headers, rows, { removeColumnIfEmpty: true });
        expect(result).toMatchSnapshot();
    });

    it("with an empty column in the middle", () => {
        const headers = ["Name", "Constraint type", "Default type"];
        const rows = [
            ["TValue", "", "string"],
            ["T", "", "string"],
            ["TKey ", "", "string"],
        ];

        const result = MarkdownGenerator.Table(headers, rows, { removeColumnIfEmpty: true });
        expect(result).toMatchSnapshot();
    });

    it("with empty rows", () => {
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

    it("with rows that has a single cell filled", () => {
        const headers = ["Name", "Constraint type", "Default type", "InitialValue"];
        const rows = [
            ["TValue", "", "", ""],
            ["", "Object", "", ""],
            ["", "", "Object", ""],
            ["", "", "", "{}"]
        ];

        const result = MarkdownGenerator.Table(headers, rows, { removeColumnIfEmpty: true });
    });

    it("simple with mixed alignments", () => {
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

    it("headers with all alignments", () => {
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

    it("headers with missing data in rows", () => {
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
    it("simple", () => {
        const result = MarkdownGenerator.Link("Some text", "https://google.com/");
        expect(result).toMatchSnapshot();
    });

    it("simple with a hover text", () => {
        const result = MarkdownGenerator.Link("Some text", "https://google.com/", "Hover text");
        expect(result).toMatchSnapshot();
    });

    it("to definition", () => {
        const result = MarkdownGenerator.Link("Some text", "Google", true);
        expect(result).toMatchSnapshot();
    });

    it("definition", () => {
        const result = MarkdownGenerator.LinkDefinition("Some text", "https://google.com/");
        expect(result).toMatchSnapshot();
    });

    it("definition with a hover text", () => {
        const result = MarkdownGenerator.LinkDefinition("Some text", "https://google.com/", "Hover text");
        expect(result).toMatchSnapshot();
    });
});

describe("Image", () => {
    it("simple", () => {
        const result = MarkdownGenerator.Image("Alt text", "https://path.com/image.jpg");
        expect(result).toMatchSnapshot();
    });

    it("simple with a hover text", () => {
        const result = MarkdownGenerator.Image("Alt text", "https://google.com/", "Hover text");
        expect(result).toMatchSnapshot();
    });
});

describe("Horizontal rule", () => {
    it("simple", () => {
        const result = MarkdownGenerator.HorizontalRule();
        expect(result).toMatchSnapshot();
    });

    it("custom length", () => {
        const result = MarkdownGenerator.HorizontalRule(undefined, 10);
        expect(result).toMatchSnapshot();
    });

    it("custom symbol", () => {
        const result = MarkdownGenerator.HorizontalRule("*");
        expect(result).toMatchSnapshot();
    });

    it("throws when length is lower than 3", () => {
        expect(() => MarkdownGenerator.HorizontalRule(undefined, 0)).toThrow();
    });

    it("throws when symbol is not in allowed list.", () => {
        expect(() => MarkdownGenerator.HorizontalRule("1" as any)).toThrow();
    });
});

describe("Escape string", () => {
    it("url", () => {
        const textToEscape = MarkdownGenerator.Link("Google", "https://google.com/");
        const result = MarkdownGenerator.EscapeString(textToEscape);
        expect(result).toMatchSnapshot();
    });

    it("symbols", () => {
        const textToEscape = "\ ` * _ { } [ ] ( ) # + - . ! | < >";
        const result = MarkdownGenerator.EscapeString(textToEscape);
        expect(result).toMatchSnapshot();
    });

    it("character in table", () => {
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
