const { App } = require('@slack/bolt');
const emojis = require('./emojis.js');
const https = require('https');
const ssiparser = require('./ssiparser.js');
// Initializes your app with your bot token and signing secret
const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET
});
// Reverse all messages the app can hear
app.message(async ({ message, say }) => {
  console.log('message', message);

  if (message.text == '!coronatal') {
    let coronaTalMessage = await ssiparser.getCoronaTalData();
    say(coronaTalMessage);
  } else {
    await ParseTextAndAddEmoji(message.text, message.ts);
  }
  //await say(reversedText);
});
ParseTextAndAddEmoji = async (msg, ts) => {
  for (let i = 0; i < emojis.TEXT_AND_EMOJI_LIST.length; i++) {
    let emojiItem = emojis.TEXT_AND_EMOJI_LIST[i];
    regexp = new RegExp(emojiItem[0]);
    if (regexp.exec(msg) != null) {
      console.log('Found emoji: ', emojiItem[1], ' in text: ', msg);
      await app.client.reactions.add({
        channel: mainChannel,
        name: emojiItem[1],
        timestamp: ts
      });
    }
  }
};

testMessage = () => {
  app.client.chat.postMessage({
    channel: mainChannel,
    text: 'En to test'
  });
};

let mainChannel = '';
(async () => {
  // Start your app
  await app.start(process.env.PORT || 22051);
  var channels = await app.client.conversations.list();
  mainChannel = channels.channels.find((x) => {
    return x.name == 'flat-earth';
  }).id;

  //testMessage();
  console.log('⚡️ Bolt app is running!');
})();
