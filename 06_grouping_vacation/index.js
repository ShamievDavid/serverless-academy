const axios = require('axios');
const fs = require('fs');

const url = 'https://jsonbase.com/sls-team/vacations';

axios
  .get(url)
  .then((response) => {
    const data = response.data;

    const users = {};

    // Group the vacation records by user
    data.forEach((vacation) => {
      const userId = vacation.user._id;
      const userName = vacation.user.name;
      const vacationRecord = {
        startDate: vacation.startDate,
        endDate: vacation.endDate,
      };
      if (!users[userId]) {
        users[userId] = {
          userId,
          userName,
          vacations: [vacationRecord],
        };
      } else {
        users[userId].vacations.push(vacationRecord);
      }
    });

    const result = Object.values(users);
    fs.writeFileSync('result.json', JSON.stringify(result, null, 2));
  })
  .catch((error) => {
    console.log(error);
  });
