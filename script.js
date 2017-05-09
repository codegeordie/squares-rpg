
//html variables
var gethelp = document.getElementById("helpButton"),
	endhelp = document.getElementById("endhelp"),
	tutorial = document.getElementById("tutorial"),
	box1 = document.getElementById("box1"),
	box2 = document.getElementById("box2"),
	box3 = document.getElementById("box3"),
	box4 = document.getElementById("box4"),
	box1lvl = document.getElementById("box1lvl"),
	box2lvl = document.getElementById("box2lvl"),
	box3lvl = document.getElementById("box3lvl"),
	box4lvl = document.getElementById("box4lvl"),
	center = document.getElementById("center"),
	playertitle = document.getElementById("playerINFOtitle"),
	playerinfo = document.getElementById("playerINFO"),
	playerhp = document.getElementById("playerHPbar"),
	playerap = document.getElementById("playerAPbar"),
	playerapCount = document.getElementById("playerActionOverlay"),
	playerxp = document.getElementById("playerXPbar"),
	charButton = document.getElementById("characterButton"),
	charScreen = document.getElementById("characterWrapper"),
	charVit = document.getElementById("charVit"),
	charStr = document.getElementById("charStr"),
	charStam = document.getElementById("charStam"),
	charDex = document.getElementById("charDex"),
	effectVit = document.getElementById("effectVit"),
	effectStr = document.getElementById("effectStr"),
	effectStam = document.getElementById("effectStam"),
	effectDex = document.getElementById("effectDex"),
	availableStatPoints = document.getElementById("availableStatPoints"),
	hotbar = document.getElementById("hotbar"),
	hot1 = document.getElementById("hot1"),
	hot2 = document.getElementById("hot2"),
	hot3 = document.getElementById("hot3"),
	hot4 = document.getElementById("hot4"),
	inventory = document.getElementById("inv"),
	slot1 = document.getElementById("slot1"),
	slot2 = document.getElementById("slot2"),
	slot3 = document.getElementById("slot3"),
	slot4 = document.getElementById("slot4"),
	slot5 = document.getElementById("slot5"),
	slot6 = document.getElementById("slot6"),
	slot7 = document.getElementById("slot7"),
	slot8 = document.getElementById("slot8"),
	slot9 = document.getElementById("slot9"),
	trash = document.getElementById("trash");
	combatlog = document.getElementById("combatLog"),
	gameover = document.getElementById("gameover"),
	retry = document.getElementById("retry"),
	easymode = document.getElementById("easymode");


var monsterHP = document.createElement("div"),
	monsterHPbar = document.createElement("div"),
	monsterHPtext = document.createElement("p");

//used to manupulate DOM elements
var boxes = [box1,box2,box3,box4],
	actions = [hot1,hot2,hot3,hot4],
	boxesLevels = [box1lvl,box2lvl,box3lvl,box4lvl],
	slots = [slot1,slot2,slot3,slot4,slot5,slot6,slot7,slot8,slot9,trash],
	activeBox,						//saves selected box during round
	activeNum,
	boxLevel = [0,0,0,0],	
	boxType = [0,0,0,0],			//0=blank, 1=monster, 2=health, 3=treasure
	monsterType = [0,0,0,0],
	actionIndex = [1,2,0,0], 		//actionbar attack types
	slotItem = [0,0,0,0,0,0,0,0,0,0],	//inventory  (final value is trashcan)
	slotClass = [1,2,1,0,0,0,0,0,0,9],
	availableItem = 0,
	healthPercentage,
	actionPercentage,
	xpPercentage,
	monsterHealthPercentage,
	clicked = 0,
	restingTitle = "",
	restingInfo = "apply your stats<br>then<br>click here to begin";

//gameplay variables
var stage = 0,    //primarily used by click function
	player = {},
	playerName = "",
	monster = {},
	monsterName = "",
	experience = 0,
	nextLevel = 300,
	statPoints = 0,
	buildResults = [],
	round = 0,
	stun = 0,
	wound = 0,
	sunder = 0;


//index of attack types
var attacks = [
		{name:"", tooltip:"", button:""},//leave blank
		{name:"Basic Attack", tooltip:"1x damage", button:"1x"},
		{name:"Strong Attack", tooltip:"2x damage<br><br><br>Costs 1 AP", button:"2x"},
		{name:"Noodly Slap", tooltip:"200 damage<br><br><br>Costs all AP (min: 3)", button:"NS"},
		{name:"Sunder", tooltip:"1x damage<br>Sunder monster armor<br>for 3 attacks<br>Costs 2 AP", button:"SD"},
/*5*/	{name:"Wound", tooltip:"1.5x damage<br>Monster attack -50%<br>for 3 attacks<br>Costs 2 AP", button:"WD"},
		{name:"Leech", tooltip:"no damage<br>recover hp equal<br>to 3x normal damage<br>Costs 4 AP", button:"LCH"},
		{name:"Devastate", tooltip:"5x damage<br><br><br>Costs 4 AP", button:"5x"},
		{name:"", tooltip:"", button:""},
		{name:"Quickness", tooltip:"chance equal to<br>critical chance<br>of attacking twice", button:"Q"},
/*10*/	{name:"Recharge", tooltip:"Recovers 5 AP", button:"AP"},
		{name:"Rejuvinate", tooltip:"Recovers 10 AP", button:"AP"},
		{name:"Shield Slam", tooltip:"Sunder monster armor<br>for 4 attacks<br><br>Costs 3 AP", button:"SL"},
		{name:"Passive", tooltip:"regenerate<br>1 additional AP<br>per round", button:"+1"},
		{name:"Passive", tooltip:"regenerate<br>2 additional AP<br>per round", button:"+2"},
/*15*/	{name:"Passive", tooltip:"regenerate<br>3 additional AP<br>per round", button:"+3"},
		{name:"Passive", tooltip:"regenerate<br>4 additional AP<br>per round", button:"+4"},
		{name:"Channel", tooltip:"Spend available AP (max: 5)<br>recover 100hp per AP spent", button:"CH"}

];

