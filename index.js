const socketIO = require(`socket.io-client`);
const config = require(`./config.json`);

let username = config.username;
let token = config.token;
let prefix = config.prefix;

client = socketIO(`https://omapi.ru/`);

client.on(`connect`,

    async() => {
        console.log(`успешное подключение!`);

        let response = await fetch(`https://omapi.ru/api/user/getSocketAccess/?token=${token}&username=${username}`);
        let reponseJson = await response.json();
        let accessToken = reponseJson.result;

        client.emit(`createSocketConnection`, username, token, accessToken,
            () => {

                console.log(`успешный вход!`);

                client.on("onChatMessage",

                    async(username, message, messageID) => {

                        if (message == `${prefix}getHotness`) {

                            let getHotness = await fetch(`https://omapi.ru/api/user/getStreamHotness?token=${token}&username=${username}`);
                            let hotnessJson = await getHotness.json();

                            client.emit(`createChatMessage`, `на данный момент популярность стрима: ${hotnessJson.result}`, console.log);
                        };
                    }
                );

                client.on("onChatDonateMessage",
                    (username, message, value, messageID) => {

                        client.emit(`createChatMessage`, `ого! это кто тут у нас закинул ${value} жетонов? спасибо ${username}!`, console.log);
                    }
                );

                client.on("onNewFollower",
                    () => {
                        client.emit(`createChatMessage`, `спасибо за подписку ${username}!`, console.log);
                    }
                )
            }
        );
    }
);