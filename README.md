# CHAIN-WORDLE

A Vue3 (Composition API, Script Setup) implementation and augmentation of the [Wordle game](https://www.nytimes.com/games/wordle/index.html). Chain-Wordle allows for players to sequentially solve Wordle's of varying sizes, slowly unlocking a sentence as they go.

The original intent of this project was for a [Flitz](https://thetab.com/us/dartmouth/2015/12/22/dartmouth-blitz-1506), the plan being to send a Chain-Wordle (a Flitzle?) with the secret sentence, "will you go to formal with me."

Chain-Wordle will create a series of Wordle games based on each word of an input sentence. Currently, words up to length 11 are supported. Players can solve the Wordles in the sentence in whatever order they would like. Punctuation, hyphens, and other non-letter characters are currently not supported.

### Word Databases
Created using list of words from [this repo](https://github.com/dwyl/english-words). Wrote and used a quick Python script to create separate files for length-1 thru length-11 words.

### Technologies Used
- **Vue3** (Composition API, Components, Routers, Event Handling)
- TypeScript, HTML/CSS
- Databases (localStorage)
- URL Query Parsing, Base58 Encoding
- Data Processing (Python)
- Async, Dynamic Imports



### Usage with Live Implementation
Base58-encode a sentence and include it as a URL query. For example: https://mysite.com/?Qvm7PtB6FR1ArCMMgQVtXyeg8BSSVtK9CnAUQQX74 (this will generate )

### Local Usage
Clone the repository to a local directory and run the following:
```properties
cd <project_dir>
npm install
npm run dev
```