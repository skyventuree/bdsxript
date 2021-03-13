// https://github.com/bdsx/bdsx/wiki/Cross-dimension-teleporting-(Native-function)
import { pdb } from "bdsx/core";
import { SYMOPT_UNDNAME } from "bdsx/common";
import { ProcHacker } from "bdsx/prochacker";
import { Actor, DimensionId, RawTypeId } from "bdsx";
import { Vec3 } from "bdsx/bds/blockpos";

// Open PDB and look for teleport function
pdb.setOptions(SYMOPT_UNDNAME);
const hacker = ProcHacker.load("../pdbcache.ini", [
    "TeleportCommand::teleport"
]);
pdb.setOptions(0);
pdb.close();
const func = hacker.js("TeleportCommand::teleport", RawTypeId.Void, null, Actor, Vec3, Vec3, RawTypeId.Int32);

// Teleport function
export function teleport(actor: Actor, targetPos: VectorXYZ, dimensionId: DimensionId = DimensionId.Overworld): void {
    let pos = new Vec3(true);
    pos.x = targetPos.x;
    pos.y = targetPos.y;
    pos.z = targetPos.z;

    func(actor, pos, new Vec3(true), dimensionId);
}