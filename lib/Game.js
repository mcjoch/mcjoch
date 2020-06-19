sap.ui.define([
	"sap/ui/base/Object",
	"mj/toepen/lib/AIPlayer",
	"mj/toepen/lib/ScriptedPlayer",
	"mj/toepen/lib/HumanPlayer",
	"mj/toepen/lib/Card",
	'sap/m/MessageToast'
], function(BaseObject, AIPlayer, ScriptedPlayer, HumanPlayer, Card, MessageToast) {
	"use strict";

	return BaseObject.extend("mj.toepen.Game", {

		// All players
		players: [],
		// Human player
		player: {},
		// Deck
		deck: [],
		// Played cards
		cardsOnBoard: [],
		maxPoints: null,
		stake: 1,
		consoleText: "",

		/**
		 * @param {string} sType - node type
		 */
		constructor: function(oController, iNumPlayers) {
			this.oController = oController;

		},

		start: function(iNumPlayers, iMaxPoints) {
			this.setupPlayers(iNumPlayers);
			this.maxPoints = iMaxPoints;
			this.createDeck();
			this.shuffle();

			this.dealCards();

			this.randomPlayer().setCurrentTurn();
		},

		finishToep: function(resolve) {
			this.toepInProgress = false;
			this.stake += 1;

			// If only one player remains afyer toep that player won
			if (this.remainingPlayersInRound().length === 1) {
				this.declareWinnerOfRound(this.remainingPlayersInRound()[0]);
			} else if (resolve) {
				resolve();
			}

			return this.oController.redraw();
		},

		createDeck: function() {
			this.deck = [];
			var suits = ["spades", "diamonds", "clubs", "hearts"];
			var values = ["J", "Q", "K", "A", "7", "8", "9", "10"];

			for (var i = 0; i < suits.length; i++) {
				for (var x = 0; x < values.length; x++) {
					var card = new Card(values[x], suits[i]);
					this.deck.push(card);
				}
			}
		},

		dealCards: function() {
			this.remainingPlayersInGame().forEach(function(oPlayer) {
				oPlayer.hand = [];
				oPlayer.folded = false;
				for (var i = 0; i < 4; i++) {
					oPlayer.hand.push(this.deck.pop());
				}
			}.bind(this));
		},

		playCard: function(oCard) {
			this.cardsOnBoard.push(oCard);
			this.writeConsole(oCard.playedBy.name + " plays " + oCard.suit + " " + oCard.value);
			this.oController.redraw();

			setTimeout(function() {
				// Last card
				if (this.allPlayersPlayedCard()) {
					this.pickWinner();
				} else {
					setTimeout(function() {
						var oNextPlayer = oCard.playedBy.getNextPlayer();
						oNextPlayer.setCurrentTurn();
						this.oController.redraw();
					}.bind(this), 500);
				}

				this.oController.redraw();
			}.bind(this), 500);
		},

		writeConsole: function(sText) {
			this.consoleText = (sText + "\n") + this.consoleText;
		},

		pickWinner: function() {
			var bestCard = this.getBestCard();

			bestCard.won = true;
			var oWinner = bestCard.playedBy;

			this.declareWinnerOfRound(oWinner);
		},

		getBestCard: function() {

			if (!this.cardsOnBoard.length) {
				return null;
			}

			var bestCard = this.cardsOnBoard[0];

			this.cardsOnBoard.forEach(function(oCard) {
				if (oCard.suit !== bestCard.suit) {
					return;
				}

				if (oCard.playedBy.folded) {
					return;
				}

				if (oCard.getRank() > bestCard.getRank()) {
					bestCard = oCard;
				}
			});

			return bestCard;
		},

		showMessage: function(sMessage) {
			MessageToast.show(sMessage, {
				duration: 3000, // default
				width: "15em", // default
				my: "center center", // default
				at: "center top", // default
				of: window, // default
				offset: "0 100", // default
				collision: "fit fit", // default
				onClose: null, // default
				autoClose: true, // default
				animationTimingFunction: "ease", // default
				animationDuration: 1000, // default
				closeOnBrowserNavigation: true // default
			});
		},

		declareWinnerOfRound: function(oWinner) {

			if (oWinner.folded) {
				this.showMessage(oWinner.name + " won the round but folded!");
				setTimeout(function() {
					this.declareWinnerOfRound(oWinner.nextPlayer);
				}.bind(this), 1500);
			}

			this.showMessage(oWinner.name + " won the round!");

			// Highlight the winner
			oWinner.setCurrentWinner(true);

			// Won on last card - assign points
			if (oWinner.hand.length === 0 || this.remainingPlayersInRound().length === 1) {
				this.declareWinner(oWinner);
				this.oController.redraw();
			} else {
				// Play next hand
				setTimeout(function() {
					this.cardsOnBoard = [];
					oWinner.setCurrentWinner(false);
					oWinner.setCurrentTurn();
					this.oController.redraw();
				}.bind(this), 2000);
			}
		},

		declareWinner: function(oWinner) {
			// Give points
			this.remainingPlayersInRound().forEach(function(oPlayer) {
				if (oPlayer === oWinner) {
					return;
				}
				oPlayer.assignPoints(this.stake);
			}.bind(this));

			// Deal next hand
			setTimeout(function() {
				if (this.remainingPlayersInGame().length === 1) {
					return this.declareFinalWinner(oWinner);
				}

				this.dealNextRound(oWinner);

			}.bind(this), 2000);
		},

		remainingPlayersInGame: function() {
			return this.players.filter(function(oPlayer) {
				return !oPlayer.dead;
			});
		},

		remainingPlayersInRound: function() {
			return this.players.filter(function(oPlayer) {
				return !oPlayer.dead && !oPlayer.folded;
			});
		},

		dealNextRound: function(oWinner) {
			oWinner.setCurrentWinner(false);
			this.cardsOnBoard = [];

			this.createDeck();
			this.shuffle();

			this.lastToeper = null;
			this.stake = 1;
			this.dealCards();

			oWinner.setCurrentTurn();
			this.oController.redraw();
		},

		declareFinalWinner: function(oWinner) {
			this.showMessage(oWinner.name + " won the game!");

			setTimeout(function() {
				if (oWinner.name === "Player") {
					this.loadVengaBoys();
				}
			}.bind(this), 1000);

		},

		shuffle: function() {
			// for 1000 turns
			// switch the values of two random cards
			for (var i = 0; i < 1000; i++) {
				var location1 = Math.floor((Math.random() * this.deck.length));
				var location2 = Math.floor((Math.random() * this.deck.length));
				var tmp = this.deck[location1];

				this.deck[location1] = this.deck[location2];
				this.deck[location2] = tmp;
			}
		},

		setupPlayers: function(iNumPlayers) {
			var iNumAIs = iNumPlayers - 1;
			var aPlayerName = ["Cathy", "Greg", "Andrew"];

			this.player = new HumanPlayer();
			this.players.push(this.player);
			this.player.init(this);

			for (var i = 0; i < iNumAIs; i++) {
				if (i === 2) {
					var oAI = new ScriptedPlayer();
				} else {
					var oAI = new AIPlayer();
				}
				oAI.init(this);
				oAI.setName(aPlayerName[i]);
				this.players[i].setNextPlayer(oAI);

				this.players.push(oAI);
			}

			this.players[iNumAIs].setNextPlayer(this.player);

		},

		randomPlayer: function() {
			var iRandomIndex = Math.floor(Math.random() * this.players.length);

			return this.players[iRandomIndex];
		},

		allPlayersPlayedCard: function() {
			var aRemainingPlayers = this.remainingPlayersInRound().filter(function(oPlayer) {
				return !oPlayer.hasPlayedCard();
			});

			return aRemainingPlayers.length === 0;
		},

		loadVengaBoys: function() {
			window.location.replace('https://www.youtube.com/watch?v=fdgz5T_vXc8');
		}

	});
});