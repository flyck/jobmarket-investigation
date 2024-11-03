# gpt-labeling

## Labeling steps

1. get indeed job data by executing the jobspy-scraper
1. run the gpt labeling queries
```bash
bun run index.ts
```
1. copy the output of the query into the result.ts file and fix any json formatting issues
1. run biome linter for easy formatting of the results
```bash
bunx @biomejs/biome format --write resultData.ts
```
1. transform that data into graph labels for chartjs
```bash
bun run result.ts
```

## Setup

To install dependencies:

```bash
bun install
```

To run:

```bash
bun run index.ts
```

This project was created using `bun init` in bun v1.1.21. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.
