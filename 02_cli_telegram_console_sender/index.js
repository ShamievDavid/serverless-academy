const TelegramApi = require('node-telegram-bot-api');
const program = require('commander');
const fs = require('fs');

const token = '6177559242:AAGiF_suLcZ_l2l47b_mxiE3W6SwiVnA-Ow';
const chatId = '381898389';

const bot = new TelegramApi(token, { polling: true });

program
  .command('send-message <text>')
  .description('Send a message to a chat')
  .action((text) => {
    bot
      .sendMessage(chatId, text)
      .then(() => process.exit())
      .then(() => console.log('Message sent succesfully!'));
  });

program
  .command('send-photo <path>')
  .description('Send a photo to a chat')
  .action((path) => {
    fs.readFile(path, (err, photo) => {
      if (err) {
        console.log('Error: Could not read file.');
        process.exit();
      }
      bot
        .sendPhoto(chatId, photo)
        .then(() => console.log('Photo sent successfully!'))
        .then(() => process.exit());
    });
  });

program.parse(process.argv);
