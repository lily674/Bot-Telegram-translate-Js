import TelegramBot from "node-telegram-bot-api";
import translate from "translate";

const token = process.env.BOT_TOKEN;

const bot = new TelegramBot(token, { polling: true });
let allUsers = {};
let languages = [
    ["English", "Arabic", "French"],
    ["German", "Spanish", "Italian"],
    ["Russian", "Chinese", "Japanese"],
    ["Korean", "Portuguese", "Dutch"],
    ["Swedish", "Norwegian", "Danish"],
    ["Finnish", "Turkish", "Greek"],
    ["Hebrew", "Hindi", "Urdu"],
    ["Persian", "Thai", "Polish"],
    ["Czech", "Hungarian", "Romanian"],
    ["Serbian", "Croatian", "Bulgarian"],
    ["Slovak", "Lithuanian", "Latvian"],
    ["Estonian", "Slovenian", "Maltese"],
    ["Irish", "Welsh", "Scots Gaelic"],
    ["Basque", "Catalan", "Galician"],
    ["Icelandic", "Albanian", "Macedonian"],
    ["Belarusian", "Bosnian", "Malay"],
    ["Indonesian", "Tagalog", "Vietnamese"],
    ["Esperanto", "Haitian Creole", "Latin"],
    ["Maori", "Samoan", "Tongan"],
    ["Fijian", "Hawaiian", "Cherokee"],
];

let isCorrectLanguage = (userText) =>
    languages.find((row) => row.find((language) => language === userText));

let welcomeMessage = `Welcome to the Translator Bot! ✨
     I'm here to help you translate text between different languages. 
     Just send me the text you want to translate and let's get started! ✨`;

let aboutMessage = `Hi, I'm Raed Al Masri, a programmer. You can find me on:
    - Telegram:  https://t.me/RAED_AL_Masri 
    - LinkedIn:  https://www.linkedin.com/in/raed-al-masri-445b4b292/ 
    - Github:    https://github.com/raedAlmasriIt 
    - WhatsApp:  https://wa.me/9630988720553`;

bot.on("message", async (msg) => {
    const chatId = msg.chat.id;
    let userText = msg.text;

    // ! commands
    if (userText.toLowerCase() === "/start") {
        return bot.sendPhoto(chatId, "./icon.jpg", {
            caption: welcomeMessage,
            reply_markup: { remove_keyboard: true },
        });
    } else if (userText.toLowerCase() === "/about") {
        return bot.sendPhoto(chatId, "./raed.png", {
            caption: aboutMessage,
            reply_markup: {
                reply_markup: { remove_keyboard: true },

                inline_keyboard: [
                    [
                        {
                            text: "Telegram",
                            url: "https://t.me/RAED_AL_Masri",
                        },
                        {
                            text: "WhatsApp",
                            url: "https://wa.me/9630988720553",
                        },
                    ],
                    [
                        {
                            text: "LinkedIn",
                            url: "https://www.linkedin.com/in/raed-al-masri-445b4b292/",
                        },
                        {
                            text: "Github",
                            url: "https://github.com/raedAlmasriIt",
                        },
                    ],
                ],
            },
        });
    } else if (userText.toLowerCase() === "/settargetarabic") {
        allUsers[chatId] = { sourceLang: "English", targetLang: "Arabic" };
        return bot.sendMessage(chatId, "Success Changed ✅✨", {
            reply_markup: {
                remove_keyboard: true,
            },
        });
    } else if (userText.toLowerCase() === "/settargetenglish") {
        allUsers[chatId] = { sourceLang: "Arabic", targetLang: "English" };
        return bot.sendMessage(chatId, "Success Changed ✅✨", {
            reply_markup: {
                remove_keyboard: true,
            },
        });
    } else if (userText.toLowerCase() === "/change")
        delete allUsers[`${chatId}`];

    if (
        allUsers[chatId] &&
        allUsers[chatId].sourceLang &&
        allUsers[chatId].targetLang
    ) {
        // for trans
        // Check if the user has already chosen languages
        const sourceLang = allUsers[chatId].sourceLang;
        const targetLang = allUsers[chatId].targetLang;

        bot.sendMessage(
            chatId,
            await translateTo(msg.text, sourceLang, targetLang)
        );
    } else if (!allUsers[chatId]) {
        allUsers[chatId] = {};
        // If the user has chosen a source language but not a target language, ask them to do so
        return bot.sendMessage(
            chatId,
            "1️⃣  Please choose the source languages:",
            {
                reply_markup: {
                    keyboard: languages,
                    resize_keyboard: true,
                },
            }
        );
    } else if (allUsers[chatId] && !allUsers[chatId].sourceLang) {
        if (isCorrectLanguage(userText)) {
            allUsers[chatId] = { sourceLang: userText };
        } else
            return bot.sendMessage(chatId, `Please select one of the options`, {
                reply_markup: {
                    keyboard: languages,
                    resize_keyboard: true,
                },
            });

        return bot.sendMessage(
            chatId,
            "2️⃣  Please choose the target languages : ",
            {
                reply_markup: {
                    keyboard: languages,
                    resize_keyboard: true,
                },
            }
        );
    } else if (
        allUsers[chatId] &&
        allUsers[chatId].sourceLang &&
        !allUsers[chatId].targetLang
    ) {
        if (userText === allUsers[chatId].sourceLang)
            return bot.sendMessage(
                chatId,
                `Please select different source language  `,
                {
                    reply_markup: {
                        keyboard: languages,
                        resize_keyboard: true,
                    },
                }
            );
        else if (isCorrectLanguage(userText)) {
            allUsers[chatId].targetLang = userText;

            return bot.sendMessage(chatId, `success changed ✅✨`, {
                reply_markup: {
                    remove_keyboard: true,
                },
            });
        } else
            return bot.sendMessage(chatId, `Please select one of the options`, {
                reply_markup: {
                    keyboard: languages,
                    resize_keyboard: true,
                },
            });
    }
});

console.log("Successfully running bot ✅✨");

const translateTo = async (msg, sourceLang, targetLang) => {
    translate.engine = "google";

    const text = await translate(msg, {
        from: sourceLang,
        to: targetLang,
    });

    return text;
};
bot.onText(/\/echo language/, (msg, match) => {
    const chatId = msg.chat.id;
    const resp = match[0];

    bot.sendMessage(chatId, resp);
});

export default bot;
