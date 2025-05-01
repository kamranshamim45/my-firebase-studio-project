"use client";

import { useState, useEffect } from "react";
import type { Card as CardType } from "@/lib/game";
import { createDeck, shuffleDeck, dealCard, compareCards } from "@/lib/game";
import { CardDisplay } from "@/components/game/card-display";
import { Button } from "@/components/ui/button";
import { ReloadIcon } from "@radix-ui/react-icons"; // Use a suitable icon

type GameState = "initial" | "playing" | "result";
type Winner = "player" | "computer" | "tie" | null;

export function GameArea() {
  const [deck, setDeck] = useState<CardType[]>([]);
  const [playerCard, setPlayerCard] = useState<CardType | null>(null);
  const [computerCard, setComputerCard] = useState<CardType | null>(null);
  const [gameState, setGameState] = useState<GameState>("initial");
  const [winner, setWinner] = useState<Winner>(null);
  const [isDealing, setIsDealing] = useState(false); // For animation control

  useEffect(() => {
    // Initialize deck on component mount
    startNewGame();
  }, []);

  const startNewGame = () => {
    const newDeck = createDeck();
    const shuffled = shuffleDeck(newDeck);
    setDeck(shuffled);
    setPlayerCard(null);
    setComputerCard(null);
    setGameState("initial");
    setWinner(null);
    setIsDealing(false);
  };

  const handleDraw = () => {
    if (deck.length < 2) {
      // Not enough cards to draw for both player and computer
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
      <h1 className="text-4xl font-bold mb-8 text-secondary">Ace Showdown</h1>

      <div className="flex justify-around w-full max-w-md mb-8">
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

      <div className="flex space-x-4">
        <Button
          onClick={handleDraw}
          disabled={isDealing || deck.length < 2}
          variant="destructive" // Use red accent button
          size="lg"
          className="bg-accent hover:bg-accent/90 text-accent-foreground"
        >
          {gameState === 'initial' ? 'Draw Cards' : 'Draw Again'}
        </Button>
        <Button
          onClick={startNewGame}
          variant="outline"
          size="lg"
          className="border-secondary text-secondary hover:bg-secondary/10 hover:text-secondary"
        >
          <ReloadIcon className="mr-2 h-4 w-4" /> New Game
        </Button>
      </div>
       <div className="mt-4 text-sm text-muted-foreground">
          Cards Left: {deck.length}
       </div>
    </div>
  );
}