//index of all available items
var items = [   //stats are (vit,str,stam,dex, damage, armor, block, luck)
		{level:999, stats:[200,200,200,200,999,999,999,999], class:9, special:0, name:"", tooltip:""},
		{level:999, stats:[0,0,0,0,5,0,0,0], class:1, special:3, name:"Pool Noodle", tooltip:"5 damage<br>A formidable weapon<br><br>special: Noodly Slap"},
		{level:999, stats:[0,0,0,0,0,3,0,0], class:2, special:0, name:"Flannel Shirt", tooltip:"3 armor<br>A warrior's attire"},
		{level:999, stats:[0,0,0,0,0,0,25,0], class:1, special:10, name:"Garbage Can Lid", tooltip:"block: 25%<br>A strong defense<br><br>Special: Recharge"},
		//level 1
		{level:1, stats:[0,0,0,0,0,0,0,0], class:0, special:100, name:"Gatorade", tooltip:"trash to use and<br>recover all health"},
		{level:1, stats:[0,0,0,0,0,0,0,0], class:0, special:100, name:"Gatorade", tooltip:"trash to use and<br>recover all health"},
		{level:1, stats:[0,0,0,0,0,0,0,0], class:0, special:100, name:"Gatorade", tooltip:"trash to use and<br>recover all health"},
		{level:1, stats:[0,0,0,0,0,0,0,0], class:0, special:101, name:"RedBull", tooltip:"trash to use and<br>recover all AP"},
		{level:1, stats:[0,0,0,0,6,0,0,0], class:1, special:7, name:"Wooden Sword", tooltip:"6 damage<br><br><br>Special: Devastate"},
		{level:1, stats:[0,0,0,5,7,0,0,0], class:1, special:0, name:"Bamboo Spear", tooltip:"7 damage<br>+5 DEX"},
		{level:1, stats:[2,0,0,0,0,6,0,0], class:2, special:0, name:"Leather Vest", tooltip:"6 armor<br>+2 VIT"},
		{level:101, stats:[0,2,2,0,0,0,35,0], class:1, special:10, name:"Plywood Shield", tooltip:"block: 35%<br>+2 STR, +2 STAM<br><br>Special: Recharge"},
		{level:101, stats:[0,1,2,0,0,0,0,0], class:0, special:0, name:"Silver Chain", tooltip:"+2 STAM, +1 STR"},
		{level:101, stats:[2,0,0,1,0,0,0,0], class:0, special:0, name:"Can of Beans", tooltip:"+2 VIT, +1 DEX"},
		//level 3
		{level:3, stats:[0,0,0,0,0,0,0,0], class:0, special:100, name:"Gatorade", tooltip:"trash to use and<br>recover all health"},
		{level:3, stats:[0,0,0,0,0,0,0,0], class:0, special:101, name:"RedBull", tooltip:"trash to use and<br>recover all AP"},
		{level:103, stats:[0,0,0,0,8,0,0,0], class:1, special:5, name:"Plastic Axe", tooltip:"8 damage<br><br><br>Special: Wound"},
		//level 5
		{level:5, stats:[0,0,0,0,0,0,0,0], class:0, special:100, name:"Gatorade", tooltip:"trash to use and<br>recover all health"},
		{level:5, stats:[0,0,2,0,10,0,0,0], class:1, special:7, name:"Stone Axe", tooltip:"10 damage<br>+2 STAM<br><br>Special: Devastate"},
		{level:5, stats:[0,0,-3,0,2,0,0,0], class:0, special:0, name:"Heavy Stick", tooltip:"+2 damage<br>-3 STAM"},
		{level:5, stats:[0,0,3,3,0,10,0,0], class:2, special:0, name:"Leather Armor", tooltip:"10 armor<br>+3 DEX, +3 STAM"},
		{level:5, stats:[5,0,0,0,0,15,0,0], class:2, special:0, name:"Cast Iron Armor", tooltip:"12 armor<br>+5 VIT"},
		{level:105, stats:[0,0,3,0,10,0,0,0], class:1, special:5, name:"Sharp Stone Axe", tooltip:"12 damage<br>+3 STAM<br><br>Special: Wound"},
		{level:105, stats:[0,0,3,5,0,12,0,0], class:2, special:0, name:"Hard Leather Armor", tooltip:"12 armor<br>+5 DEX, +3 STAM"},
		//level 8
		{level:8, stats:[0,0,0,5,12,0,0,0], class:1, special:4, name:"Dagger", tooltip:"12 damage<br>+5 DEX<br><br>Special: Sunder"},
		{level:8, stats:[0,0,0,0,0,3,0,0], class:0, special:0, name:"Sturdy Helmet", tooltip:"+3 armor"},
		{level:8, stats:[0,0,0,0,0,3,45,0], class:1, special:13, name:"Leather Shield", tooltip:"block: 45%<br>3 armor<br><br>Passive: Regen 1 AP"},
		{level:108, stats:[0,0,0,5,12,0,0,0], class:1, special:6, name:"Dagger of Shock", tooltip:"12 damage<br>+5 DEX<br><br>Special: Leech"},
		//level 10
		{level:10, stats:[0,0,0,0,0,0,0,0], class:0, special:100, name:"Morphine", tooltip:"trash to use and<br>recover all health"},
		{level:10, stats:[0,0,0,0,0,0,0,0], class:0, special:100, name:"Morphine", tooltip:"trash to use and<br>recover all health"},
		{level:10, stats:[0,0,0,0,0,0,0,0], class:0, special:100, name:"Morphine", tooltip:"trash to use and<br>recover all health"},
		{level:10, stats:[0,0,0,0,0,0,0,0], class:0, special:101, name:"Cocaine", tooltip:"trash to use and<br>recover all AP"},
		{level:110, stats:[0,0,0,5,0,5,50,0], class:1, special:14, name:"Hard Leather Shield", tooltip:"block: 50%<br>5 armor<br>+5 DEX<br>Passive: Regen 2 AP"},
		{level:110, stats:[0,0,0,-4,0,0,70,0], class:1, special:12, name:"Stone Slab", tooltip:"block: 70%<br>-4 DEX<br><br>Special: Slam"},
		//level 13
		{level:13, stats:[0,0,0,0,0,0,0,0], class:0, special:100, name:"Morphine", tooltip:"trash to use and<br>recover all health"},
		{level:13, stats:[0,0,0,0,0,0,0,0], class:0, special:101, name:"Cocaine", tooltip:"trash to use and<br>recover all AP"},
		{level:13, stats:[3,0,2,0,0,0,0,0], class:0, special:0, name:"Endurance Charm", tooltip:"+3 VIT, +2 STAM"},
		{level:13, stats:[0,2,0,3,0,0,0,0], class:0, special:0, name:"Striking Charm", tooltip:"+2 STR, +3 DEX"},
		{level:13, stats:[0,0,0,0,0,-1,0,0], class:0, special:0, name:"a soft heart", tooltip:"-1 armor"},
		{level:13, stats:[5,0,0,0,15,0,0,0], class:1, special:0, name:"Machete", tooltip:"15 damage<br>+5 VIT"},
		{level:13, stats:[0,0,5,0,15,0,0,0], class:1, special:7, name:"Iron Axe", tooltip:"15 damage<br>+5 STAM<br><br>Special: Devastate"},
		{level:13, stats:[12,0,0,-8,0,10,0,0], class:2, special:0, name:"Bear Pelt", tooltip:"10 armor<br>+12 VIT, -8 DEX"},
		{level:113, stats:[-18,0,0,0,35,0,0,0], class:1, special:0, name:"Glass Cannon", tooltip:"35 damage, -18 VIT"},
		//level 15
		{level:15, stats:[0,0,5,0,0,15,0,0], class:2, special:0, name:"Steel Armor", tooltip:"15 armor<br>+5 STAM"},
		{level:15, stats:[10,0,12,0,0,0,0,0], class:2, special:0, name:"Apprentice's Robe", tooltip:"no armor<br>+10 VIT, +12 STAM"},
		{level:15, stats:[5,0,0,0,0,5,50,0], class:1, special:10, name:"Iron Buckler", tooltip:"block: 50%<br>5 armor<br>+5 VIT<br>Special: Recharge"},
		{level:115, stats:[5,0,0,0,0,5,50,0], class:1, special:12, name:"Spiked Buckler", tooltip:"block: 50%<br>5 armor<br>+5 VIT<br>Special: Slam"},
		{level:115, stats:[0,0,0,6,18,0,0,0], class:1, special:9, name:"Scimitar", tooltip:"18 damage<br>+6 DEX<br><br>Passive; Quickness"},
		{level:115, stats:[0,6,0,0,0,20,0,0], class:2, special:0, name:"Steel War Armor", tooltip:"20 armor<br>+6 STR"},
		//level 18
		{level:18, stats:[0,0,6,0,20,0,0,0], class:1, special:4, name:"Steel Sword", tooltip:"20 damage<br>+6 STAM<br><br>Special: Sunder"},
		{level:18, stats:[0,0,0,0,2,0,0,0], class:0, special:0, name:"Sharpening Stone", tooltip:"+2 damage"},
		{level:18, stats:[0,0,0,0,2,0,0,0], class:0, special:0, name:"Sharpening Stone", tooltip:"+2 damage"},
		{level:18, stats:[0,0,0,0,-1,0,0,0], class:0, special:0, name:"Tangible Pacifism", tooltip:"-1 damage"},
		{level:118, stats:[0,0,0,0,0,0,0,1], class:0, special:0, name:"Lucky Charm", tooltip:"+1 luck"},
		{level:118, stats:[0,0,9,0,0,10,60,0], class:1, special:0, name:"Heater Shield", tooltip:"block: 60%<br>10 armor<br>+9 STAM"},
		//level 21
		{level:21, stats:[0,0,0,0,0,0,0,0], class:0, special:102, name:"Gin&Tonic", tooltip:"trash to use and<br>recover health and AP"},
		{level:21, stats:[0,0,0,0,0,0,0,0], class:0, special:102, name:"Gin&Tonic", tooltip:"trash to use and<br>recover health and AP"},
		{level:21, stats:[0,0,0,0,0,0,0,0], class:0, special:102, name:"Gin&Tonic", tooltip:"trash to use and<br>recover health and AP"},
		{level:21, stats:[0,0,0,0,0,0,0,0], class:0, special:102, name:"Gin&Tonic", tooltip:"trash to use and<br>recover health and AP"},
		{level:21, stats:[0,0,0,0,0,0,0,0], class:0, special:102, name:"Gin&Tonic", tooltip:"trash to use and<br>recover health and AP"},
		{level:121, stats:[2,2,2,2,0,0,0,0], class:0, special:0, name:"Powerful Charm", tooltip:"+2 All Stats"},
		{level:121, stats:[0,0,0,7,21,0,0,0], class:1, special:6, name:"Ornate Dagger", tooltip:"21 damage<br>+7 DEX<br><br>Special: Leech"},
		{level:121, stats:[0,0,15,15,0,0,0,0], class:2, special:0, name:"Monk's Robe", tooltip:"no armor<br>+15 STAM, +15 DEX"},
		//level 25
		{level:25, stats:[0,0,0,8,0,25,0,0], class:2, special:0, name:"Silver Chainmail", tooltip:"25 armor<br>+8 DEX"},
		{level:25, stats:[18,0,8,0,0,0,0,0], class:1, special:15, name:"Wizard's Wand", tooltip:"+18 VIT, +8 STAM<br><br><br>Passive: Regen 3 AP"},
		{level:25, stats:[0,0,0,15,0,0,25,0], class:1, special:9, name:"Wolf Claw", tooltip:"block: 25%<br>+15 DEX<br><br>Passive: Quickness"},
		{level:25, stats:[-1,0,0,0,0,0,0,0], class:0, special:0, name:"Pickled Herring", tooltip:"-1 VIT"},
		{level:125, stats:[7,0,3,0,28,0,0,0], class:1, special:5, name:"Halberd", tooltip:"28 damage<br>+7 VIT, +3 STAM<br><br>Special: Wound"},
		{level:125, stats:[0,8,0,0,0,25,0,0], class:2, special:0, name:"Silver Platemail", tooltip:"25 armor<br>+8 STR"},
		{level:125, stats:[0,0,0,-6,0,12,75,0], class:1, special:14, name:"Tower Shield", tooltip:"block: 75%<br>12 armor<br>-6 DEX<br>Passive: Regen 2 AP"},	
		//level 30
		{level:30, stats:[0,0,0,0,0,0,0,0], class:0, special:102, name:"Gin&Tonic", tooltip:"trash to use and<br>recover health and AP"},
		{level:30, stats:[0,0,0,0,0,0,0,0], class:0, special:102, name:"Gin&Tonic", tooltip:"trash to use and<br>recover health and AP"},
		{level:30, stats:[0,0,0,0,0,0,0,0], class:0, special:102, name:"Gin&Tonic", tooltip:"trash to use and<br>recover health and AP"},
		{level:30, stats:[0,0,0,0,0,0,0,0], class:0, special:102, name:"Gin&Tonic", tooltip:"trash to use and<br>recover health and AP"},
		{level:30, stats:[5,0,-5,0,45,0,0,0], class:1, special:0, name:"Greatsword", tooltip:"40 damage<br>+5 VIT, -5 STAM"},
		{level:30, stats:[0,6,0,8,0,22,0,0], class:2, special:0, name:"Wolf's Hide Armor", tooltip:"22 armor<br>+6 STR, +8 DEX"},
		{level:30, stats:[0,0,0,8,35,0,0,0], class:1, special:9, name:"Katana", tooltip:"35 damage<br>+8 DEX<br><br>Passive: Quickness"},
		{level:30, stats:[0,0,-1,0,0,0,0,0], class:0, special:0, name:"Pet Rock", tooltip:"-1 STAM"},
		{level:130, stats:[0,0,0,8,35,0,0,0], class:1, special:6, name:"Bloody Katana", tooltip:"35 damage<br>+8 DEX<br><br>Special: Leech"},
		{level:130, stats:[0,8,16,16,0,0,0,0], class:2, special:0, name:"Master's Robe", tooltip:"no armor<br>+8 STR, +16 STAM, +16 DEX"},
		{level:130, stats:[0,8,0,0,0,10,65,0], class:1, special:11, name:"Knight's Shield", tooltip:"block: 65%<br>10 armor<br>+8 STR<br>Special: Rejuvinate"},
		//level 35
		{level:35, stats:[0,0,0,0,0,0,0,0], class:0, special:102, name:"Gin&Tonic", tooltip:"trash to use and<br>recover health and AP"},
		{level:35, stats:[25,8,0,-10,0,0,0,0], class:2, special:0, name:"Necromancer's Robe", tooltip:"no armor<br>+25 VIT, +8 STR, -10 DEX"},
		{level:135, stats:[0,0,0,0,0,0,0,2], class:0, special:0, name:"Lucky Rune", tooltip:"+2 luck"},
		{level:135, stats:[-20,0,-25,0,80,0,0,0], class:1, special:7, name:"Crystal Cannon", tooltip:"80 damage<br>-20 VIT, -25 STAM<br><br>Special: Devastate"},
		{level:135, stats:[0,0,10,0,45,0,0,0], class:1, special:7, name:"Longclaw", tooltip:"45 damage<br>+10 STAM<br><br>Special: Devastate"},
		//level 40
		{level:40, stats:[0,0,0,0,0,0,0,0], class:0, special:102, name:"Gin&Tonic", tooltip:"trash to use and<br>recover health and AP"},
		{level:40, stats:[0,0,0,0,0,0,0,0], class:0, special:102, name:"Gin&Tonic", tooltip:"trash to use and<br>recover health and AP"},
		{level:40, stats:[0,0,0,0,0,0,0,0], class:0, special:102, name:"Gin&Tonic", tooltip:"trash to use and<br>recover health and AP"},
		{level:40, stats:[0,0,0,0,0,0,0,0], class:0, special:102, name:"Gin&Tonic", tooltip:"trash to use and<br>recover health and AP"},
		{level:40, stats:[0,-1,0,0,0,0,0,0], class:0, special:0, name:"Book of Poetry", tooltip:"-1 STR"},
		{level:40, stats:[0,0,0,0,4,0,0,0], class:0, special:0, name:"Blade Poison", tooltip:"+4 damage"},
		{level:40, stats:[0,0,0,0,0,4,0,0], class:0, special:0, name:"Armorer's Tools", tooltip:"+4 armor"},
		{level:40, stats:[0,-10,-15,0,0,50,0,0], class:2, special:0, name:"Stone Armor", tooltip:"50 armor<br>-10 STR, -15 STAM"},
		{level:40, stats:[8,0,0,0,50,0,0,0], class:1, special:6, name:"Scythe", tooltip:"50 damage<br>+8 VIT<br><br>Special: Leech"},
		{level:40, stats:[0,0,0,12,0,12,80,0], class:1, special:11, name:"Obsidion Shield", tooltip:"block: 80%<br>12 armor<br>+12 DEX<br>Special: Rejuvinate"},
		{level:140, stats:[0,0,5,10,0,25,0,0], class:2, special:0, name:"Dragonhide Armor", tooltip:"25 armor<br>+5 STAM, +10 DEX"},
		{level:140, stats:[15,15,15,15,0,0,0,0], class:1, special:16, name:"Runed Scepter", tooltip:"+15 all stats<br><br><br>Passive: Regen 4 AP"},
		{level:140, stats:[15,15,15,15,0,0,0,0], class:1, special:6, name:"Twisted Scepter", tooltip:"+15 all stats<br><br><br>Special: Leech"},
		{level:140, stats:[15,15,15,15,0,0,0,0], class:1, special:4, name:"Heavy Scepter", tooltip:"+15 all stats<br><br><br>Special: Sunder"},
		{level:140, stats:[15,15,15,15,0,0,0,0], class:1, special:11, name:"Ethereal Scepter", tooltip:"+15 all stats<br><br><br>Special: Rejuvinate"},
		//level 43
		{level:43, stats:[0,0,0,0,0,0,0,0], class:0, special:102, name:"Gin&Tonic", tooltip:"trash to use and<br>recover health and AP"},
		{level:43, stats:[0,0,0,12,0,12,80,0], class:1, special:12, name:"Psi Shield", tooltip:"block: 80%<br>12 armor<br>+12 DEX<br>Special: Slam"},
		{level:143, stats:[0,8,0,0,0,30,0,0], class:2, special:0, name:"Golden Platemail", tooltip:"30 armor<br>+8 STR"},
		{level:143, stats:[0,12,0,0,65,0,0,0], class:1, special:9, name:"Dawn", tooltip:"65 damage<br>+12 STR<br><br>Passive: Quickness"}

/*
		{level: stats:[0,0,0,0,0,0,0,0], class:0, special:0, name:"", tooltip:""},
		{level: stats:[0,0,0,0,0,0,0,0], class:0, special:0, name:"", tooltip:""},
		{level: stats:[0,0,0,0,0,0,0,0], class:0, special:0, name:"", tooltip:""},
		{level: stats:[0,0,0,0,0,0,0,0], class:0, special:0, name:"", tooltip:""},
		{level: stats:[0,0,0,0,0,0,0,0], class:0, special:0, name:"", tooltip:""},
		{level: stats:[0,0,0,0,0,0,0,0], class:0, special:0, name:"", tooltip:""},
		{level: stats:[0,0,0,0,0,0,0,0], class:0, special:0, name:"", tooltip:""},
		{level: stats:[0,0,0,0,0,0,0,0], class:0, special:0, name:"", tooltip:""}
*/

];


