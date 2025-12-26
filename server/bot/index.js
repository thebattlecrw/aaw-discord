import 'dotenv/config';

import { Client, GatewayIntentBits } from 'discord.js';
import { google } from 'googleapis';

const client = new Client({ 
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMessages,
    ] 
});

client.once('ready', () => {
    console.log('Le bot est en ligne !');
});


const auth = new google.auth.GoogleAuth({
    keyFile: 'google.json', 
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});


const SPREADSHEET_ID = process.env.SPREADSHEET_ID;

function conversion(content){

    const element = content.split(' ').filter(mot => mot.length > 0).slice(2); 

    const jourInput = element[0]; 
    const heureInput = element[1]

    if (!jourInput || !heureInput) {
        return message.reply("Il manque le jour ou l'heure !");
    }

    const conversionJour = {
        'lundi': 'B',
        'mardi': 'C',
        'mercredi': 'D',
        'jeudi' : 'E',
        'vendredi' : 'F',
    };

    const conversionHeure = {
        '8h' : '2',
        '9h' : '3',
        '10h': '4',
        '11h': '5',
        '12h': '6',
        '13h': '7',
        '14h': '8',
        '15h': '9',
        '16h': '10',
        '17h': '11',
    };

    const colonne = conversionJour[jourInput.toLowerCase()] || jourInput;
    const ligne = conversionHeure[heureInput.toLowerCase()] || heureInput;

    if(!element[2]){
        return [colonne, ligne];
    }
    else{
        return [colonne, ligne, element[2]];
    }
}

client.on('messageCreate', async message => {
    if (message.author.bot) return;

    const texte = message.content;
    let reponse = "";
    let mention;
    switch(texte){
        case '!ping' :
            return message.reply('Pong !');
        case '!wltjosephine' : 
            reponse = "Bonjour je suis Joséphine, voici ma liste de commande : \n - !ping : un classique 🏓 \n - !wlt : présentation du groupe 🧑‍💻👩‍💻🧑‍💻\n- !wltsee : consulter un emploi du temps 🔎🗓️\n - !wltchange : modifier un emploi du temps ✍️🗓️\n - !wlttevin : 💥\n - !wltsebastian : 🔥 \n - !wltjulie : 💅 \n - !wltkarim : 🕶️  \n - !wltclac : ✨\n";
            return message.reply(reponse);
        case '!wlt' :
            reponse = "Notre groupe est composé de :\n - **Julie Tillet** : !wltjulie \n - **Tévin Wincenty** : !wlttevin \n - **Sebastian Lovejoy Black** : !wltsebastian\n\nNous espérons que notre projet vous plaîra.\nPour plus d'informations, tapez la commande *!wltjosephine*.";
            return message.reply(reponse);
        case '!wlttevin' :
            for (let i = 0; i < 15; i++) {
                message.reply("https://tenor.com/view/tester-opossum-gif-21527300");
            }
            return;
        case '!wltjulie' :
            return message.reply("https://tenor.com/view/barbie-pink-gif-25419193");
        case '!wltsebastian' :
            return message.reply("https://tenor.com/view/top-gear-the-grand-tour-gif-24931916");
        case '!wltkarim' :
            return message.reply("Bon courage pour la correction\nhttps://tenor.com/view/dance-moves-gif-9472470858311093882");
        case '!wltclac' :
            const sleep = (ms) => new Promise(r => setTimeout(r, ms));
            await message.reply("https://tenor.com/view/jos%C3%A9phine-josephine-ange-gardien-jos%C3%A9phine-ange-gardien-josephine-ange-gardien-gif-14545491245469233366\nJoséphine a quitté le serveur.");
            await sleep(3000);
            await message.channel.send("Joséphine a rejoint le groupe.");
            return;
    }

    if(texte.startsWith('!wltsee')){
        mention = message.mentions.users.first();
        if (!mention) {
            return message.reply("Mentionner quelqu'un !");
        }

        const cl = conversion(texte);

        try {
            const sheets = google.sheets({ version: 'v4', auth });

            const spreadsheetMeta = await sheets.spreadsheets.get({
                spreadsheetId: SPREADSHEET_ID
            });

            const sheetFound = spreadsheetMeta.data.sheets.find(s => 
                s.properties.title.startsWith(mention.id)
            );

            if (!sheetFound) {
                return message.reply(`Aucune feuille trouvée pour l'ID ${mention}`);
            }

            const nomFeuille = sheetFound.properties.title;

            const monRange = `${nomFeuille}!${cl[0]}${cl[1]}`;

            const res = await sheets.spreadsheets.values.get({
                spreadsheetId: SPREADSHEET_ID,
                range: monRange, 
            });

            const rows = res.data.values;

            if (!rows || rows.length === 0) {
                message.reply("La case est vide !");
            } 
            else {
                const valeur = rows[0][0];
                
                message.reply(` ${valeur}`);
            }
                        
        }
        catch (error) {
            console.error(error);
            message.reply('Je n\'ai pas réussi à accéder au fichier Google ou les données sont invalides.');
        }
    }   

    else if(texte.startsWith('!wltchange')){
        mention = message.mentions.users.first();

        if (!mention) {
            return message.reply("Mentionner quelqu'un !");
        }

        const clc = conversion(texte);

        try {
            const sheets = google.sheets({ version: 'v4', auth });

            const spreadsheetMeta = await sheets.spreadsheets.get({
                spreadsheetId: SPREADSHEET_ID
            });

            const sheetFound = spreadsheetMeta.data.sheets.find(s => 
                s.properties.title.startsWith(mention.id)
            );

            if (!sheetFound) {
                return message.reply(`Aucune feuille trouvée pour ${mention}`);
            }

            const nomFeuille = sheetFound.properties.title;

            const monRange = `${nomFeuille}!${clc[0]}${clc[1]}`;

            await sheets.spreadsheets.values.clear({
                spreadsheetId: SPREADSHEET_ID,
                range: monRange,
            });

            await sheets.spreadsheets.values.append({
                spreadsheetId: SPREADSHEET_ID,
                range: monRange,
                valueInputOption: 'USER_ENTERED',
                resource: {
                    values: [
                        [clc[2]] 
                    ],
                },
            });

            message.reply('Emploi du temps mis à jour');
                        
        }
        catch (error) {
            console.error(error);
            message.reply('Je n\'ai pas réussi à accéder au fichier Google ou es données sont invalides.');
        }
    }
    else{
        return;
    }
});

client.login(process.env.LOGIN);