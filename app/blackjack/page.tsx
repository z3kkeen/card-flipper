'use client'
import { useState, useEffect } from "react";
import { getNewCard, calculateScore } from "./logic";
import { motion } from "motion/react"
import Image from "next/image";
import { AnimatePresence } from "motion/react";

type CardType = { card: string; cardValue: string; flipped: boolean; };

const sourceArray = {
  color: [
    { id: 'C', source: '/C' },
    { id: 'S', source: '/S' },
    { id: 'D', source: '/D' },
    { id: 'H', source: '/H' },
  ],
  number: [
    { id: 'A', source: 'A.png' },
    { id: '2', source: '2.png' },
    { id: '3', source: '3.png' },
    { id: '4', source: '4.png' },
    { id: '5', source: '5.png' },
    { id: '6', source: '6.png' },
    { id: '7', source: '7.png' },
    { id: '8', source: '8.png' },
    { id: '9', source: '9.png' },
    { id: '10', source: '10.png' },
    { id: 'J', source: 'J.png' },
    { id: 'Q', source: 'Q.png' },
    { id: 'K', source: 'K.png' },
  ],
};

export default function Game() {
  const [playerCards, setPlayerCards] = useState<CardType[]>([]);
  const [dealerCards, setDealerCards] = useState<CardType[]>([]);
  const [showStart, setShowStart] = useState(true);
  const [dealerScore, setDealerScore] = useState(0);
  const [playerScore, setPlayerScore] = useState(0);
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);

  const handleStart = () => {
    setShowStart(false);
    const initialPlayerCards = getNewCard([]).map(card => ({ ...card, flipped: false }));
    const initialDealerCards = getNewCard([]).map(card => ({ ...card, flipped: false }));
    setPlayerCards(initialPlayerCards);
    setDealerCards(initialDealerCards);

    setTimeout(() => {
      setPlayerCards(prev => prev.map(card => ({ ...card, flipped: true })));
    }, 500);
  };

  const drawCard = () => {
    const newCard = getNewCard(playerCards).map(card => ({ ...card, flipped: false }));
    setPlayerCards(prevCards => [...prevCards, ...newCard]);

    setTimeout(() => {
      setPlayerCards(prev => prev.map((card, index) =>
        index === prev.length - 1 ? { ...card, flipped: true } : card
      ));
    }, 500);
  };

  const handleStand = () => {
    setIsPlayerTurn(false);
  };

  useEffect(() => {
    if (!isPlayerTurn) {
      const dealerPlay = async () => {
        let dealerTotal = calculateScore(dealerCards);
  
        while (dealerTotal < 17) {
          const newCard = getNewCard(dealerCards);
          setDealerCards(prevCards => {
            const updatedCards = [...prevCards, ...newCard];
            dealerTotal = calculateScore(updatedCards);
            return updatedCards;
          });
  
          await new Promise(resolve => setTimeout(resolve, 1000)); 
        }
  
        const playerTotal = calculateScore(playerCards);
        dealerTotal = calculateScore(dealerCards); 

        setTimeout(() => {
          setDealerCards(prev =>
            prev.map((card, index) =>
              index === prev.length - 1 ? { ...card, flipped: true } : card
            )
          );
        }, 1000);
      
      setTimeout(() => {
        setDealerCards(prev => prev.map(card => ({ ...card, flipped: true })));
      }, 500);
    

        if (dealerTotal === 21 && dealerCards.length === 2) {
          console.log("Dealer has blackjack! Dealer wins.");
          setDealerScore(prevScore => prevScore + 1);
        } else if (playerTotal === 21 && playerCards.length === 2) {
          console.log("Player has blackjack! Player wins.");
          setPlayerScore(prevScore => prevScore + 1);
        } else if (dealerTotal > 21) {
          console.log("Dealer busts! Player wins.");
          setPlayerScore(prevScore => prevScore + 1);
        } else if (playerTotal > 21) {
          console.log("Player busts! Dealer wins.");
          setDealerScore(prevScore => prevScore + 1);
        } else if (dealerTotal > playerTotal) {
          console.log("Dealer wins!");
          setDealerScore(prevScore => prevScore + 1);
        } else if (dealerTotal === playerTotal) {
          console.log("It's a tie!");
        } else {
          console.log("Player wins!");
          setPlayerScore(prevScore => prevScore + 1);
        }
  
        resetGame();
      };
  
      dealerPlay();
    }
  }, [isPlayerTurn, dealerCards, playerCards]);

  useEffect(() => {
    const playerTotal = calculateScore(playerCards);
    if (playerTotal > 21) {
      console.log("Player busts! Dealer wins.");
      setDealerScore(prevScore => prevScore + 1);
      resetGame();
    }
  }, [playerCards]);
  
  const resetGame = async () => {
    await new Promise(resolve => setTimeout(resolve, 2000));

    setShowStart(true);
    setPlayerCards([]);
    setDealerCards([]);
    setIsPlayerTurn(true);
  };
  
const cardRender = (cards: CardType[]) => {
  return (
    <ul className="flex gap-2">
      <AnimatePresence>
        {cards.map((card, index) => {
          const colorID = card.card[0];
          const numberID = card.card.length === 3 ? card.card.slice(1, 3) : card.card[1];

          const colorSource = sourceArray.color.find(c => c.id === colorID);
          const numberSource = sourceArray.number.find(n => n.id === numberID);

          const frontSource = colorSource!.source + numberSource?.source;
          const blueBackSource = "/back-blue.png";

          return (
            <motion.li
              key={`${card.card}-${index}`}
              className="w-28 relative"
              initial={{ opacity: 0, rotateY: 180 }}
              animate={{ opacity: 1, rotateY: card.flipped ? 0 : 180 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Image
                src={card.flipped ? frontSource : blueBackSource}
                alt={card.card}
                width={200}
                height={200}
                className="absolute backface-hidden"
              />
            </motion.li>
          );
        })}
      </AnimatePresence>
    </ul>
  );
}

return (   
  <div className="h-full w-full flex items-center">
    <section className="bg-[#405068] h-full w-[50%] flex justify-center items-center flex-col gap-2">
      <div className="flex justify-center items-center h-40 w-40 mb-20 ">
        {cardRender(playerCards)}
      </div>

      <div className="flex gap-2 justify-center items-center">
        {showStart ? (
          <button onClick={handleStart} className="bg-white flex justify-center items-center px-3 py-1 rounded-lg mb-10"><b>start</b></button>
        ) : (
          <>
            <button onClick={drawCard} className="bg-white px-2 mb-10">hit</button>
            <button onClick={handleStand} className="bg-white px-2 mb-10">stand</button>
          </>
        )}
      </div>
</section>

    <div id="line" className="w-[2px] h-full bg-amber-700"></div>
      <div className="px-2 h-full flex justify-center items-center flex-col bg-yellow-900">
        <h1 className="align-middle text-white text-2xl">
          <strong>{dealerScore} <br />-<br /> {playerScore}</strong>
        </h1>
      </div>
    <div id="line" className="w-[2px] h-full bg-amber-700"></div>

    <section className="bg-[#684040] h-full w-[50%] flex justify-center items-center flex-col gap-2">
      <div className="flex justify-center items-center h-40 w-40 mb-36 ">
        {cardRender(dealerCards)}
      </div>
    </section>
  </div>
)}  