//assign mouseover events for tooltips
for(var i in slots){
	slots[i].addEventListener("mouseover",slotTooltip);
	slots[i].addEventListener("mouseout",toolTipClear);
}
for(var i in actions){
	actions[i].addEventListener("mouseover",actionTooltip);
	actions[i].addEventListener("mouseout",toolTipClear);
}
for(var i in boxes) {
	boxes[i].addEventListener("mouseover",boxTooltip);
	boxes[i].addEventListener("mouseout",toolTipClear);
}


//mouseover events start----------------------------------------------start
function slotTooltip(){
	var slot = this;
	var i = slots.findIndex(function(x){return x == slot});
	var j = slotItem[i];

	if(j != 0){
		playertitle.innerHTML = items[j].name;
		playerinfo.innerHTML = items[j].tooltip;
	}
	//hover effect for weapon/attack link  (and trash)
	if(i==0){hot3.classList.add("actionSquareWeap");}
	 else if(i==2){hot4.classList.add("actionSquareWeap");}
	 else if(i==9){
	 	playertitle.innerHTML = "trash";
	 	playerinfo.innerHTML = "destroys item";
	 }
}

function actionTooltip(){
	var action = this;
	var i = actions.findIndex(function(x){return x == action});
	var j = actionIndex[i];

	playertitle.innerHTML = attacks[j].name;
	playerinfo.innerHTML = attacks[j].tooltip;
}

