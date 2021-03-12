import { Actor, command, NetworkIdentifier } from "bdsx";
import { DataById, XuidByName, IdByName, sendText } from "./2913Module";
import { teleport } from "./dimtp";
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

// save db after shutdown
system.shutdown = function(){
    let filedata = JSON.stringify(homeDB);
        fs.writeFile(dbFile, filedata, () => {
            console.log('[Home] Database successfully saved.');
        });
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
    sendText(pNetid, `Your home §o${homeName} is successfully set!`, 0);
    return 0;
  }
  
  if ( params[0] == "/home" ) {
    const homeData = homeDB[xuid][homeName];
    const dimId = homeData.dimId;
    const x = homeData.x;
    const y = homeData.y;
    const z = homeData.z;
    teleport(origin, {x: x, y: y, z: z}, dimId)
    sendText(pNetid, `Teleported you to §o${homeName}`, 0);
    
    return 0;
  }
});

console.log("[Home] Initialized.")

