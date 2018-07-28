const Discord = require('discord.js');
const client = new Discord.Client({autoReconnect:true});
var Stream = "http://stream.radiohamburg.de/rhh-live/mp3-192/stream.radiohamburg.de/";
var previousplaying = "none";
var nowplaying = "by hazard";
var artist = "";
var opus = require('node-opus');
var internetradio = require('node-internet-radio');
const ms = require('ms');
var songcount = 0;

var rate = 96000;
var encoder = new opus.OpusEncoder(rate);


// Create an event listener for messages
client.on('message', message => {
    if (message.content === 'gh!entrar') {
      if(message.member.status != 'offline') {
        if (message.member.voiceChannel) {       
            message.member.voiceChannel.join()
            .then(connection => { // Connection is an instance of VoiceConnection
                //message.reply('Im there m8!');

                message.channel.send({embed: {
                  color: 3211008,
                  author: {
                    name: "Guardião do Hazard entrou",
                    icon_url: client.user.avatarURL
                  },
                  title: " ",
                  url: "http://www.DELUUXE.NL/",
                  description: "Eu entrei na sala, caso queira que eu saia digite gh!sair",
                  fields: [{
                      name: "Tocando agora:",
                      value: "http://radiohamburg.de/"
                    },
                    {
                      name: "Ajuda!",
                      value: "If you hear nothing or the bot doesnt join, please join this server http://discord.gg/nzbG5eR"
                    },
                  ],
                  timestamp: new Date(),
                  footer: {
                    icon_url: client.user.avatarURL,
                    text: "Criado por Hazard"
                  },
                }});

                connection.playStream("http://stream.radiohamburg.de/rhh-live/mp3-192/stream.radiohamburg.de/");
                //console.log('playing in new channel');
                console.log('tocando no canal ' + message.member.voiceChannel.name + '. No servidor: ' + message.guild.name + '.');
            })
            .catch(console.log);
            } else {
            message.reply('Você precisa estar em um canal primeiro!');
        }
      } else {
        message.reply("please go online before asking that!");
      }
    }
    if (message.content === 'gh!sair') {
        if ((message.guild.voiceConnection) && (message.member.voiceChannel)) {
            message.guild.voiceConnection.disconnect();
            message.channel.send({embed: {
              color: 16711712,
              author: {
                name: "Guardião do Hazard saiu",
                icon_url: client.user.avatarURL
              },
              title: " ",
              url: "http://www.DELUUXE.NL/",
              description: "Eu sai do canal, caso queira que eu volte digite gh!entrar",
              fields: [{
                  name: "Help!",
                  value: "for any question and/or issues, please join this server http://discord.gg/nzbG5eR"
                },
              ],
              timestamp: new Date(),
              footer: {
                icon_url: client.user.avatarURL,
                text: "Criado por Hazard"
              },
            }});
            //client.guilds.get('266614161868324865').channels.get('382125620286717952').send('disconnected from a channel: ' + message.member.voiceChannel.name + '. On server: ' + message.guild.name + '.');
            console.log('sai do canal: ' + message.member.voiceChannel.name + '. On server: ' + message.guild.name + '.');
        } else if (!(message.member.voiceChannel)) {
            message.reply('Você não está em um canal!');
        } else {
            message.reply('Não posso sair de um canal que não estou conectado.');
        }
    }
    if (message.content === 'gh!ajuda') {
        message.channel.send({embed: {
            color: 3447003,
            author: {
              name: client.user.username,
              icon_url: client.user.avatarURL
            },
            title: "Guardião do Hazard ajuda",
            url: "http://www.DELUUXE.NL/",
            description: "Todos os comandos utilizaveis por mim.",
            fields: [{
                name: "gh!entrar",
                value: "Comando para eu entrar no seu canal e tocar música o dia inteiro."
              },
              {
                name: "gh!sair",
                value: "Comando para eu sair do canal em que estou conectado."
              },
              {
                name: "gh!info",
                value: "Comando para ajuda."
              },
            ],
            timestamp: new Date(),
            footer: {
              icon_url: client.user.avatarURL,
              text: "Criado por Hazard"
            },
          }
        });
    }
    if (message.content === 'gh!info') {
        message.channel.send({embed: {
            color: 3447003,
            author: {
              name: client.user.username,
              icon_url: client.user.avatarURL
            },
            title: "Guardião do Hazard informações",
            url: "http://www.DELUUXE.NL/",
            description: "Estas são as informações de mim.",
            fields: [{
                name: "Contador de Servidores",
                value: "No momento estou conectado em " + client.guilds.size + " servidores."
              },
              {
                name: "Uptime",
                value: "Eu estou funcionando por " + ms(client.uptime, { long: true }) + "."
              },
              {
                name: "Usuarios",
                value: "Estou transmitindo alegria para " + client.users.size + " usuarios no momento."
              },
              {
                name: "Connected voicechannel count",
                value: "Estou conectado em " + client.voiceConnections.size + " canais de voz."
              },
              {
                name: "Ping",
                value: "No momento a minha conexão esta com " + Math.round(client.ping) + "ms."
              },
            ],
            timestamp: new Date(),
            footer: {
              icon_url: client.user.avatarURL,
              text: "Criado por Hazard"
            },
        }
        });
    }
});

const intervalHandler = function (){
  client.channels.filter(c => c.type === 'voice' && c.members.has(client.user.id)).forEach(async (chan)  => {
    await chan.leave();
    chan.join().then(connection => { connection.playStream("http://stream.radiohamburg.de/rhh-live/mp3-192/stream.radiohamburg.de/"); });
  });
}


client.on('ready', () => {
    console.log("Estou conectado em " + client.guilds.size + " servers!");
    console.log('Estou pronto!'); 
    console.log("Conectei no canal " + client.guilds.map(g => g.name));
    client.user.setStatus('online');
    client.user.setActivity("alegria para + "client.users.size +" usuários | "+ client.guilds.size +" Servidores", { type: 'PLAYING' });

    client.channels.filter(c => c.type === 'voice' && c.members.has(client.user.id)).forEach(async (chan)  => {
      await chan.leave();
      chan.join().then(connection => { connection.playStream("http://stream.radiohamburg.de/rhh-live/mp3-192/stream.radiohamburg.de/"); });
    });

    var interval = setInterval (intervalHandler, 900000); // time between each interval in milliseconds
});

client.login(process.env.TOKEN);