function boxTooltip(){
	var box = this;
	var i = boxes.findIndex(function(x){return x == box});
	var j = boxType[i];
	 
	if(stage != 1){
		if(stage == 5){
			playertitle.innerHTML = items[availableItem].name;
			playerinfo.innerHTML = items[availableItem].tooltip;

		} else {
			switch(j){
				case 1:	switch(monsterType[i]){
							case 0: playertitle.innerHTML = "Beast";
									break;
							case 1: playertitle.innerHTML = "Rogue";
									playerinfo.innerHTML = "might attack first<br>can crit";
									break;
							case 2: playertitle.innerHTML = "Knight";
									playerinfo.innerHTML = "high health<br>carries shield";
									break;
							case 3: playertitle.innerHTML = "Barbarian";
									playerinfo.innerHTML = "stronger attacks";
									break;
						}
						break;
				case 2: playertitle.innerHTML = "Health";
						playerinfo.innerHTML = "";
						break;
				case 3: playertitle.innerHTML = "Treasure Chest";
						playerinfo.innerHTML = "";
						break;
				default:playertitle.innerHTML = "";
						playerinfo.innerHTML = "";
			}
		}
	}
	

}

function toolTipClear(){
	centerRefresh();
		if(hot3.classList.contains("actionSquareWeap")){
			hot3.classList.remove("actionSquareWeap");}
		if(hot4.classList.contains("actionSquareWeap")){
			hot4.classList.remove("actionSquareWeap");}
	if(availableItem==0){
		if(slot1.classList.contains("highlightWeap")){
			slot1.classList.remove("highlightWeap");}
		if(slot2.classList.contains("highlightArm")){
			slot2.classList.remove("highlightArm");}
		if(slot3.classList.contains("highlightWeap")){
			slot3.classList.remove("highlightWeap");}
	}
}
//mouseover events end  ----------------------------------------------end


