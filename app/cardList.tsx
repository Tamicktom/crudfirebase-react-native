import { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Image, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';

import loadCardsFromDeck from '../src/actions/loadCardsFromDeck';
import type { CardData } from '../src/types/yugioh-api-response';

export default function CardList() {
  const router = useRouter();
  const [cards, setCards] = useState<CardData[]>([]);

  const windowWidth = Dimensions.get('window').width;
  const cardWidth = windowWidth * 0.44; // 40% of the screen
  const cardHeight = (cardWidth * 614) / 421;

  useEffect(() => {
    loadCardsFromDeck().then((cd) => {
      setCards(cd);
    });
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.textWhite}>
        {cards.length} cards in the deck
      </Text>
      <FlatList
        data={cards || []}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.cardContainer}
            onPress={() => {
              router.push({
                pathname: 'cardDetail',
                params: {
                  card: item.name,
                }
              })
            }}
          >
            <Image
              style={{ width: cardWidth, height: cardHeight, borderRadius: 8 }}
              source={{ uri: item.card_images[0].image_url }}
            />
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.id + ''}
        numColumns={2}
        contentContainerStyle={styles.flatListContentContainer}
      />
      <TouchableOpacity style={styles.addCardButton}>
        <Text style={styles.textWhite}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    position: 'relative',
  },
  textWhite: {
    textAlign: 'center',
    color: 'white',
    fontSize: 28,
    marginVertical: 16,
  },
  addCardButton: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
    display: 'flex',
  },
  cardContainer: {
    flex: 1,
    alignItems: 'center',
    marginBottom: 8,
  },
  flatListContentContainer: {
    paddingHorizontal: 16,
  },
});
