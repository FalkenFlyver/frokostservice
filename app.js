const { App } = require('@slack/bolt')
const emojis = require('./emojis.js')
const https = require('https')
const ssiparser = require('./ssiparser.js')
const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET
})
function changeTimezone(date, ianatz) {
  var invdate = new Date(
    date.toLocaleString('en-US', {
      timeZone: ianatz
    })
  )
  var diff = date.getTime() - invdate.getTime()
  return new Date(date.getTime() - diff)
}
app.message(async ({ message, say }) => {
  console.log('message', message)

  if (message.text && message.text.toLowerCase() == '!coronatal') {
    let coronaTalMessage = await ssiparser.getCoronaTalData()
    say(coronaTalMessage)
  } else {
    await ParseTextAndAddEmoji(message.text, message.ts)
  }
  let realTs = changeTimezone(
    new Date(message.ts * 1000),
    'Europe/Copenhagen'
  )
  console.log(realTs, ':', message.text)
  if (realTs.getHours() == 13 && realTs.getMinutes() == 37) {
    await app.client.reactions.add({
      channel: mainChannel,
      name: 'l33t',
      timestamp: ts
    })
  }
  if (realTs.getHours() == 16 && realTs.getMinutes() == 20) {
    await app.client.reactions.add({
      channel: mainChannel,
      name: 'weed',
      timestamp: ts
    })
  }
})
ParseTextAndAddEmoji = async (msg, ts) => {
  for (let i = 0; i < emojis.TEXT_AND_EMOJI_LIST.length; i++) {
    let emojiItem = emojis.TEXT_AND_EMOJI_LIST[i]
    regexp = new RegExp(emojiItem[0], 'i')
    if (regexp.exec(msg) != null) {
      console.log('Found emoji: ', emojiItem[1], ' in text: ', msg)
      await app.client.reactions.add({
        channel: mainChannel,
        name: emojiItem[1],
        timestamp: ts
      })
    }
  }
}

testMessage = () => {
  app.client.chat.postMessage({
    channel: mainChannel,
    text: 'En to test'
  })
}

let mainChannel = ''
;(async () => {
  await app.start(process.env.PORT || 22051)
  var channels = await app.client.conversations.list()
  mainChannel = channels.channels.find((x) => {
    return x.name == 'flat-earth'
  }).id
  console.log('⚡️ Bolt app is running!')
})()
