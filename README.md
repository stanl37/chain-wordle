# CHAIN-WORDLE

### What is this?
A Vue3 (Composition API, Script Setup) implementation and augmentation of the [Wordle game](https://www.nytimes.com/games/wordle/index.html). Chain-Wordle allows for players to sequentially solve Wordle's of varying sizes, slowly unlocking a sentence as they go.

The original intent of this project was for a [Flitz](https://thetab.com/us/dartmouth/2015/12/22/dartmouth-blitz-1506), the plan being to send a Chain-Wordle (a Flitzle?) with the secret sentence, "will you go to formal with me."

Chain-Wordle will create a series of Wordle games based on each word of an input sentence. Currently, words up to length 11 are supported. Players can solve the Wordles in the sentence in whatever order they would like. Punctuation, hyphens, and other non-letter characters are currently not supported.

### Word Databases
Created using list of words from [this repo](https://github.com/dwyl/english-words). Wrote and used a quick Python script to create TypeScript arrays for length-1 thru length-11 words.

### Technologies Used
- **Vue3** (Composition API, Components, Routers, Event Handling)
- TypeScript, HTML/CSS
- Databases (localStorage)
- URL Query Parsing, Base58 Encoding
- Data Processing (Python)
- Async, Dynamic Imports (Does not work on Github Pages)

### Why Base58?
Because Base58 does not include alphanumeric characters such as `+` and `/`, making the query string look cleaner. Base58 was also invented by Satoshi Nakamoto!

### Usage with Live Implementation
[Base58-encode](https://www.browserling.com/tools/base58-encode) a sentence and include it as a URL query following `/s?=`. For example: https://stanl37.github.io/?s=AWzmytDMpy6ddh8JovJ5C1bxaYSWSkSkB will generate a Chain-Wordle using the sentence: *Hello World this is neat*. Note that Base58 is case sensitive, however Chain-Wordle will automatically convert strings to lowercase.

### Local Usage
Clone the repository to a local directory and run the following:
```properties
cd <project_dir>
npm install
npm run dev
```