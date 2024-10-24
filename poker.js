document.addEventListener('DOMContentLoaded', () => {
    const playerHandElement = document.getElementById('player-hand');
    const npcHandElement = document.getElementById('npc-hand');
    const communityCardsElement = document.getElementById('community-cards');
    const playerCoinsElement = document.getElementById('player-coins');
    const npcCoinsElement = document.getElementById('npc-coins');
    const messageElement = document.getElementById('message');
    
    const suits = ['♠', '♥', '♦', '♣'];
    const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
    
    let deck = [];
    let playerHand = [];
    let npcHand = [];
    let communityCards = [];
    let playerCoins = 1000;
    let npcCoins = 1000;
    let pot = 0;
    let stage = 0;
    
    // Initialize deck
    function createDeck() {
        deck = [];
        for (let suit of suits) {
            for (let value of values) {
                deck.push({ value, suit });
            }
        }
    }
    
    // Shuffle deck
    function shuffleDeck() {
        for (let i = deck.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [deck[i], deck[j]] = [deck[j], deck[i]];
        }
    }
    
    // Deal cards to player and NPC
    function dealHands() {
        playerHand = [];
        npcHand = [];
        communityCards = [];
        stage = 0;
        pot = 0;
        
        playerHand.push(deck.pop(), deck.pop());
        npcHand.push(deck.pop(), deck.pop());
        
        displayCards(playerHand, playerHandElement);
        displayCards(npcHand, npcHandElement, true); // Hide NPC hand at first
        
        messageElement.textContent = 'Place your bets!';
        toggleButtons(true);
    }
    
    // Deal community cards in stages: Flop (3), Turn (1), River (1)
    function dealCommunityCards() {
        if (stage === 0) {
            // Flop
            communityCards.push(deck.pop(), deck.pop(), deck.pop());
            messageElement.textContent = 'Bet after Flop!';
        } else if (stage === 1) {
            // Turn
            communityCards.push(deck.pop());
            messageElement.textContent = 'Bet after Turn!';
        } else if (stage === 2) {
            // River
            communityCards.push(deck.pop());
            messageElement.textContent = 'Final round of betting after River!';
            document.getElementById('reveal').disabled = false;
        }
        
        displayCards(communityCards, communityCardsElement);
        stage++;
    }
    
    // Display cards
    function displayCards(cards, element, hide = false) {
        element.innerHTML = '';
        cards.forEach(card => {
            const cardElement = document.createElement('div');
            cardElement.classList.add('card');
            if (hide) {
                cardElement.textContent = '??'; // Hide NPC cards initially
            } else {
                cardElement.textContent = `${card.value}${card.suit}`;
            }
            element.appendChild(cardElement);
        });
    }
    
    // Reveal NPC hand
    function revealHands() {
        displayCards(npcHand, npcHandElement);
        compareHands();
    }
    
    // Compare hands (simple hand comparison for now)
    function compareHands() {
        // Basic comparison: highest card wins
        const playerHighCard = Math.max(...playerHand.map(card => values.indexOf(card.value)));
        const npcHighCard = Math.max(...npcHand.map(card => values.indexOf(card.value)));
        
        if (playerHighCard > npcHighCard) {
            playerCoins += pot;
            messageElement.textContent = `You win ${pot} coins!`;
        } else if (npcHighCard > playerHighCard) {
            npcCoins += pot;
            messageElement.textContent = `Opponent wins ${pot} coins!`;
        } else {
            messageElement.textContent = `It's a tie!`;
        }
        updateCoins();
        toggleButtons(false);
    }
    
    // Betting
    function bet() {
        if (playerCoins >= 100 && npcCoins >= 100) {
            playerCoins -= 100;
            npcCoins -= 100;
            pot += 200;
            updateCoins();
            messageElement.textContent = `You bet 100 coins!`;
            dealCommunityCards();
        } else {
            messageElement.textContent = `Not enough coins to bet!`;
        }
    }
    
    // Fold
    function fold() {
        npcCoins += pot;
        messageElement.textContent = 'You folded! Opponent wins the pot.';
        updateCoins();
        toggleButtons(false);
    }
    
    // Update displayed coin amounts
    function updateCoins() {
        playerCoinsElement.textContent = playerCoins;
        npcCoinsElement.textContent = npcCoins;
    }
    
    // Toggle buttons (bet/fold)
    function toggleButtons(enable) {
        document.getElementById('bet').disabled = !enable;
        document.getElementById('fold').disabled = !enable;
    }
    
    // Event listeners
    document.getElementById('deal').addEventListener('click', () => {
        createDeck();
        shuffleDeck();
        dealHands();
        document.getElementById('reveal').disabled = true;
        communityCardsElement.innerHTML = '';
        pot = 0;
    });
    
    document.getElementById('bet').addEventListener('click', bet);
    document.getElementById('fold').addEventListener('click', fold);
    document.getElementById('reveal').addEventListener('click', revealHands);
});
