const CONFIG = require("../config/config");
const CONSTANTS = require("../config/constants");
const request = require("request");
const isImageURL = require("valid-image-url");
require("dotenv").config();

async function parseImageURL(msg, args) {
    if (!CONFIG.SystemConfig.servers[msg.guildID]) return `Your server is not configured. First configure the server with the bot using \`.config\``;
    else if (!CONFIG.SystemConfig.servers[msg.guildID].premium) return `Your server must be registered with the bot as a premium server to use that feature.`;
    let url;
    if (args[0]) url = args[0];
    else if (msg.attachments.length > 0) url = msg.attachments[0].url;
    else return `You must attach either an image or URL to scan.`;
    if (!await isImageURL(url)) return {
        embed: {
            title: `Parse Failed`,
            description: `The string \`${url}\` is not a valid image URL. Image URLs should end in .png or .jpg for best performance.`,
            color: 0xff0000
        }
    }
    let voiceChannel = msg.member.voiceState.channelID ? CONSTANTS.bot.getChannel(msg.member.voiceState.channelID) : null;
    if (!voiceChannel) {
        return {
        embed: {
            title: `Parse Failed`,
            description: `You must be in a voice channel for the .parse command to work.`,
            color: 0xff0000
        }
    }
}
    else {
        let parsingMessage = await CONSTANTS.bot.createMessage(msg.channel.id, {
            embed: {
                title: "Parsing...",
                color: 3145463
            }
        })
        request("https://api.ocr.space/parse/imageurl?apikey=" + process.env.OCRAPIKEY + "&url=" + url, {json:true}, async (err, res, body) => {
            if (err) {
                CONSTANTS.bot.createMessage(msg.channel.id, `Something went wrong with that operation [1]`);
                console.log("> [PARSE ERROR] ");
                console.log(err);
                return;
            }
            else if (body.error || !body.ParsedResults[0]) {
                CONSTANTS.bot.createMessage(msg.channel.id, `Something went wrong with that operation [2]`);
                console.log("> [PARSE ERROR] ");
                console.log(body.error?body.error:body.ParsedResults);
                return;
            }

            let voiceChannelMemberNames = voiceChannel.voiceMembers.map(
                member => member.nick ? member.nick.toLowerCase().replace(/[^A-Za-z]/g , "") : member.username.toLowerCase().replace(/[^A-Za-z]/g , ""));
            let parsedText = body.ParsedResults[0].ParsedText.toString();
            parsedText = parsedText.replace(/,/g, ``);
            parsedText = parsedText.replace(/\r\n/g, ` `);
            let outputText = parsedText.split(" ").filter(name => !voiceChannelMemberNames.includes(name.toLowerCase()));
            outputText.shift();
            outputText.shift();
            outputText.shift();
            CONSTANTS.bot.createMessage(msg.channel.id, {
                embed: {
                    title: `Parsed Results`,
                    description:
                    `The following users are not in your voice channel:
                    \`\`\`${outputText.join(", ")}\`\`\`
                    
                    `,
                    color: 3145463
                }
            })
        })
    }
}

exports.parseImageURL = parseImageURL;

exports.helpCommand = 
`Parse Image Command

**Usage**: \`${CONSTANTS.botPrefix}parse <image url / image file>\`.
You must be in a voice channel to use this command.

**<image url / image file>**: Either a url to a valid image or a link to an image.

_Recommended use: use snipping tool / mac screenshot to take image of /who, then paste or drag image into discord window and send with ${CONSTANTS.botPrefix}parse command._

Example: \`${CONSTANTS.botPrefix}parse http://i.imgur.com/fwxooMv.png\`
`