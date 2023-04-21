// Using promise.all to download all at once: 
const fs = require('fs');
const http = require('http');
const https = require('https');
const path = require('path');

// Check if a filename was provided
if (process.argv.length !== 3) {
  console.error('Usage: node urls.js FILENAME');
  process.exit(1);
}

// Read the file contents
const filename = process.argv[2];
let urls;
try {
  urls = fs.readFileSync(filename, 'utf-8').split('\n').filter(Boolean);
} catch (err) {
  console.error(`Error reading file "${filename}":`, err.message);
  process.exit(1);
}

// Define a function to download a URL and save it to a file
function downloadUrl(url) {
  const protocol = url.startsWith('https') ? https : http;
  const options = { method: 'GET', headers: { 'User-Agent': 'Mozilla/5.0' } };
  return new Promise((resolve, reject) => {
    protocol.get(url, options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => { resolve(data); });
    }).on('error', (err) => { reject(err); });
  });
}

// Define a function to write a string to a file
function writeFile(filepath, content) {
  return new Promise((resolve, reject) => {
    fs.writeFile(filepath, content, 'utf-8', (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

// Download all URLs and save the content to files
async function main() {
  const promises = urls.map(async (url) => {
    const hostname = new URL(url).hostname;
    const filepath = path.join(process.cwd(), hostname);

    try {
      console.log(`Downloading ${url} to ${filepath}`);
      const content = await downloadUrl(url);
      await writeFile(filepath, content);
      console.log(`Wrote to ${hostname}`);
    } catch (err) {
      console.error(`Error processing ${url}:`, err.message);
    }
  });

  await Promise.all(promises);
}

main();