//refreshes center pane
function centerRefresh(){
	playertitle.innerHTML = restingTitle;
	playerinfo.innerHTML = restingInfo;
}
//clears center pane
function centerClear(){
	restingTitle = "";
	restingInfo = "";
	centerRefresh();
}

// click events
gethelp.onclick = function(){tutorial.className = "tutorialActive";};
endhelp.onclick = function(){
	tutorial.className = "tutorialHidden";
	gethelp.className = "";
	gethelp.style.opacity = .1;
};
retry.onclick = function(){
	reinitiate("");
	gameStart();
};
easymode.onclick = function(){
	reinitiate("easy");
	gameStart();
};
box1.onclick = function(){click("box",0);};
box2.onclick = function(){click("box",1);};
box3.onclick = function(){click("box",2);};
box4.onclick = function(){click("box",3);};
center.onclick = function(){click("center",10);};
hot1.onclick = function(){click("hot",0);};
hot2.onclick = function(){click("hot",1);};
hot3.onclick = function(){click("hot",2);};
hot4.onclick = function(){click("hot",3);};
slot1.onclick = function(){click("slot",0);};
slot2.onclick = function(){click("slot",1);};
slot3.onclick = function(){click("slot",2);};
slot4.onclick = function(){click("slot",3);};
slot5.onclick = function(){click("slot",4);};
slot6.onclick = function(){click("slot",5);};
slot7.onclick = function(){click("slot",6);};
slot8.onclick = function(){click("slot",7);};
slot9.onclick = function(){click("slot",8);};
trash.onclick = function(){click("slot",9);};
charVit.onclick = function(){click("char",0);};	
charStr.onclick = function(){click("char",1);};
charStam.onclick = function(){click("char",2);};
charDex.onclick = function(){click("char",3);};
charButton.onclick = function(){
	if(charScreen.className == "open"){charScreen.className = "";} 
	  else {charScreen.className = "open"; playerRefresh();}
	if(charButton.className == "highlightSlot"){
		charButton.className = "";
		clicked = 1;
		effectVit.innerHTML = "increases health<br>influences armor";
		effectStr.innerHTML = "amplifies damage<br>(based on weapon dmg)";
		effectStam.innerHTML = "increases action points<br>influences armor";
		effectDex.innerHTML = "increases critical chance<br>improves shield block chance";
	}
};


//click event handler
function click(cellType,arrayCell){

	if(cellType == "char" && statPoints > 0){
		switch(arrayCell){
			case 0: player.stats[0]++; statPoints--; break;
			case 1: player.stats[1]++; statPoints--; break;
			case 2: player.stats[2]++; statPoints--; break;
			case 3: player.stats[3]++; statPoints--; break;
		}
		playerBuildRefresh();

	} else if(cellType == "slot"){
		equipItem(arrayCell);

	} else {

		if((stage == 0) && cellType == "center"){    	//game start
			player.health = player.maxHealth;
			populateCells();
		} else if(stage == 2 && cellType == "box"){  	//selecting a box
			action(arrayCell);
		} else if(stage == 3 && cellType == "hot"){  	//combat
			attack(actionIndex[arrayCell]);
		}
	}
}


//inventory and item interaction function
function equipItem(slot){
	//check for inventory slot class vs item
	if(availableItem > 0 && items[availableItem].class != slotClass[slot] && slotClass[slot] != 9){
			restingInfo = "cannot equip in that slot";
			centerRefresh();
	} else {
	//empty trash
			slots[9].className = "slot";
			slotItem[9] = 0;
	//main function start
		centerClear();
		var item = availableItem;
		availableItem = 0;
	//remove existing item from square
		if(slotItem[slot] != 0){
			availableItem = slotItem[slot];
			for(var i=0; i<player.stats.length; i++){player.stats[i] -= items[slotItem[slot]].stats[i];}
			playerBuildRefresh();
			slotItem[slot] = 0;
			slots[slot].className = "slot";
			if(stage == 5){clearCells(); stage = 4;}//resets visuals from treasurechest
			highlightInventory(slot);
		} else {//if no item picked up, clear highlighting
			toolTipClear();
			if(stage >= 4){
				stage = 1;
				clearCells();
				setTimeout(populateCells, 1000);
			}
		}
	//equip available item
		if(item != 0){
			slotItem[slot] = item;
			if(slot != 9){//dont give stats from trashcan!
				for(var i=0; i<player.stats.length; i++){
				player.stats[i] += items[item].stats[i];
				}
			} else if(slot == 9 && items[item].special > 99){usePotion(item);}
			playerBuildRefresh();
			if(items[item].special < 99){slots[slot].classList.add("equipped");}
			 else {slots[slot].classList.add("potion");}
			item = 0;
			slotItem[9] = 0;
			slots[9].className = "slot";
			inventory.className = "boxSpecial";
			if(availableItem == 0 && stage >= 4){
				stage = 1;
				setTimeout(populateCells, 1000);
			}
		}
	//reset visuals from treasurechest
		if(stage == 5 || stage == 4){
			clearCells();
		}
	//fix treasure/trash visual bug
		if(item != availableItem){highlightInventory(slot);}
	}//close slotClass check
}


//potion function
function usePotion(item){
	switch(items[item].special){
		case 100: 	player.health = player.maxHealth;
					break;
		case 101: 	player.action = player.maxAction;
					break;
		case 102: 	player.health = player.maxHealth;
					player.action = player.maxAction;
					break;
	}
}


//random number function
function r(max){
	return Math.floor((Math.random() * max) + 1);
}


//random level function
function rlvl(spread,nonNeg){
	var resultLevel = player.level;

	if(r(2) > 1 || nonNeg === 1){
		for(var i=0; i<spread; i++){
			if(r(10) > 8) {resultLevel++;}
		}
	} else {
		var increase = 0;
		for(var i=0; i<spread; i++){
			if(r(20) >= (20 - spread + increase)){
				resultLevel--;
				increase++;
			}
		}
	}
	if(resultLevel < 1){resultLevel = 1;}
	return resultLevel;
}

//random damage function
function rdmg(attack){
	return attack += attack * (r(30)/100);
}



//populates the four primary squares (type and level)
function populateCells(){
	round++;
	center.className = "box";
	centerRefresh();

	for(var i=0; i<boxes.length; i++){
		var x = r(100) + player.luck;
		if(x < 60){
			boxes[i].classList.add("monster");
			boxType[i] = 1;
			boxLevel[i] = rlvl(5+Math.ceil(player.level/10));	
		} else if(x >= 81 && x < 96){
			boxes[i].classList.add("health");
			boxType[i] = 2;
			boxLevel[i] = rlvl(5+Math.ceil(player.level/10));
		} else if(x >= 96){
			boxes[i].classList.add("treasure");
			boxType[i] = 3;
			boxLevel[i] = rlvl(5+Math.ceil(player.level/10));	
		}else if(x >= 60 && x < 81){
			boxes[i].classList.add("specialMonster");
			boxType[i] = 1
			boxLevel[i] = rlvl(5+Math.ceil(player.level/7),1);
			monsterType[i] = r(3);
		}
		boxesLevels[i].innerHTML = boxLevel[i];
	}
	stage = 2; 	//click handler set to selection stage
	centerClear();
	playerRefresh();
}


