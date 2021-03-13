import { Actor, command, NetworkIdentifier } from "bdsx";
import { DataById, XuidByName, IdByName, sendText } from "./modules/2913Module";
//import { teleport } from "./modules/dimtp";
import { connectionList } from "./modules/playerlist";
import fs = require("fs");

const dbFile = "homedb.json";
let system = server.registerSystem(0, 0);

console.log("[Home] Loading database...");
// structure of homeDB:
/* 
  playerXuid {
    homeName: {
      x, y, z, dim
    }
  }
*/
let homeDB : any = {};

// load db on start
fs.readFile(dbFile, (err, data: any) =>{
    console.log('[Home] Database loaded.');
    if (data){
        homeDB = JSON.parse(data);
    }
});

function saveHomeDB(){
  let filedata = JSON.stringify(homeDB);
    fs.writeFile(dbFile, filedata, () => {
      console.log('[Home] Database successfully saved.');
    });
  }

// save db every 10 minutes
const saveDelay = 600000; //ms
let DbInterval = setInterval(saveHomeDB, saveDelay);

// stop saving after shutdown
system.shutdown = function(){
  clearInterval(DbInterval);
  console.log("[Home] Database saving task stopped.")
}

// listen for commands
command.hook.on((cmd: string, origin: any) => {
  const params = cmd.split(' ');
  const xuid = XuidByName(origin);
  const pNetid = IdByName(origin);
  const homeName = params[1] || "home";
  // process the database
  homeDB[xuid] = homeDB[xuid] || {};
  
  if ( params[0] == "/sethome" ) {
    // taken from randommouse/bdsx-scripts
    let originActor = connectionList.nXNet.get(origin).getActor();
    let originEntity = connectionList.n2Ent.get(origin);
    let originPosition = system.getComponent(originEntity, MinecraftComponent.Position)
    let originXuid = connectionList.nXXid.get(origin);
    let dimId = originActor.getDimension();
    let x = originPosition!.data.x;
    let y = originPosition!.data.y;
    let z = originPosition!.data.z;
    
    let homeData = {
      x: x,
      y: y,
      z: z,
      dimId: dimId
    }
    homeDB[xuid][homeName] = homeData;
    sendText(pNetid, `Your home §o${homeName} §ris successfully set!`, 0);
    return 0;
  }
  
  if ( params[0] == "/homelist" ) {
    let homeList = Object.keys(homeDB[xuid]);
    if ( homeList.length > 0 ) sendText(pNetid, `Your available homes: ${homeList.join(", ")}`, 0);
    else sendText(pNetid, `No home available. Try /sethome to set your first home!`, 0);
    return 0;
  }
  
  if ( params[0] == "/home" ) {
    const homeData = homeDB[xuid][homeName];
    if ( homeData == undefined ) {
      sendText(pNetid, `§4${homeName} does not exist.`, 0);
      return 0;
    }
    let originActor = connectionList.nXNet.get(origin).getActor();
    let dimIdLive = originActor.getDimension();
    const dimId = homeData.dimId;
    if ( dimId != dimIdLive ) {
      sendText(pNetid, `§4Due to technical limitation, you have to be in the same dimension you set with your home in order to teleport.§8§o(dimId: ${dimId})`, 0);
      return 0;
    }
    const x = homeData.x;
    const y = homeData.y;
    const z = homeData.z;
    //teleport(origin, {x: x, y: y, z: z}, dimId);
    system.executeCommand(`tp "${origin}" ${x} ${y} ${z}`, () => {});
    sendText(pNetid, `Teleported you to §o${homeName}`, 0);
    return 0;
  }
});

console.log("[Home] Initialized.")

