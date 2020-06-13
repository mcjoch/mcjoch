sap.ui.define([
	"sap/ui/base/Object",
	"mj/toepen/lib/AIPlayer",
	"mj/toepen/lib/HumanPlayer",
	"mj/toepen/lib/Card"
], function(BaseObject, AIPlayer, HumanPlayer, Card) {
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
		
		consoleText: "",

		/**
		 * @param {string} sType - node type
		 */
		constructor: function(oController, iNumPlayers) {
			this.oController = oController;
			
		
		},
		
		start: function(iNumPlayers) {
			this.setupPlayers(iNumPlayers);

			this.createDeck();
			this.shuffle();
			
			this.dealCards();
			
			this.randomPlayer().setCurrentTurn();
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
			this.players.forEach(function(oPlayer) {
				for (var i = 0; i < 4; i++) {
					oPlayer.hand.push(this.deck.pop());
				}
			}.bind(this));
		},
		
		playCard:function(oCard) {
			this.cardsOnBoard.push(oCard);
			
			this.writeConsole(oCard.playedBy.name + " plays " + oCard.suit + " " + oCard.value);
			
			// Last card
			if (this.cardsOnBoard.length === this.players.length) {
				this.pickWinner();
			} else {
				var oNextPlayer = oCard.playedBy.getNextPlayer();
				oNextPlayer.setCurrentTurn();
			}
			
			this.oController.redraw();
		},
		
		writeConsole: function(sText) {
			this.consoleText = (sText + "\n") + this.consoleText;
		},
		
		pickWinner: function() {
			var bestCard = this.cardsOnBoard[0];
			
			this.cardsOnBoard.forEach(function(oCard) {
				if (oCard.suit !== bestCard.suit) {
					return;
				}
				
				if (oCard.getRank() > bestCard.getRank()) {
					bestCard = oCard;
				}
			});
			
			bestCard.won = true;
			var oWinner = bestCard.playedBy;
			
			this.writeConsole(oWinner.name + " wins the hand");
			
			// Won on last card
			if (oWinner.hand.length === 0) {
				this.declareWinner(oWinner);
			} else {
				setTimeout(function(){
					this.cardsOnBoard = [];
					oWinner.setCurrentTurn();
					this.oController.redraw();
				}.bind(this), 2000);
			}
		},
		
		declareWinner: function(oWinner) {
			this.writeConsole(oWinner.name + " wins the game");
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
			
			this.player = new HumanPlayer();
			this.players.push(this.player);
			this.player.init(this);

			for (var i = 0; i < iNumAIs; i++) {
				var oAI = new AIPlayer();
				oAI.init(this);
				oAI.setName("AI " + i);
				this.players[i].setNextPlayer(oAI);
				
				this.players.push(oAI);
			}
			
			this.players[iNumAIs].setNextPlayer(this.player);
			
		},
		
		randomPlayer: function() {
			var iRandomIndex = Math.floor(Math.random() * this.players.length);
			
			return this.players[iRandomIndex];
		}

	});
});