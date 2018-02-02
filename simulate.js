var winners={};
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


	if (winners[winner.txid]){
		winners[winner.txid].winCount++;
	}
	else
	{
		winners[winner.txid]={winCount:1, bet:winner};
	}
	//at this point we have a winner.
	/*
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
	*/
}

//round to 6 digits, max precission of the website.
function txRound(number) {
	var factor = Math.pow(10, 6);
	return Math.round(number * factor) / factor;
}



function buttonClicked(){
	var roundData = document.getElementById("roundData").value;
	var bets = parseInput(roundData);
	// for each hash, simulate the round.
	hashes.map((h)=>{
			draw(bets, h);
		});

	console.log(winners);

	var total = bets.map((b) => b.amount).reduce((a, b) => a + b);
	total=txRound(total);
	output= hashes.length+" rounds played.\nTotal pot: "+total+"\n";
	bets.map((b)=>{
		var w=winners[b.txid];
		output+=w.bet.name+" won "+w.winCount+" times."+"\n";
		output+="Odds: "+(w.bet.amount/total)*100+"% | Actual: "+(w.winCount/hashes.length)*100+"%\n\n";
	});

	document.getElementById("output").value = output;
	
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