import { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, Image, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';

import loadCardsFromDeck from '../src/actions/loadCardsFromDeck';
import removeCardFromDeck from '../src/actions/removeCardFromDeck';
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
    <View className='relative justify-center flex-1'>
      <Text className='my-4 text-2xl text-center text-neutral-100'>
        {cards.length} cards in the deck
      </Text>
      <FlatList
        data={cards || []}
        renderItem={({ item }) => (
          <TouchableOpacity
            className='items-center flex-1 mb-2'
            onPress={() => {
              router.push({
                pathname: 'cardDetail',
                params: {
                  card: item.name,
                }
              })
            }}
            onLongPress={() => {
              removeCardFromDeck(item).then((cd) => {
                if (cd.error) {
                  alert(cd.message);
                  return;
                }
                return alert(cd.message);
              }).finally(() => {
                loadCardsFromDeck().then((cd) => {
                  setCards(cd);
                });
              });
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
        contentContainerStyle={{ paddingHorizontal: 16 }}
      />
      <TouchableOpacity
        className='absolute flex items-center justify-center w-16 h-16 bg-blue-700 rounded-full bottom-4 right-4'
        onPress={() => {
          router.push({
            pathname: 'addCard',
          })
        }}
      >
        <Text className='my-4 text-2xl text-center text-neutral-100'>+</Text>
      </TouchableOpacity>
    </View>
  );
}
