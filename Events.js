var avgCrateInterval = 60;	//average interval between crates

function runEvents() {	//controls all events that happen during the game
	
	if(Math.random() >= 1 - 1 / avgCrateInterval) {	//controls crate spawning
		crateStack(100, 100*(Math.random()-0.5), Math.random()*2*Math.PI, worldSpeed, 0, (Math.random()-0.5)*20, 1, 1, Math.random()*5, Math.random()*5, 200, 50, 0);
	}
	if(Math.random() >= (1-0.005/(enemyList.length+1)) && enemyList.length < 5) {
		enemyList.push(spawn());
	}
}
