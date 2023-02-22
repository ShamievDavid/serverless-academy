const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');
const NodeCache = require('node-cache');

const cache = new NodeCache({ stdTTL: 60 });
const token = '';
const PRIVAT_BANK_API =
  'https://api.privatbank.ua/p24api/pubinfo?json&exchange&coursid=5';
const MONOBANK_API = 'https://api.monobank.ua/bank/currency';

const bot = new TelegramBot(token, { polling: true });

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(
    chatId,
    'Welcome to the exchange rate bot!',
    {
      reply_markup: {
        inline_keyboard: [
          [
            { text: 'USD', callback_data: 'usd' },
            { text: 'EUR', callback_data: 'eur' },
          ],
        ],
      },
    }
  );
});

bot.on('callback_query', (query) => {
  const chatId = query.message.chat.id;

  if (query.data === 'usd') {
    privatBankGetRates(PRIVAT_BANK_API, chatId, 'USD');
  }

  if (query.data === 'eur') {
    monobankGetRates(MONOBANK_API, chatId);
  }
});

async function privatBankGetRates(url, chatId, currencyName) {
  try {
    const response = await axios.get(url);
    const usdRate = response.data.find((rate) => rate.ccy === currencyName);

    bot.sendMessage(
      chatId,
      `${currencyName}: ${usdRate.buy} / ${usdRate.sale}`
    );
  } catch (error) {
    console.error(error);

    bot.sendMessage(
      chatId,
      'An error occurred while getting the rates. Please try again later.'
    );
  }
}

async function monobankGetRates(url, chatId) {
  const cachedData = cache.get('eurRate');
  console.log(cachedData);
  if (cachedData) {
    bot.sendMessage(
      chatId,
      `EUR: ${cachedData.rateBuy} / ${cachedData.rateSell}`
    );
    return;
  }

  try {
    const response = await axios.get(url);
    console.log('response data', response.data);
    const eurRate = response.data.find(
      (rate) => rate.currencyCodeA === 978 && rate.currencyCodeB === 980
    );
    cache.set('eurRate', eurRate);
    bot.sendMessage(chatId, `EUR: ${eurRate.rateBuy} / ${eurRate.rateSell}`);
  } catch (error) {
    console.error(error);
    bot.sendMessage(
      chatId,
      'An error occurred while getting the EUR exchange rate. Please try again later.'
    );
  }
}
