const axios = require('axios');

const endpoints = [
  'https://jsonbase.com/sls-team/json-793',
  'https://jsonbase.com/sls-team/json-955',
  'https://jsonbase.com/sls-team/json-231',
  'https://jsonbase.com/sls-team/json-931',
  'https://jsonbase.com/sls-team/json-93',
  'https://jsonbase.com/sls-team/json-342',
  'https://jsonbase.com/sls-team/json-770',
  'https://jsonbase.com/sls-team/json-491',
  'https://jsonbase.com/sls-team/json-281',
  'https://jsonbase.com/sls-team/json-718',
  'https://jsonbase.com/sls-team/json-310',
  'https://jsonbase.com/sls-team/json-806',
  'https://jsonbase.com/sls-team/json-469',
  'https://jsonbase.com/sls-team/json-258',
  'https://jsonbase.com/sls-team/json-516',
  'https://jsonbase.com/sls-team/json-79',
  'https://jsonbase.com/sls-team/json-706',
  'https://jsonbase.com/sls-team/json-521',
  'https://jsonbase.com/sls-team/json-350',
  'https://jsonbase.com/sls-team/json-64',
];

async function queryEndpoint(endpoint, retries = 0) {
  try {
    const response = await axios.get(endpoint);
    const data = response.data;

    if ('isDone' in data) {
      console.log(`[Success] ${endpoint}: isDone - ${data.isDone}`);
      return data.isDone;
    } else {
      let result = null;
      const keysArray = Object.keys(response.data);
      keysArray.forEach((key) => {
        if (response.data[key].hasOwnProperty('isDone')) {
          console.log(
            `[Success] ${endpoint}: isDone -  ${response.data[key].isDone}`
          );
          result = response.data[key].isDone;
        }
      });
      return result;
    }
  } catch (error) {
    if (retries < 3) {
      console.log(`[Retry ${retries + 1}] ${endpoint}: ${error.message}`);
      return await queryEndpoint(endpoint, retries + 1);
    } else {
      console.log(`[Fail] ${endpoint}: ${error.message}`);
      return null;
    }
  }
}

async function main() {
  let trueCount = 0;
  let falseCount = 0;
  for (const endpoint of endpoints) {
    const isDone = await queryEndpoint(endpoint);
    if (isDone === true) {
      trueCount++;
    } else if (isDone === false) {
      falseCount++;
    }
  }
  console.log(`Found True values: ${trueCount}`);
  console.log(`Found False values: ${falseCount}`);
}

main();
