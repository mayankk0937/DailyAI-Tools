const { GoogleGenerativeAI } = require('@google/generative-ai');
const fs = require('fs');
const env = fs.readFileSync('.env.local', 'utf-8');
const key = env.split('\n').find(line => line.startsWith('GEMINI_API_KEY=')).split('=')[1].trim();
const ai = new GoogleGenerativeAI(key);

async function test() {
  const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${key}`;
  try {
    const res = await fetch(url);
    const data = await res.json();
    console.log(data);
  } catch(e) {
    console.log('Fetch error:', e.message);
  }
}
test();
