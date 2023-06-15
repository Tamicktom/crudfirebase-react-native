"use server";

import firebase from "../services/firebaseConections";
import type { CardData } from "../types/yugioh-api-response";

export default async function addCardToDeck(card: CardData) {
  const userId = firebase.auth().currentUser?.uid;
  if (!userId) {
    console.log("user not logged in");
    return {
      error: true,
      message: "User not logged in",
    };
  }

  try {
    const userRef = firebase.firestore().collection("users").doc(userId);

    // Obtenha o documento atual do usuário
    const userDoc = await userRef.get();
    const userData = userDoc.data();

    if (userData && userData.cards) {
      // Se já houver um array de cartas, verifique quantas cartas existem
      // Se houver 60 ou mais cartas, não adicione a nova carta
      if (userData.cards.length >= 60) {
        console.log("Deck completo");
        return {
          error: true,
          message: "Deck completo. Não é possível adicionar mais cartas",
        };
      }

      //verifique se a carta já está presente no array de cartas
      const cardIndex = userData.cards.findIndex(
        (c: CardData) => c.id === card.id && c.name === card.name
      );

      if (cardIndex !== -1) {
        // Se a carta estiver presente, não adicione a nova carta
        console.log("Carta já presente no deck");
        return {
          error: true,
          message: "Carta já presente no deck",
        };
      }
      const updatedCards = [...userData.cards, card];
      await userRef.update({ cards: updatedCards });
    } else {
      // Se ainda não houver um array de cartas, crie um novo com a nova carta
      await userRef.set({ cards: [card] });
    }

    return {
      error: false,
      message: "Sucesso",
    };
  } catch (error) {
    console.log(error);
    return {
      error: true,
      message: "Erro ao adicionar carta ao deck",
    };
  }
}
