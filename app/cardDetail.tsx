import { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, Dimensions } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';

import getCardFromDb from '../src/actions/getCardsFromDb';
import type { CardData } from '../src/types/yugioh-api-response';

const windowWidth = Dimensions.get('window').width;
const cardWidth = windowWidth * 0.44; // 44% of the screen
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
    <View className='relative justify-start flex-1 bg-neutral-950'>
      <Text className='my-4 text-3xl font-bold text-center text-neutral-100'>{card?.name}</Text>
      <View
        className='mb-4'
        style={{
          height: cardHeight,
        }}
      >
        <FlatList
          data={card?.card_images || []}
          renderItem={({ item }) => (
            <View
              className='mr-2 overflow-hidden rounded-lg'
              style={{
                width: cardWidth,
                height: cardHeight,
              }}>
              <Image
                className='flex-1'
                source={{ uri: item.image_url }}
              />
            </View>
          )}
          keyExtractor={(item) => item.id + ""}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            alignItems: 'flex-start',
            paddingHorizontal: 16,
          }}
        />
      </View>
      <View className='mb-4'>
        <Text className='my-2 text-lg text-center text-neutral-100'>ID: {card?.id}</Text>
        <Text className='my-2 text-lg text-center text-neutral-100'>Type: {card?.type}</Text>
        <Text className='my-2 text-lg text-center text-neutral-100'>Race: {card?.race}</Text>
        <Text className='my-2 text-lg text-center text-neutral-100'>Frame Type: {card?.frameType}</Text>
      </View>
      <Text className='my-4 mb-4 text-lg text-center text-neutral-100'>{card?.desc}</Text>
    </View>
  );
}