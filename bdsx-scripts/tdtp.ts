//------------------------------------------------------------------------------//
//                          Transdimenstion Teleport                            //
//                               script for BDSX                                //
//                              (tdtp.ts/tdtp.js)                               //
//                         by randommouse/madeofstown                           //
//------------------------------------------------------------------------------//
//                                Use/Function:                                 //
//                     Teleport Players Across Dimensions                       //
//------------------------------------------------------------------------------//
//                          Required Custom Scripts:                            //
//                         plyerlist.ts/playerlist.js                           //
//                         Recommended Custom Scripts:                          //
//                              index.ts/index.js                               //
//------------------------------------------------------------------------------//
//                   Thansks to P Jai Rjlin and their work @                    //
// https://github.com/Rjlintkh/bdsx-scripts/blob/main/scripts/minecraftFunctions.ts  //
//------------------------------------------------------------------------------//

import { Actor, command, NativeModule, RawTypeId } from "bdsx";
import { connectionList } from "./playerlist";
import { makefunc } from "bdsx/core";
import { SetTitlePacket } from "bdsx/bds/packets";


let system: any = server.registerSystem(0,0);
export const changeDimension = makefunc.js(NativeModule.get(null).add(0xCD3FF0),RawTypeId.Void, null, Actor, RawTypeId.Int32, RawTypeId.Boolean);

// EXPORTED tdTeleport function
export function tdTeleport(playerName: string, dimId: number/* 0=overworld, 1=nether, 2=end */, x: any, y: any, z: any) {
    let netId = connectionList.nXNet.get(playerName);
    let actor = netId.getActor();
    changeDimension(actor, dimId, false);
    
    setTimeout(function(){
        system.executeCommand(`execute ${playerName} ~ ~ ~ tp @s ${x} ${y} ${z}`, () => {});
        let update = SetTitlePacket.create()
        update.sendTo(netId, 0)
        update.dispose();
    }, 500);
    return 0;
}

console.log("[bdsx-scripts] tdtp ready.");