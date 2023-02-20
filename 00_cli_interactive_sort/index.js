const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const sortingIncrease = (input) => {
  const numbers = input.filter((e) => !isNaN(e));
  if (!numbers.length) {
    return console.log('This function is for numbers only!');
  } else {
    return numbers.sort((a, b) => a - b).join(' ');
  }
};

const sortingDecrease = (input) => {
  const numbers = input.filter((e) => !isNaN(e));
  if (!numbers.length) {
    return console.log('This function is for numbers only!');
  } else {
    return numbers.sort((a, b) => b - a).join(' ');
  }
};

const uniqueValues = (input) => [...new Set(input)].join(' ');

const uniqueWords = (input) =>
  [...new Set(input.filter((e) => isNaN(e)))].join(' ');

const sortByLength = (input) =>
  input.sort((e1, e2) => e1.length - e2.length).join(' ');

const alpabheticOrder = (input) => input.sort().join(' ');

const validateInput = (input) => {
  const itemsLength = input.split(' ').length;
  return itemsLength >= 2 && itemsLength <= 10;
};

const optionsListText = `
Enter a letter with your option or "exit" to quit app:
a. Sort words alphabetically
b. Show numbers from lesser to greater
c. Show numbers from lesser to greater
d. Display words in ascending order by number of letters in the word
e. Show only unique words
f. Display only unique values from the set of words and numbers entered by the user
exit - to quit the CLI: 
`;

let userInput = [];

const actionsMap = {
  a: () => alpabheticOrder(userInput),
  b: () => sortingIncrease(userInput),
  c: () => sortingDecrease(userInput),
  d: () => sortByLength(userInput),
  e: () => uniqueWords(userInput),
  f: () => uniqueValues(userInput),
};

const askForInput = () => {
  rl.question(
    'Enter a few words or numbers separated by a space (2 to 10 words): ',
    (input) => {
      if (!validateInput(input)) {
        console.log('Invalid input. Please enter 2 to 10 words.');
        askForInput();
        return;
      }
      userInput = input.trim().split(' ');

      console.log('You entered:', userInput.join(' '));

      const askForAction = () => {
        rl.question(optionsListText, (userAction) => {
          const action = userAction.toLowerCase().trim();

          if (typeof actionsMap[action] === 'function') {
            if (!actionsMap[action]()) {
              console.log('oops! try with another data type');
              askForAction();
            }
            console.log('RESULT:', actionsMap[action]());
            askForAction();
            return;
          } else if (action === 'exit') {
            console.log('Good bye!');
            rl.close();
          } else {
            return 'There is no such an action`';
          }
        });
      };
      askForAction();
    }
  );
};

askForInput();
