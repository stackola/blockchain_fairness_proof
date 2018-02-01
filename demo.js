
function draw(bets, blockhash) {
	// sort bets by corresponding txid.
	// 0-9, a-z
	bets = bets.sort((a, b) => {
		return a.txid.localeCompare(b.txid);
	});

	// Find the total of the bets
	var total = bets.map((b) => b.amount).reduce((a, b) => a + b);
	total=txRound(total);
	// seed the random number generator with the blockhash

	var rng = uheprng.create(blockhash);
	//Generate random number between 0(inc) and the total of the round(excl)
	var winningAmount = rng.floatBetween(0, total);

	// go through the bets on by one, and check if the bet occupies the exact winning value
	var runningTotal = 0;
	var winner = {};
	var space = {};
	var winnerFound = false;

	bets.map((b) => {
		runningTotal += b.amount;
		if (runningTotal > winningAmount && !winnerFound) {
			//we have a winner.
			winnerFound = true;
			winner = b;
			space = {
				from: txRound(runningTotal - b.amount),
				to: txRound(runningTotal),
			};
		}
	});

	//at this point we have a winner.
	var output="";	
	output +=("Total possible range:") + '\n';
	output +=("0(incl) to "+total+"(excl)") + '\n';
	output +=("RNG Output:") + '\n';
	output +=(winningAmount) + '\n';
	output +=("Winner:") + '\n';
	output +=(winner.name) + '\n';
	output +=("Occupied by winner:") + '\n';
	output +=(space.from+"(incl) to "+space.to+"(excl)") + '\n';
	document.getElementById("output").value = output;
}

//round to 6 digits, max precission of the website.
function txRound(number) {
	var factor = Math.pow(10, 6);
	return Math.round(number * factor) / factor;
}



function buttonClicked(){
	var roundData = document.getElementById("roundData").value;
	var blockhash = document.getElementById("blockhash").value;
	var bets = parseInput(roundData);
	draw(bets, blockhash);
}

function parseInput(roundData){
	var bets = roundData.split("\n").map((l)=>{
		var lineArray = l.split("; ");
		return {
			name: lineArray[0],
			amount: Number(lineArray[1]),
			txid: lineArray[2],
		}
	});
	console.log(bets);
	return bets;
}