//clears all squares (prepares for new round)
function clearCells(){
	for(var i=0; i<4; i++){
			boxesLevels[i].className = "boxLevelText";
			boxes[i].className = "box";
			boxesLevels[i].innerHTML = "";
			actions[i].className = "actionSquare";
			monsterType[i] = 0;
		}
		hotbar.className = "boxSpecial";
		center.className = "box centerPrompt";
		inventory.className = "boxSpecial";
		//combatLog.innerHTML = "";  //disabled so combat log stays active ------------
		centerRefresh();
}


//spawns selected cell, sets up interaction stage
function action(arrayCell){
		activeNum = arrayCell;
	var x = boxType[arrayCell],
		y = boxLevel[arrayCell],
		z = monsterType[arrayCell],
	 	actionBoxes = [box1,box2,box3,box4];

	activeBox = actionBoxes.splice(arrayCell,1);

	for(var i=0; i<actionBoxes.length; i++){
		actionBoxes[i].classList.add("blank");
	}

	//monster box
	if(x == 1){
		player.action += player.recovery;
		spawnMonster(y,z,arrayCell);
		stage = 3;

		activeBox[0].className = "active";
		activeBox[0].appendChild(monsterHP);
		activeBox[0].appendChild(monsterHPtext);
		monsterHP.appendChild(monsterHPbar);
		monsterHP.className = "monsterHP";
		monsterHP.id = "monsterHealth";
		monsterHPbar.className = "monsterHPbar";
		monsterHPbar.id = "monsterHealthBar";
		monsterHPtext.className = "monsterHPtext";
		monsterHPtext.id = "monsterHPtext";
		hot1.className = "actionSquare highlightActionSquare";
		hot2.className = "actionSquare highlightActionSquare";
		hot3.className = "actionSquare highlightActionSquare";
		hot4.className = "actionSquare highlightActionSquare";
		hotbar.className = "boxSpecial highlightHotbar";

	//health box
	} else if(x == 2){
		spawnHealth(y);

	//treasure box
	} else if(x == 3){
		spawnTreasure(y,arrayCell);
	}
	playerRefresh();
}


//generates monster
function spawnMonster(lvl,type,arrayCell){

	switch(type){
		//rogue (fast + crit)
		case 1: var mVIT = Math.floor(lvl * 1) + r(lvl * .5) + 1,
					mSTR = Math.floor(lvl * 1.5) + r(lvl * .5) + 3,
					mSTAM = Math.floor(lvl * .5) + r(lvl * .5),
					mDEX = Math.floor(lvl * 1.5) + r(lvl * .5) + 6,
					mDamage = 5+Math.ceil(lvl*1.2),
					mArmor = 3,
					mBlock = 0;
					monsterName = "Rogue";
					break;
		//knight (shield + armor)
		case 2: var mVIT = Math.floor(lvl * 1.5) + r(lvl * .5) + 3,
					mSTR = Math.floor(lvl * 1) + r(lvl * .5),
					mSTAM = Math.floor(lvl * 1.2) + r(lvl * .8) + 6,
					mDEX = Math.floor(lvl * .4) + r(lvl * .4) + 1,
					mDamage = 5+Math.ceil(lvl*1.2),
					mArmor = 10,
					mBlock = 30;
					monsterName = "Knight";
					break;
		//barbarian (strong attacks)
		case 3: var mVIT = Math.floor(lvl * 1.2) + r(lvl * .8) + 3,
					mSTR = Math.floor(lvl * 1.5) + r(lvl * .5) + 6,
					mSTAM = Math.floor(lvl * .4) + r(lvl * .4) + 1,
					mDEX = Math.floor(lvl * .5) + r(lvl * .5),
					mDamage = 5+Math.ceil(lvl*1.3),
					mArmor = 3,
					mBlock = 0;
					monsterName = "Barbarian";
					break;
		//beast
		default:var mVIT = Math.floor(lvl * 1) + r(lvl * .7) + 1,
					mSTR = Math.floor(lvl * .9) + r(lvl * .4) + 1,
					mSTAM = Math.floor(lvl * .4) + r(lvl * .4),
					mDEX = Math.floor(lvl * .4) + r(lvl * .4),
					mDamage = 5+Math.ceil(lvl*1.2),
					mArmor = 0,
					mBlock = 0;
					monsterName = "Beast";
					break;
	}

	buildUnit(lvl,[mVIT,mSTR,mSTAM,mDEX,mDamage,mArmor,mBlock]);
	monster = new Unit(buildResults);
	monsterRefresh();
	logMonster(); //remove later ------------------------------------------------------------
}


function logMonster(){			 //remove later--------------------------------*******-------
	console.log(
		"monster spawned! lvl:"+monster.level+
		",  type:"+monsterType[activeNum]+
		",  maxhp:"+monster.maxHealth+
		",  atk:"+monster.attack+
		",  crit:"+monster.crit+
		",  block:"+monster.block+
		",  armor:"+monster.armor
	);
}


//generates health
function spawnHealth(level){
	player.health += 75 + (level * 15);
	stage = 1;
	clearCells();
	setTimeout(populateCells, 1000);
}


//generates treasure
function spawnTreasure(level,cell){
	if(level > 100){//checks for special monster-only treasure
		do {
			availableItem = r(Object.keys(items).length - 1);
		} while(items[availableItem].level > level
				|| items[availableItem].level < level - 11
				|| items[availableItem].level - 100 < 0);
	} else {
		do {
			availableItem = r(Object.keys(items).length - 1);
		} while(items[availableItem].level > level
				|| items[availableItem].level < level - 15);
	}
	stage = 5;  //prevent actions other than equipping treasure	
	highlightInventory(cell);
}

//highlights slots based on item clicks and treasure spawns
function highlightInventory(cell){
	inventory.classList.add("highlightInv");
	slots[9].classList.add("highlightTrash");
	if(items[availableItem].special > 99){slots[9].classList.add("highlightTrashPotion");}
	restingTitle = items[availableItem].name;
	restingInfo = items[availableItem].tooltip;
	centerRefresh();

	switch(items[availableItem].class){
		case 0: if(stage==5){boxesLevels[cell].className = "boxLevelText treasureChest charm";}
			 	break;
		case 1: if(stage==5){boxesLevels[cell].classList.add("treasureChest", "weapon");}
				slot1.classList.add("highlightWeap");
				slot3.classList.add("highlightWeap");
				break;
		case 2: if(stage==5){boxesLevels[cell].classList.add("treasureChest", "armor");}
				slot2.classList.add("highlightArm");
			 	break;
		default: break;
	}
}


