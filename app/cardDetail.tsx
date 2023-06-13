import { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Image, Dimensions } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';

import getCardFromDb from '../src/actions/getCardsFromDb';
import type { CardData } from '../src/types/yugioh-api-response';

const windowWidth = Dimensions.get('window').width;
const cardWidth = windowWidth * 0.44; // 40% of the screen
const cardHeight = (cardWidth * 614) / 421;

export default function Index(props: any) {
  const router = useRouter();
  const params = useLocalSearchParams();

  const [card, setCard] = useState<CardData | null>(null);

  useEffect(() => {
    if (typeof params.card === "string") {
      getCardFromDb(params.card)
        .then((cd) => {
          if (cd) {
            setCard(cd.cardData[0]);
          }
        });
    }
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.cardName}>{card?.name}</Text>
      <View style={styles.cardImagesContainer}>
        <FlatList
          data={card?.card_images || []}
          renderItem={({ item }) => (
            <View style={styles.cardImageContainer}>
              <Image
                style={styles.cardImage}
                source={{ uri: item.image_url }}
              />
            </View>
          )}
          keyExtractor={(item) => item.id + ""}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.cardImagesContentContainer}
        />
      </View>
      <View style={styles.cardInfoContainer}>
        <Text style={styles.cardInfoText}>ID: {card?.id}</Text>
        <Text style={styles.cardInfoText}>Type: {card?.type}</Text>
        <Text style={styles.cardInfoText}>Race: {card?.race}</Text>
        <Text style={styles.cardInfoText}>Frame Type: {card?.frameType}</Text>
      </View>
      <Text style={styles.cardDescription}>{card?.desc}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    position: 'relative',
    backgroundColor: '#232323',
  },
  cardName: {
    textAlign: 'center',
    color: 'white',
    fontSize: 28,
    marginVertical: 16,
  },
  cardImagesContainer: {
    height: cardHeight,
    marginBottom: 16,
  },
  cardImageContainer: {
    width: cardWidth,
    height: cardHeight,
    borderRadius: 8,
    overflow: 'hidden',
    marginRight: 8,
  },
  cardImage: {
    flex: 1,
    resizeMode: 'contain',
  },
  cardImagesContentContainer: {
    alignItems: 'flex-start',
    paddingHorizontal: 16,
  },
  cardInfoContainer: {
    marginBottom: 16,
  },
  cardInfoText: {
    textAlign: 'center',
    color: 'white',
    fontSize: 18,
    marginVertical: 8,
  },
  cardDescription: {
    textAlign: 'center',
    color: 'white',
    fontSize: 18,
    marginBottom: 16,
    marginHorizontal: 16,
  },
});
