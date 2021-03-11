// Original by minyee2913 (credit in 2913Module.ts)
// Modified by soraboken
const system = server.registerSystem(0, 0);
const compliments = [
  "10/10 shot!",
  "Nice shot!",
  "You made it!",
  "Wow!",
  "Woah, be careful.",
  "Such shot.",
  "Much arrows.",
  "Very epic!",
  "Couldn't hesitate for a shot huh?",
  "Ooooh!"
];
const colorCodes = ["a", "b", "c", "d", "e"];

system.listenForEvent("minecraft:entity_hurt", eventData => {
	const { 
		attacker,
		entity,
		cause
	} = eventData;
	
	if (cause === "projectile") {
		const attackerName = system.getComponent(attacker, MinecraftComponent.Nameable)!.data.name;
		system.executeCommand(`execute "${attackerName}" ~ ~ ~ playsound random.orb @s ~ ~ ~ 1 0.5`, () => {
		  system.executeCommand(`title "${attackerName}" times 0 0 2`, () => {
		    system.executeCommand(`title "${attackerName}" actionbar §${colorCodes[Math.floor(Math.random() * colorCodes.length)]}${compliments[Math.floor(Math.random() * compliments.length)]}`, () => {});
		  });
		});
	}
})

console.log('[2913Module] bowDing.ts loaded');