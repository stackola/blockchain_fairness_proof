var gen = require('random-seed');
// bets = [
// 	{ name: 'Player A', txid: 'zaa7567', amount: 25 },
// 	{ name: 'Player B', txid: 'aaa7567', amount: 25 },
// 	{ name: 'Player C', txid: 'caa7567', amount: 50 }
// ];


function draw(bets, blockhash) {
	// sort bets by corresponding txid.
	// 0-9, a-z
	bets = bets.sort((a, b) => {
		return a.txid.localeCompare(b.txid);
	});

	// Find the total of the bets
	var total = bets.map((b) => b.amount).reduce((a, b) => a + b);

	// seed the random number generator with the blockhash

	var rng = gen.create(blockhash);
	//Generate random number between 0(inc) and the total of the round(excl)
	var winningAmount = rng.floatBetween(0, total);

	// go through the bets on by one, and check if the bet occupies the exact winning value
	var runningTotal = 0;
	var winner = {};
	var winnerFound = false;

	bets.map((b) => {
		runningTotal += b.amount;
		if (runningTotal > winningAmount && !winnerFound) {
			//we have a winner.
			winnerFound = true;
			winner = b;
		}
	});

	//at this point we have a winner.
	console.log(winner);
}
