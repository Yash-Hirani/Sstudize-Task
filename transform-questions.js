/*
  Script: transform_questions.js
  Description: Reads a hardcoded inputJSON, transforms its structure, and writes the result to output.json
*/

const fs = require('fs');

// Paste your input JSON here:
const inputJSON = {}

// Letter mapping for options
const letters = ['a', 'b', 'c', 'd'];

// Transform the JSON structure
const outputJSON = {
  questions: inputJSON.questions.map((q, idx) => ({
    Index: idx + 1,
    question: q.question,
    options: q.options.map((optText, optIdx) => ({
      letter: letters[optIdx] || String(optIdx + 1),
      text: optText
    }))
  }))
};

// Write the transformed JSON to output.json
fs.writeFileSync(
  'output.json',
  JSON.stringify(outputJSON, null, 2),
  'utf-8'
);

console.log('Transformed JSON written to output.json');
