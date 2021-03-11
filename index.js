// Enable the ability to log chat and commands, just like Java server.
// soraboken / Rosetta Emerson (c) 2021
console.log("[LOGGER] Prepare logging, please wait...!");
import { command, nethook, MinecraftPacketIds } from 'bdsx';

nethook.before(MinecraftPacketIds.Text).on((packet, networkIdentifier) => {
    const name = packet.name;
    const message = packet.message;
    console.log(`[LOGGER] <${name}> ${message}`);
});

nethook.after(MinecraftPacketIds.Login).on((ptr, networkIdentifier, packetId) => {
    const ip = networkIdentifier.getAddress();
    const cert = ptr.connreq.cert;
    const name = cert.getId();
    console.log(`[INFO] ${name} @ ${ip} connecting...`);
});

command.hook.on((commandText, origin) => {
  if ( origin.includes(["Script Engine", "Server"])) return;
  console.log(`[LOGGER] ${origin} executed: ${commandText}`);
});