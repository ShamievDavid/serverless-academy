const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');

const token = '';
const apiKey = '';
const bot = new TelegramBot(token, { polling: true });

const KYIV_BUTTON = {
  text: 'Kyiv',
  callback_data: 'Kyiv',
};

const THREE_HOUR_BUTTON = {
  text: '3 hours',
  callback_data: '3',
};

const SIX_HOUR_BUTTON = {
  text: '6 hours',
  callback_data: '6',
};

bot.on('callback_query', (query) => {
  const chatId = query.message.chat.id;

  if (query.data === '3') {
    forecast('Kyiv', chatId, 3);
  } else if (query.data === '6') {
    forecast('Kyiv', chatId, 6);
  }
});

function sendOptions(chatId) {
  bot.sendMessage(chatId, 'Choose interval:', {
    reply_markup: {
      inline_keyboard: [[THREE_HOUR_BUTTON], [SIX_HOUR_BUTTON]],
    },
  });
}

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, 'Choose  city as if there was a chooice:', {
    reply_markup: {
      inline_keyboard: [[KYIV_BUTTON]],
    },
  });
});

bot.on('callback_query', (query) => {
  const chatId = query.message.chat.id;

  if (query.data === 'Kyiv') {
    sendOptions(chatId);
  }
});

function formatData(data) {
  let result = '';
  const days = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];
  const date = new Date(data.dt_txt);
  const dayOfWeek = days[date.getDay()];
  const dayOfMonth = date.getDate();
  const month = date.toLocaleString('default', { month: 'long' });
  const hour = date.getHours();
  const temperature = data.main.temp;
  const feelsLike = data.main.feels_like;
  const isCloudy = data.clouds.all > 0;
  const condition = isCloudy ? 'cloudy' : 'sunny';
  result += `${dayOfMonth}, ${dayOfWeek} ${month}\n${hour}:00, ${temperature}°C, feels like ${feelsLike}°C, ${condition}`;
  return result;
}

function sorting(arr) {
  arr.sort((a, b) => a - b);
}

function forecast(city, chatId, interval) {
  const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;
  axios
    .get(apiUrl)
    .then((response) => {
      let message = [];
      const weatherForecast = response.data.list;
      if (interval === 6) {
        weatherForecast.map((e, index) => {
          if (index % 2 === 0) {
            message.push(formatData(e));
          }
        });

        bot.sendMessage(chatId, message.join('\n\n'));
      }
      if (interval === 3) {
        weatherForecast.forEach((e) => {
          message.push(formatData(e));
        });

        bot.sendMessage(chatId, message.join('\n\n'));
      }
    })
    .catch((error) => {
      bot.sendMessage(chatId, 'Error while getting the forecast');
      console.error(error);
    });
}
