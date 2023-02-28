const fs = require('fs');
const files = fs.readdirSync('./usernames');

let namesMap = {};

files.forEach((fileName) => {
  const content = fs.readFileSync(`./usernames/${fileName}`, 'utf-8');
  namesMap[fileName] = content.split(/\r?\n/);
});

const namesInFiles = () => {
  let uniqueValues = {};
  for (const files in namesMap) {
    uniqueValues[files] = [...new Set(namesMap[files])];
  }
  return Object.values(uniqueValues).map((arr) => arr);
};

let arrays = namesInFiles();

const uniqueValues = () => {
  const uniqueValues = new Set();
  Object.keys(namesMap).forEach((fileName) => {
    namesMap[fileName].forEach((name) => {
      uniqueValues.add(name);
    });
  });
  return [...uniqueValues].length;
};

const existInAllFiles = (arrays) => {
  const nameCounts = {};
  for (let i = 0; i < arrays.length; i++) {
    const names = arrays[i];
    for (let e = 0; e < names.length; e++) {
      const name = names[e];
      if (i === 0) {
        nameCounts[name] = 1;
      } else if (nameCounts[name] === i) {
        nameCounts[name]++;
      }
    }
  }
  return Object.keys(nameCounts).filter(
    (name) => nameCounts[name] === arrays.length
  );
};

const existInTenFiles = (arrays, occursIn = 10) => {
  const nameCounts = {};
  for (let i = 0; i < arrays.length; i++) {
    const names = arrays[i];
    for (let e = 0; e < names.length; e++) {
      const name = names[e];
      if (i === 0) {
        nameCounts[name] = 1;
      } else if (nameCounts[name] === i) {
        nameCounts[name]++;
      }
    }
  }
  return Object.keys(nameCounts).filter((name) => nameCounts[name] >= occursIn);
};

const time0 = performance.now();

console.log('unique values: ', uniqueValues());
console.log('occurs in all files', existInAllFiles(arrays).length);
console.log('occurs at least in 10 files', existInTenFiles(arrays).length);

const time1 = performance.now();
console.log(`Functions took: ${Math.floor(time1 - time0) / 1000} seconds.`);
