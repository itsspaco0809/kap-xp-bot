const Discord = require('discord.js');
const random = require('random');
const fs = require('fs');
const jsonfile = require('jsonfile');


const bot = new Discord.Client();

var stats = {};
if (fs.existsSync('stats.json')) {
    stats = jsonfile.readFileSync('stats.json');
}

bot.on('message', (message) => {
    if (message.author.id == bot.user.id)
        return;

    if (message.guild.id in stats === false) {
        stats[message.guild.id] = {};
    }

    const guildStats = stats[message.guild.id];
    if (message.author.id in guildStats === false) {
        guildStats[message.author.id] = {
            xp: 0,
            level: 0,
            last_message: 0
        };
    }

    const userStats = guildStats[message.author.id];
    if (Date.now() - userStats.last_message > 1000) {
        userStats.xp += random.int(15, 25);
        userStats.last_message = Date.now();

        const xpToNextLevel = 5 * Math.pow(userStats.level, 2) + 50 * userStats.level + 100;
        if (userStats.xp >= xpToNextLevel) {
            userStats.level++;
            userStats.xp = userStats.xp - xpToNextLevel;
            message.channel.send(message.author.username + ' has reached level ' + userStats.level);
        }

        jsonfile.writeFileSync('stats.json', stats);

        console.log(message.author.username + ' now has ' + userStats.xp);
        console.log(xpToNextLevel + ' XP needed for next level.');

    }
    const parts = message.content.split(' ');

    if (parts[0] === '!hello') {
        message.reply('hi');
    }
});

bot.login('ODMxNzIwMTYyNTk5MzcwNzg1.YHZVww.ejPGXT9_EnQa8_m1QD09V-7LZlw');