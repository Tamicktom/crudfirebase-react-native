//* Libraries imports
import { useQuery } from "@tanstack/react-query";

//* Local imports
import loadCardsFromDeck from "../actions/loadCardsFromDeck";
import type { CardData } from "../types/yugioh-api-response";

export default function useCardList() {
  return useQuery<CardData[], Error>(["cards"], loadCardsFromDeck, {
    staleTime: 1000 * 60 * 5, // 5 minutes
    cacheTime: 1000 * 60 * 30, // 30 minutes
    refetchOnWindowFocus: true,
  });
}
