import { MarkdownGenerator } from "./markdown-generator";

import {
    CodeOptions,
    EmphasisOptions,
    TableHeader,
    TableOptions,
    UnorderedListOptions,
    UnorderedListSymbols,
    MarkdownList,
    HorizontalRuleSymbol
} from "./contracts";

export type TextHandler = (md: typeof MarkdownGenerator) => string | string[];
export type TextGenerator = string | string[] | TextHandler;

export class MarkdownBuilder {
    constructor(output?: string[] | MarkdownBuilder) {
        this.output = this.resolveInput(output || []);
    }

    private output: string[];

    public Header(text: string, headerLevel: number, closing: boolean = false): this {
        this.output.push(MarkdownGenerator.Header(text, headerLevel, closing));

        return this;
    }

    public UnderlineHeader(text: string, headerLevel: number): this {
        this.output = this.output.concat(MarkdownGenerator.UnderlineHeader(text, headerLevel));

        return this;
    }

    public Blockquote(text: string | string[] | MarkdownBuilder): this {
        this.output = this.output.concat(this.resolveInput(text));

        return this;
    }

    public Link(text: string, definitionName: string, definition: boolean): this;
    public Link(text: string, url: string, linkTitle?: string): this;
    public Link(text: string, target: string, arg?: string | boolean): this {
        // WTF?
        if (typeof arg === "boolean") {
            this.output.push(MarkdownGenerator.Link(text, target, arg));
        } else {
            this.output.push(MarkdownGenerator.Link(text, target, arg));
        }

        return this;
    }

    public LinkDefinition(text: string, url: string, linkTitle?: string): this {
        this.output.push(MarkdownGenerator.LinkDefinition(text, url, linkTitle));

        return this;
    }

    public Image(altText: string, url: string, title?: string): this {
        this.output.push(MarkdownGenerator.Image(altText, url, title));

        return this;
    }

    public UnorderedList(list: MarkdownList, options?: UnorderedListOptions): this {
        this.output = this.output.concat(MarkdownGenerator.UnorderedList(list, options));

        return this;
    }

    public OrderedList(list: MarkdownList): this {
        this.output = this.output.concat(MarkdownGenerator.OrderedList(list));

        return this;
    }

    public HorizontalRule(symbol?: HorizontalRuleSymbol, length?: number): this {
        this.output.push(MarkdownGenerator.HorizontalRule(symbol, length));

        return this;
    }

    public Italic(text: string, options?: EmphasisOptions): this {
        this.output.push(MarkdownGenerator.Italic(text, options));

        return this;
    }

    public Bold(text: string, options?: EmphasisOptions): this {
        this.output.push(MarkdownGenerator.Bold(text, options));

        return this;
    }

    public StrikeThrough(text: string): this {
        this.output.push(MarkdownGenerator.StrikeThrough(text));

        return this;
    }

    /**
     * Github flavored markdown
     * @see https://help.github.com/articles/basic-writing-and-formatting-syntax/#quoting-code
     */
    public InlineCode(text: string): this {
        this.output.push(MarkdownGenerator.InlineCode(text));

        return this;
    }

    /**
     * Github flavored markdown
     * @see https://help.github.com/articles/basic-writing-and-formatting-syntax/#quoting-code
     */
    public Code(text: string | string[], options?: CodeOptions): this {
        this.output = this.output.concat(MarkdownGenerator.Code(text, options));

        return this;
    }

    public Table(headers: Array<string | TableHeader>, content: string[][], options?: TableOptions): this {
        this.output = this.output.concat(MarkdownGenerator.Table(headers, content, options));

        return this;
    }

    public Text(text: TextGenerator): this {
        this.output = this.output.concat(this.resolveInput(text));

        return this;
    }

    public NewLine(): this {
        this.output.push("");

        return this;
    }

    private resolveInput(input: string | string[] | TextHandler | MarkdownBuilder): string[] {
        if (typeof input === "function") {
            input = input(MarkdownGenerator);
        }

        if (Array.isArray(input)) {
            return input;
        } else if (input instanceof MarkdownBuilder) {
            return input.GetOutput();
        } else {
            return [input];
        }
    }

    public GetOutput(): string[] {
        return this.output;
    }
}

new MarkdownBuilder()
    .Text(md => md.Bold("Hello"));
