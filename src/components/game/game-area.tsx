"use client";

import { useState, useEffect } from "react";
import type { Card as CardType } from "@/lib/game";
import { createDeck, shuffleDeck, dealCard, compareCards } from "@/lib/game";
import { CardDisplay } from "@/components/game/card-display";
import { Button } from "@/components/ui/button";
import { ReloadIcon } from "@radix-ui/react-icons"; // Use Radix ReloadIcon
import { Trophy } from "lucide-react"; // Use Lucide Trophy icon

type GameState = "initial" | "playing" | "result";
type Winner = "player" | "computer" | "tie" | null;

export function GameArea() {
  const [deck, setDeck] = useState<CardType[]>([]);
  const [playerCard, setPlayerCard] = useState<CardType | null>(null);
  const [computerCard, setComputerCard] = useState<CardType | null>(null);
  const [gameState, setGameState] = useState<GameState>("initial");
  const [winner, setWinner] = useState<Winner>(null);
  const [isDealing, setIsDealing] = useState(false); // For animation control
  const [playerScore, setPlayerScore] = useState(0); // Player score state
  const [computerScore, setComputerScore] = useState(0); // Computer score state

  useEffect(() => {
    // Initialize deck on component mount
    initializeGame();
  }, []);

   // Separated initialization logic to avoid resetting scores on "New Game"
  const initializeGame = () => {
    const newDeck = createDeck();
    const shuffled = shuffleDeck(newDeck);
    setDeck(shuffled);
    setPlayerCard(null);
    setComputerCard(null);
    setGameState("initial");
    setWinner(null);
    setIsDealing(false);
  }

  const startNewGame = () => {
     initializeGame(); // Resets deck and cards, keeps scores
  };

  const resetScores = () => {
    setPlayerScore(0);
    setComputerScore(0);
    // Optionally start a new game when resetting scores
    startNewGame();
  }


  const handleDraw = () => {
    if (deck.length < 2) {
      alert("Not enough cards left! Starting a new game.");
      startNewGame();
      return;
    }

    setIsDealing(true);
    setPlayerCard(null); // Reset cards for animation
    setComputerCard(null);
    setWinner(null);
    setGameState('playing');

    let remainingDeck = [...deck];
    let pCard: CardType | null;
    let cCard: CardType | null;

    // Deal player card
    ({ card: pCard, remainingDeck } = dealCard(remainingDeck));

    // Deal computer card
    ({ card: cCard, remainingDeck } = dealCard(remainingDeck));

    setDeck(remainingDeck);

    // Stagger the reveal for animation effect
    setTimeout(() => {
      setPlayerCard(pCard);
      setTimeout(() => {
        setComputerCard(cCard);
        if (pCard && cCard) {
            const result = compareCards(pCard, cCard);
            setWinner(result);
            // Update scores based on the result
            if (result === "player") {
              setPlayerScore((prevScore) => prevScore + 1);
            } else if (result === "computer") {
              setComputerScore((prevScore) => prevScore + 1);
            }
            setGameState("result");
        }
        setIsDealing(false); // Animation finished
      }, 500); // Delay computer card reveal
    }, 100); // Delay player card reveal slightly
  };

  const getResultMessage = () => {
    switch (winner) {
      case "player":
        return "You Win!";
      case "computer":
        return "Computer Wins!";
      case "tie":
        return "It's a Tie!";
      default:
        return "";
    }
  };

  const getResultColor = () => {
     switch (winner) {
      case "player":
        return "text-secondary"; // Gold for win
      case "computer":
        return "text-accent"; // Red for loss
      case "tie":
        return "text-foreground"; // Default for tie
      default:
        return "";
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-background text-foreground">
      <h1 className="text-4xl font-bold mb-6 text-secondary">Ace Showdown</h1>

       {/* Score Display */}
      <div className="flex justify-around w-full max-w-xs mb-6 text-xl">
        <div className="text-center">
          <div className="font-semibold">You</div>
          <div className="text-3xl font-bold text-secondary">{playerScore}</div>
        </div>
        <div className="text-center">
          <div className="font-semibold">Computer</div>
          <div className="text-3xl font-bold text-accent">{computerScore}</div>
        </div>
      </div>

      <div className="flex justify-around w-full max-w-md mb-8 min-h-[15rem] items-start"> {/* Added min-height */}
        <div className="flex flex-col items-center">
          <h2 className="text-xl mb-2">Your Card</h2>
          <CardDisplay card={playerCard} animate={gameState === 'playing' || gameState === 'result'} />
        </div>
        <div className="flex flex-col items-center">
          <h2 className="text-xl mb-2">Computer's Card</h2>
          <CardDisplay card={computerCard} facedown={gameState === 'initial' || (gameState === 'playing' && !computerCard)} animate={gameState === 'playing' || gameState === 'result'}/>
        </div>
      </div>

      {gameState === "result" && (
        <div className={`text-3xl font-bold mb-6 ${getResultColor()}`}>
          {getResultMessage()}
        </div>
      )}

      <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4">
         <div className="flex space-x-4">
            <Button
            onClick={handleDraw}
            disabled={isDealing || deck.length < 2}
            variant="destructive" // Use red accent button
            size="lg"
            className="bg-accent hover:bg-accent/90 text-accent-foreground w-36" // Fixed width
            >
            {gameState === 'initial' ? 'Draw Cards' : 'Draw Again'}
            </Button>
            <Button
            onClick={startNewGame}
            variant="outline"
            size="lg"
            className="border-secondary text-secondary hover:bg-secondary/10 hover:text-secondary w-36" // Fixed width
            >
            <ReloadIcon className="mr-2 h-4 w-4" /> New Deck
            </Button>
         </div>
          <Button
            onClick={resetScores}
            variant="ghost"
            size="lg"
            className="text-muted-foreground hover:text-foreground"
            title="Reset Scores and Start New Game"
          >
            <Trophy className="mr-2 h-4 w-4" /> Reset Score {/* Changed to Lucide Trophy */}
        </Button>
      </div>
       <div className="mt-4 text-sm text-muted-foreground">
          Cards Left: {deck.length}
       </div>
    </div>
  );
}
