const cardArray = {
    color: [
        {
            id: 'C',
        },
        {
            id: 'S',
        },
        {
            id: 'D',
        },
        {
            id: 'H',
        } 
    ],
    number: [
        {
            id: 'A',
        },
        {
            id: '2',
        },
        {
            id: '3',
        },
        {
            id: '4',
        },
        {
            id: '5',
        },
        {
            id: '6',
        },
        {
            id: '7',
        },
        {
            id: '8',
        },
        {
            id: '9',
        },
        {
            id: '10',
        },
        {
            id: 'J',
        },
        {
            id: 'Q',
        },
        {
            id: 'K',
        },
        
    ]
    
}

type Cards = {card: string; cardValue: string; flipped: boolean }[];

const MAX_ATTEMPTS = 100;

const generateCard = (): { card: string; cardValue: string } => {
    const randomColor = Math.floor(Math.random() * 4)
    const cardColor = cardArray.color[randomColor].id; 
    const cardNumberIndex = Math.floor(Math.random() * 13);
    const cardValue = cardArray.number[cardNumberIndex].id;

    const card = cardColor + cardValue;

    return { card, cardValue };
}


export const getNewCard = (playerCards: Cards): Cards => {
    if (playerCards.length < 2) {
        const initialCards: string[] = [];
        let attempts = 0;
        const flipped = false;
        
        while (initialCards.length < 2 && attempts < MAX_ATTEMPTS) {
            const newCard = generateCard();

            if (!initialCards.includes(newCard.card) && !playerCards.some(p => p.card === newCard.card)) {
                initialCards.push(newCard.card);
            }
            attempts++;
        }

        if (attempts >= MAX_ATTEMPTS) {
            console.error("Reached max card drawing attempts.");
        }

        return initialCards.map(card => {
            const cardValue = card.slice(1);
            return { card, cardValue, flipped };
        });
    }

    const singleCard = generateCard();
    return [{ card: singleCard.card, cardValue: singleCard.cardValue, flipped: false }];
};


export function calculateScore(cards: Cards): number {
    let total = 0;
    let aceCount = 0;
  
    cards.forEach(card => {
      if (card.cardValue === 'A') {
        aceCount += 1;
        total += 11;
      } else if (['K', 'Q', 'J'].includes(card.cardValue)) {
        total += 10;
      } else {
        total += parseInt(card.cardValue, 10);
      }
    });
  
    // ace value if total exceeds 21
    while (total > 21 && aceCount > 0) {
      total -= 10;
      aceCount -= 1;
    }
  
    return total;
  }
  