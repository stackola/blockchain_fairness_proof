# Fairness proof for blockchain based jackpot games


## [Click here to go to the garlicky.fun round validator](https://stackola.github.io/blockchain_fairness_proof/)

## [Click here to simulate a garlicky.fun round over 29000 blockhashes](https://stackola.github.io/blockchain_fairness_proof/simulate.html)



This project implements a fair, reproducible lottery drawing based only on inputs from a public blockchain.

# Game description

The game in questing is a jackpot/lottery game, where several people put different amounts into a pot, and a winner is randomly selected. The chances to win are equivalent to the percentage of the pot you have wagered.

Example:

* Player A: 25 Tokens 
* Player B: 25 Tokens 
* Player C: 50 Tokens

In this case, Player A and B both have a 25% chance to win, while Player C has a 50% chance.

# Reproducible draw, fairness

Neither the site owner, nor any of the players should be able to influence or predict the outcome of a round.

To achieve this, several elements of the blockchain are used to determine the result.

# 1. Transaction IDs

When all the entries for a round have been selected, they are sorted by their blockchain transaction id. While an attacker can have a small amount of influence over his own txid, there's no way for him to predict or influence the txids of other user's transactions.

# 2. The most recent blockhash

Next, an [open source random generator](https://github.com/skratchdot/random-seed) is seeded with the most recent blockhash (at the time of the drawing). Since any bets require a certain amount of confirmations on the blockchain, an attacker would have to predict the blockhas at least this many blocks in advance. Eg. with 4 required confirmations, the attacker would have to predict the blockhash 4 blocks into the future, along with all the transaction ids mentioned in the previous paragraph


# 3. Determining the winner
The bets have been sorted and each represent a range or values now. In the given example. this could look like this:

* Player B: 0 - 25 (exluding 25)
* Player C: 25 - 75 (exluding 75)
* Player A: 75 - 100 (exluding 100)

As mentioned, the order is only determined by the transaction ids.

A random float between 0(incl.) and the total(excl.) (eg. 100) is created via the previously seeded random number generator. This is the winning amount.

In this case, if the rng returns 24.99999, Player B wins. If it returns 25, Player C wins. 


# Reproducing the draw
After each round, all the required values are published. These include:

* all the transactions, with their value and txid
* the time of the drawing
* the blockhash used for the rng

These values can be either verified manually, or using this open source repository.

# 3. Pseudocode:


```Pseudocode
// it does not matter wether you sort lexigraphically or by value
sort bets by transactionid
total = sum of bets
rng = new rng seeded with blockhash
//Returns a random number between 0 (included) and total (exluded)
randomValue = rng -> getNumberBetween(0, total);
runningTotal = 0
for each bet:
    runningTotal+=bet.amount
    if runningTotal > randomValue:
        //winner found
        winner = bet
        //leave the loop
        break
```



# Actual code:

```Javascript
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
```