//unit building function  (required for Unit constructor)
function buildUnit(lvl, statArray){    //vit, str, stam, dex, dmg, armor, block, luck, (healing??)
	
	buildResults = [];   //output: level, maxhealth, attack, actionpoints, recovery, crit, armor, block, luck, stats(array)
	
	//max health formula
		var buildHealth = 50 + (statArray[0] * 20);

	//attack formula
		var buildAttack = Math.ceil(statArray[4] * (1 + (statArray[1] / 20)) + statArray[1]);

	//actionpoints formula
		var buildAction = 5 + Math.floor(statArray[2] / 3);

	//AP recovery formula
		var buildRecovery = Math.ceil(statArray[2] * .1);

	//crit rating formula
		var buildCrit = 10 + Math.ceil(statArray[3] * .6);

	//armor formula
		var buildArmor = statArray[5] + Math.ceil(.2 * (statArray[0] + statArray[2]));

	//block formula
		var buildBlock = 20 + Math.ceil(statArray[3] * .65);
		var buidlBlockPwr = statArray[6];

	//luck formula
		var buildLuck = statArray[7];

	buildResults.push(lvl, buildHealth, buildAttack, buildAction, buildRecovery, buildCrit, buildArmor, buildBlock, buidlBlockPwr, buildLuck, statArray);
	console.log("buildUnit success"+buildResults);
}


//unit constructor, requires buildUnit() run in advance
var Unit = function(buildResults){
	
	this.level = buildResults[0],
	this.maxHealth = buildResults[1],
	this.health = buildResults[1],
	this.attack = buildResults[2],
	this.maxAttack = Math.floor(buildResults[2] * 1.3),
	this.maxAction = buildResults[3],
	this.action = buildResults[3],
	this.recovery = buildResults[4],
	this.crit = buildResults[5],
	this.armor = buildResults[6],
	this.block = buildResults[7],
	this.blockpwr = buildResults[8],
	this.luck = buildResults[9],
	this.stats = buildResults[10]

};


//refreshes player information
function playerRefresh(){
	
	if(player.health > player.maxHealth){
		player.health = player.maxHealth;
	}
	if(player.action > player.maxAction){
		player.action = player.maxAction;
	}
	//heath and actionbar css widths
	healthPercentage = (player.health / player.maxHealth) * 100;
	playerhp.style.width = healthPercentage + "%";
	playerHPtext.innerHTML = player.health+"/"+player.maxHealth;
	actionPercentage = (player.action / player.maxAction) * 100;
	playerap.style.width = actionPercentage + "%";
	
	//maintains actionpoint bar sizing
	while(playerapCount.getElementsByTagName("div").length != player.maxAction){
		if(playerapCount.getElementsByTagName("div").length > player.maxAction){
			var removeAPSquare = playerapCount.getElementsByTagName("div")[0];
			playerapCount.removeChild(removeAPSquare);
		} else if (playerapCount.getElementsByTagName("div").length < player.maxAction){
			var actionpointSquare = document.createElement("div");
			playerapCount.appendChild(actionpointSquare);
			actionpointSquare.className = "actionpoint";
		}
	}

	//lightup character and stat buttons
	if(statPoints > 0){
		charVit.className = "highlightStat";
		charStr.className = "highlightStat";
		charStam.className = "highlightStat";
		charDex.className = "highlightStat";

		if(clicked == 0){
		charButton.className = "highlightSlot";
		} else {
		charButton.className = "";
		}
	} else {
		charVit.className = "";
		charStr.className = "";
		charStam.className = "";
		charDex.className = "";
	}

	//character pane
	xpPercentage = (experience / nextLevel) * 100;
	playerxp.style.width = xpPercentage + "%";
	playerXPtext.innerHTML = experience+"/"+nextLevel;
	playerLevel.innerHTML = player.level;
	availableStatPoints.innerHTML = "Available: "+statPoints;
	charVit.innerHTML = player.stats[0];
	charStr.innerHTML = player.stats[1];
	charStam.innerHTML = player.stats[2];
	charDex.innerHTML = player.stats[3];
	effectVit.innerHTML = "<br><br>health: "+player.maxHealth;
	effectStr.innerHTML = "<br><br>damage: "+player.attack+"-"+player.maxAttack;
	effectStam.innerHTML = "AP: "+player.maxAction+"<br>Regen: "+player.recovery+" per round<br>armor: "+player.armor;
	effectDex.innerHTML = "<br>crit: "+player.crit+"%<br>block: "+player.block+"%";

	//general
	centerRefresh();
	actionIndex[2] = items[slotItem[0]].special;
	actionIndex[3] = items[slotItem[2]].special;
	hot1.innerHTML = attacks[actionIndex[0]].button;
	hot2.innerHTML = attacks[actionIndex[1]].button;
	hot3.innerHTML = attacks[actionIndex[2]].button;
	hot4.innerHTML = attacks[actionIndex[3]].button;

}


//refreshes player from stats
function playerBuildRefresh(stats){
	var tempHP = player.health,
		tempAP = player.action;

	buildUnit(player.level,player.stats);
	player = new Unit(buildResults);
	player.health = tempHP;
	player.action = tempAP;
	
	//passive skills switchboard
	for(var i=2; i<4; i++){
		switch(actionIndex[i]){
			case 13: player.recovery++; break;
			case 14: player.recovery+=2; break;
			case 15: player.recovery+=3; break;
			case 16: player.recovery+=4; break;
		}
	}
	playerRefresh();
}


//refreshes monster information
function monsterRefresh(){
	monsterHPtext.innerHTML = monster.health+"/"+monster.maxHealth;
	monsterHealthPercentage = (monster.health / monster.maxHealth) * 100;
	monsterHPbar.style.width = monsterHealthPercentage + "%";
}


