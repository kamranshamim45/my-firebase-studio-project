export type Suit = "Hearts" | "Diamonds" | "Clubs" | "Spades";
export type Rank = "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" | "10" | "J" | "Q" | "K" | "A";

export interface Card {
  suit: Suit;
  rank: Rank;
  value: number;
}

const SUITS: Suit[] = ["Hearts", "Diamonds", "Clubs", "Spades"];
const RANKS: Rank[] = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"];

const RANK_VALUES: { [key in Rank]: number } = {
  "2": 2, "3": 3, "4": 4, "5": 5, "6": 6, "7": 7, "8": 8, "9": 9, "10": 10, "J": 11, "Q": 12, "K": 13, "A": 14
};

export const createDeck = (): Card[] => {
  const deck: Card[] = [];
  for (const suit of SUITS) {
    for (const rank of RANKS) {
      deck.push({ suit, rank, value: RANK_VALUES[rank] });
    }
  }
  return deck;
};

export const shuffleDeck = (deck: Card[]): Card[] => {
  const shuffledDeck = [...deck];
  for (let i = shuffledDeck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledDeck[i], shuffledDeck[j]] = [shuffledDeck[j], shuffledDeck[i]];
  }
  return shuffledDeck;
};

export const dealCard = (deck: Card[]): { card: Card | null; remainingDeck: Card[] } => {
  if (deck.length === 0) {
    return { card: null, remainingDeck: [] };
  }
  const card = deck.pop(); // Deal from the "top" (end of array after shuffle)
  return { card: card!, remainingDeck: deck }; // Assert card is not null as we checked length
};

export const compareCards = (card1: Card, card2: Card): "player" | "computer" | "tie" => {
  if (card1.value > card2.value) {
    return "player";
  } else if (card2.value > card1.value) {
    return "computer";
  } else {
    return "tie";
  }
};
