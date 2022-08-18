importScripts("Dock/socket.io.js");
importScripts("Dock/ServerAddress.js");
importScripts("Dock/DockWorker.js");

/* INITIALIZE */

console.log(`⚓  Initializing Dock shared worker`);

const dock = new DockWorker(io, SERVER_ADDRESS);
onconnect = dock.WwClientPortConnected;
