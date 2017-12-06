import { MarkdownBuilder } from "../src/markdown-builder";

describe("MarkdownBuilder", () => {
    it("Simple builder with GetOutput", () => {
        const builder = new MarkdownBuilder()
            .Header("Builder simple example", 1)
            .EmptyLine()
            .Text("It's a simple markdown builder example.");

        expect(builder.GetOutput()).toMatchSnapshot();
    });

    it("Simple builder with Build", () => {
        const builder = new MarkdownBuilder()
            .Header("Builder simple example", 1)
            .EmptyLine()
            .Text("It's a simple markdown builder example.");

        expect(builder.Build()).toMatchSnapshot();
        expect(builder.Build("\n")).toMatchSnapshot();
    });

    it("All used methods", () => {
        const builder = new MarkdownBuilder()
            .UnderlineHeader("Foo", 1)
            .EmptyLine()
            .Header("Bar", 2, true)
            .Blockquote("blockquote")
            .EmptyLine()
            .Link("Link Text", "reference-text", true)
            .EmptyLine()
            .Link("Link Url", "https://domain.domain", "qwd")
            .EmptyLine()
            .LinkDefinition("reference", "https://domain.domain")
            .EmptyLine()
            .Image("Alternative text", "https://domain.domain")
            .EmptyLine()
            .UnorderedList(["One", "Two"])
            .EmptyLine()
            .OrderedList(["One", "Two"])
            .EmptyLine()
            .HorizontalRule()
            .EmptyLine()
            .Italic("Italic")
            .EmptyLine()
            .Bold("Bold")
            .EmptyLine()
            .StrikeThrough("Strike Through")
            .EmptyLine()
            .InlineCode("Inline code")
            .EmptyLine()
            .Code(`const a = "Hello World!";`, { lang: "typescript" })
            .EmptyLine()
            .Table(["A", "B"], [["a1", "b1"]])
            .EmptyLine()
            .Text("Hello World!")
            .Text("It's a simple markdown builder example.");

        expect(builder.GetOutput()).toMatchSnapshot();
    });

    it("Append another Builder while constructing a new one", () => {
        const oldBuilder = new MarkdownBuilder()
            .UnderlineHeader("Hello Header", 1);

        const newBuilder = new MarkdownBuilder(oldBuilder)
            .EmptyLine()
            .Text(md => `Hello ${md.Bold("World")}!`);

        expect(newBuilder).toMatchSnapshot();
    });
});
