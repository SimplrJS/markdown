[![NPM version](https://img.shields.io/npm/v/@simplrjs/markdown.svg?style=flat-square)](https://www.npmjs.com/package/@simplrjs/markdown)
[![Build](https://img.shields.io/travis/SimplrJS/markdown.svg?style=flat-square)](https://travis-ci.org/SimplrJS/markdown)
[![Coveralls](https://img.shields.io/coveralls/github/SimplrJS/markdown.svg?style=flat-square)](https://coveralls.io/github/SimplrJS/markdown)
[![Dependencies](https://img.shields.io/david/SimplrJS/markdown.svg?style=flat-square)](https://david-dm.org/simplrjs/markdown)
[![Dev Dependencies](https://img.shields.io/david/dev/SimplrJS/markdown.svg?style=flat-square)](https://david-dm.org/simplrjs/markdown?type=dev)

<h1 align="center">@simplrjs/markdown</h1>

Creating markdown made easily.

## Get started 
```sh
$ npm install @simplrjs/markdown --save
```

## Features
* Creating Markdown output

## TODO
* Markdown file parser

## Simple examples

Using `MarkdownBuilder`.

```typescript
import * as fs from "fs-extra";
import { MarkdownBuilder } from "@simplrjs/markdown";

const builder = new MarkdownBuilder()
    .UnderlineHeader("Markdown Header", 1)
    .EmptyLine()
    .Text(md => `Hello ${md.Bold("World")}!`)
    .Text("It's so easy to print markdown this way!");

fs.writeFile("./text.md", builder.Build());
```

You can use `MarkdownGenerator` directly.

```typescript
import * as fs from "fs-extra";
import { MarkdownGenerator } from "@simplrjs/markdown";

let output: string[] = [];

output = output.concat(MarkdownGenerator.UnderlineHeader("Markdown Header", 1));
output.push("");
output.push(`Hello ${MarkdownGenerator.Bold("World")}!`);

fs.writeFile("./text.md", output.join("\n"));
```


## API 
WIP

## License
Released under the [MIT license](LICENSE).