// attack process  ====================================================================================================
function attack(type){
	var order = 0,
		paid = 0,
		damage = 0,
		damagein = 0,
		monsterClass = monsterType[activeNum],
		temp = 0,
		logDmg,
		logDmgIn,
		logCrit = 0,
		logCritMon = 0,
		logSpecial = 0,
		logBlock = 0,
		logBlockMon = 0,
		logPlayer = "",
		logMonster = "";

	playerDamage(type);
	if(stun == 0 && order == 1){monsterDamage(monsterClass);}

	if(order == 1){
		monsterDefense(damage, monsterClass);
		if(order == 2){
			playerDefense(damagein);
		}
	} else if(order == 3){
		playerDefense(damagein);
		if(order == 4){
			monsterDefense(damage, monsterClass)
		}
	}
	if(stun>0){stun--;}
	if(sunder>0){sunder--;}
	if(wound>0){wound--;}
	//passive skills switchboard
	for(var i=2; i<4; i++){
		switch(actionIndex[i]){
			case 9: if(monster.health > 0){
						if(r(100) < player.crit){
							damage = 0;
							logCrit = 0;
							logBlockMon = 0;
							temp = player.action;
							logSpecial = 1;
							playerDamage(type);
							player.action = temp;
							monsterDefense();
						}
					}
		}	
	}


//player damage function
function playerDamage(type){
	var tempAP = player.action;
	
	
	//ap cost switchboard
	switch(type){
		case 0: player.action = -5; //blocks use
				break;
		//attack
		case 1: break;
		//strong attack
		case 2: player.action -= 1;
				break;
		//noodly slap
		case 3: if(player.action>2){
					player.action = 0;
				} else {player.action = -5;}
				break;
		//sunder		
		case 4: player.action -= 2;
				break;
		//wound
		case 5:	player.action -= 2;
				break;
		//leech
		case 6:	player.action -= 4;
				break;
		//devastate
		case 7: player.action -= 4;
				break;
		//penetrate
		
		//recover
		case 10:break;
		//rejuvinate
		case 11:break;
		//slam
		case 12:player.action -= 3;
				break;

		default:player.action = -5;
				break;
		}

//actionpoint check
	if(player.action < 0){player.action = tempAP;}
	else {
		paid = 1;
		order++;
		logDmg = attacks[type].name;
	}

	//attacking switchboard
	if(paid == 1){
		switch(type){
			case 0: break;
			//attack
			case 1: damage = rdmg(player.attack); 
					break;
			//strong attack
			case 2: damage = rdmg(player.attack) * 2;
					break;
			//noodly slap
			case 3: damage = 200;
					break;
			//sunder		
			case 4: damage = rdmg(player.attack);
					sunder = 3;
					break;
			//wound
			case 5: damage = Math.floor(rdmg(player.attack) * 1.5);
					wound = 3;
					break;
			//leech
			case 6: damage = 0;
					player.health += Math.ceil(rdmg(player.attack) * 3);
					break;
			//devastate
			case 7: damage = rdmg(player.attack) * 5;
					break;
			//penetrate

			//recover
			case 10:player.action += 5;
					break;
			//rejuvinate
			case 11:player.action += 10;
					break;
			//slam
			case 12:damage = 0;
					stun = 1;
					sunder = 4;
					break;

			default:break;
		}
	}

	if(r(100) < player.crit){Math.floor(damage *= 1.5); logCrit = 1;}

}

//monster damage function
function monsterDamage(monsterClass){
	logDmgIn = monsterName;
	if(stun == 0){
		switch(monsterClass){
			case 1: if(r(100) < monster.crit){damagein = rdmg(monster.attack) * 1.5; logCritMon = 1;}
					else {damagein = rdmg(monster.attack);}
					if(r(10) > 5){order = 3;}
					break;
			default: damagein = rdmg(monster.attack);

		}
		if(wound > 0){damagein *= .5}
	}
}

//player defense and defeat conditions
function playerDefense(){
	if(player.blockpwr > 0){
		if(r(100)<player.block){damagein -= (damagein * (player.blockpwr / 100)); logBlock = 1;}
	}
	damagein -= (damagein * (player.armor / 100));
	damagein = Math.floor(damagein);
	player.health -= damagein;
	playerRefresh();
	combatLog(2);

	if(player.health > 0){order++;}
	else {
		stage = 9;
		gameover.style.display = "block";
		gameover.style.animation = "death 2.5s ease-out forwards";
	}
}

//monster defense and victory conditions
function monsterDefense(){
	if(monsterClass == 2){
		if(r(100)<monster.block){damage -= (damage * (monster.blockpwr / 100)); logBlockMon = 1;}
	}
	if(sunder == 0){damage -= (damage * (monster.armor / 100));}
	damage = Math.ceil(damage);
	monster.health -= damage;
	monsterRefresh();
	combatLog(1);

	if(monster.health > 0){order++;}
	else {
		monsterHP.removeChild(monsterHPbar);
		activeBox[0].removeChild(monsterHP);
		activeBox[0].removeChild(monsterHPtext);

		if(monsterClass > 0){
			grantXP(150 + (13*Math.pow((monster.level - player.level),2) ));
			boxes[activeNum].className = "box treasure";
			boxType[activeNum] = 3;
			spawnTreasure(monster.level+100,activeNum);
		} else {
			grantXP(100 + (10*(monster.level - player.level)));
			stage = 1; 
			clearCells();
			setTimeout(populateCells, 1000);
		}
		
	}	
}

function combatLog(unit){
	if(unit == 1){
		if(logCrit == 1){logPlayer = "<span class=crit><strong>"+damage+"</strong></span>";} 
			else if(logSpecial == 1){logPlayer = "<span class=crit>Quickstrike: <strong>"+damage+"</strong></span>";}
			else {logPlayer = "<span class=out>"+damage+"</span>";}
		if(logBlockMon == 1){logPlayer += "<span class=in> (block)</span>";}

		combatlog.innerHTML += logPlayer+"<br>";
	} else if(unit == 2){
		if(logCritMon == 1){logMonster = "<span class=critin><strong>"+damagein+"</strong></span>";} 
			else {logMonster = "<span class=in>"+damagein+"</span>";}
		if(logBlock == 1){logMonster += " (block)";}
		
		combatlog.innerHTML += logMonster+"<br>";
	}
}


}// close attack process =================================================================================================


//xp gain and level-up function
function grantXP(value){
	
	experience += value;
	while(experience >= nextLevel){
		player.level++;
		statPoints += 3;
		experience -= nextLevel;

		nextLevel = Math.floor(5.5 * Math.pow(2.5, (0.022 * player.level)) * 100);

		clicked = 0;
		playerRefresh();
	}
	playerRefresh();
}


//first round player spawner
function spawnPlayer(){
	buildUnit(1,[0,0,0,0,0,0,0,0]);
	player = new Unit(buildResults);
	playerRefresh();
	clearCells();
	setTimeout(function(){
		statPoints += 10;
		playerRefresh();
	},500);
}


//starts game
function gameStart(){
	spawnPlayer();
	slotItem[0] = 1;
	slotItem[1] = 2;
	slotItem[2] = 3;
	slot1.classList.add("equipped");
	slot2.classList.add("equipped");
	slot3.classList.add("equipped");
		for(var i=0; i<7; i++){
			player.stats[i] += items[1].stats[i];
			player.stats[i] += items[2].stats[i];
			player.stats[i] += items[3].stats[i];
		}
	playerBuildRefresh();
}


//resets variables for restart, triggered by death screen
function reinitiate(difficulty) {
	boxLevel = [0,0,0,0];	
	boxType = [0,0,0,0];
	monsterType = [0,0,0,0];
	actionIndex = [1,2,0,0];
	slotItem = [0,0,0,0,0,0,0,0,0,0];
	clicked = 0;
	restingTitle = "";
	restingInfo = "apply your stats<br>then<br>click here to begin";
	stage = 0;
	player = {};
	playerName = "";
	monster = {};
	monsterName = "";
	experience = 0;
	nextLevel = 300;
	statPoints = 0;
	buildResults = [];
	round = 0;
	stun = 0;
	wound = 0;
	sunder = 0;
	gameover.style.display = "none";
	monsterHP.removeChild(monsterHPbar);
	activeBox[0].removeChild(monsterHP);
	activeBox[0].removeChild(monsterHPtext);
	clearCells();
	toolTipClear();
	for(var i in slots){
		slots[i].className = "slot";
	}

	if(difficulty == "easy"){
		statPoints = 15;
		slotItem = [0,0,0,0,0,0,0,6,7,0];
		slots[7].classList.add("potion");
		slots[8].classList.add("potion");
	}
}



//leeeeeeeeeroy jenkins
gameStart();










