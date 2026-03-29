const {Client}=require('discord.js-selfbot-v13');

const WebSocket=require('ws');



const TOKEN=process.env.TOKEN;

const CHANNEL='1401775181025775738';

const WS_URL='wss://free.blr2.piesocket.com/v3/1?api_key=q55tCAaMdppkFY39hA2h2ebJHAQiv3a4C5824jcy&notify_self=1';



let ws;

function conectarWS(){

    ws=new WebSocket(WS_URL);

    ws.on('open',()=>console.log('WS conectado'));

    ws.on('close',()=>{console.log('WS desconectado, reconectando...');setTimeout(conectarWS,3000)});

    ws.on('error',(e)=>console.log('Error WS:',e.message));

}



const client=new Client();

client.once('ready',()=>{

    console.log('Bot listo: '+client.user.tag);

    conectarWS();

});



client.on('messageCreate',(m)=>{

    if(m.channelId!==CHANNEL)return;

    if(!m.embeds||m.embeds.length===0)return;

    const fields={};

    m.embeds[0].fields.forEach(f=>{fields[f.name]=f.value});

    const payload=JSON.stringify({

        name:fields['\uD83C\uDFF7\uFE0F Name']||fields['Name']||'Unknown',

        money:(fields['\uD83D\uDCB0 Money per sec']||fields['Money per sec']||'0').replace(/\*\*/g,''),

        jobid:(fields['Job ID (Mobile)']||fields['ID']||'').replace(/`/g,'').trim()

    });

    if(ws&&ws.readyState===1){

        ws.send(payload);

        console.log('Enviado:',payload);

    }

});



client.login(TOKEN);
