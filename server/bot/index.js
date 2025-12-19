import "secret.js"

const { Client, GatewayIntentBits } = require('discord.js');
const { google } = require('googleapis');

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




client.on('messageCreate', async message => {
    if (message.author.bot) return;

    const texte = message.content;

    if (texte === '!ping') {
        message.reply('Pong !');
    }

    if(texte === '!wltjosephine'){
        const reponse = "Bonjour je suis Joséphine, voici ma liste de commande : \n - !ping : un classique 🏓 \n - !wlt : présentation du groupe 🧑‍💻👩‍💻🧑‍💻\n- !wltsee : consulter un emploi du temps \n - !wltchange : modifier un emploi du temps \n - !wlttevin : crise existentielle 💥\n - !wltsebastian : ??? \n - !wltjulie : barbie 💅 \n - !wltkarim : (boss) \n - !wltclac : surprise\n";
        return message.reply(reponse);
    }

    

    const element = texte.split(' ').filter(mot => mot.length > 0).slice(2); 

    const jourInput = element[0]; 
    const heureInput = element[1]

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

    if (texte.startsWith('!wltsee')) {
        if (!jourInput || !heureInput) {
            return message.reply("Il manque le jour ou l'heure !");
        }

        const mention = message.mentions.users.first();
        if (!mention) {
            return message.reply("Mentionner quelqu'un !");
        }

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

            const monRange = `${nomFeuille}!${colonne}${ligne}`;

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

    if(texte.startsWith('!wltchange')){
        if (!jourInput || !heureInput) {
            return message.reply("Il manque le jour ou l'heure !");
        }

        const contenu = element[2];
        const mention = message.mentions.users.first();
        if (!mention) {
            return message.reply("Mentionner quelqu'un !");
        }

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

            const monRange = `${nomFeuille}!${colonne}${ligne}`;
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
                        [contenu] 
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

});