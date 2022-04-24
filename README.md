# FLITZLE

A Vue implementation of the [Wordle game](https://www.nytimes.com/games/wordle/index.html), modified to use in a [Flitz](https://thetab.com/us/dartmouth/2015/12/22/dartmouth-blitz-1506)!

Flitzle will create a series of Wordle games based on each word of an input sentence. A word may be a maximum of 11 characters long (databases for words of length 1 through 11 are included). Completing one Wordle game will move the player onto the next until the sentence is completed. Punctuation, hyphens, and other non-letter characters are automatically filled and set as correct.

### Word Databases
Created using list of words from [this repo](https://github.com/dwyl/english-words). Wrote and used a quick Python script to create separate files for length-1 thru length-11 words.

### Usage with Live Implementation
Base58-encode a sentence and include it as a URL query. For example: https://mysite.com/?Qvm7PtB6FR1ArCMMgQVtXyeg8BSSVtK9CnAUQQX74 (this will generate )

### Local Usage
Clone the repository to a local directory and run the following:
```properties
cd <project_dir>
npm install
npm run dev
```