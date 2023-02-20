import inquirer from "inquirer";
import fs from "fs";

const questions = [
  {
    type: "input",
    message: "Enter the user's name[press Enter to stop adding users]: ",
    name: "name",
  },
  {
    type: "list",
    message: "Choose your gender:",
    name: "gender",
    choices: ["Female", "Male", "Non-Binar"],
  },
  {
    type: "input",
    message: "Enter your age: ",
    name: "age",
    validate: (input) => {
      if (!isNaN(input) && input >= 0) {
        return true;
      }
      return "Age must be a number and can't be less than 0.";
    },
  },
];

const questionDB = {
  type: "confirm",
  name: "search",
  message: "Do you want to search for a user in the database?",
};

const askForSearch = {
  type: "input",
  name: "name",
  message: "Enter users name that you want to find:",
};

const app = async () => {
  let users = [];

  try {
    const data = fs.readFileSync("users.txt");
    users = JSON.parse(data.toString());
  } catch (e) {
    console.error(e);
  }

  let stop = false;

  while (!stop) {
    const stepOne = await inquirer.prompt([questions[0]]);
    const { name } = await stepOne;

    if (!stepOne.name) {
      stop = true;
      break;
    }

    const stepTwo = await inquirer.prompt([questions[1]]);
    const { gender } = await stepTwo;

    const stepThree = await inquirer.prompt([questions[2]]);
    const { age } = await stepThree;

    users.push({ name, gender, age });
  }

  fs.writeFileSync("users.txt", JSON.stringify(users));

  const { search } = await inquirer.prompt([questionDB]);

  if (search) {
    const { name } = await inquirer.prompt([askForSearch]);

    const searchUsers = users.filter(
      (user) => user.name.toLowerCase() === name.toLowerCase()
    );

    if (!searchUsers.length) {
      console.log("nobody founded");
    } else {
      console.log(searchUsers[0]);
    }
  }
  console.log("users", users);
  console.log("Good bye!")
};

app();
