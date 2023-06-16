import { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, Dimensions, TouchableOpacity } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';

import getCardFromDb from '../src/actions/getCardsFromDb';
import addCardToDeck from '../src/actions/addCardToDeck';
import type { CardData } from '../src/types/yugioh-api-response';
import useCardList from '../src/hooks/useCardList';

const windowWidth = Dimensions.get('window').width;
const cardWidth = windowWidth * 0.44; // 44% of the screen
const cardHeight = (cardWidth * 614) / 421;

export default function Index(props: any) {
  const router = useRouter();
  const params = useLocalSearchParams();

  const cardList = useCardList();

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
    <View className='relative justify-start flex-1 px-4 bg-neutral-950'>
      <Text className='my-4 text-3xl font-bold text-center text-neutral-100'>{card?.name}</Text>
      <View
        className='flex items-center justify-center mb-4'
        style={{
          height: card && card?.card_images.length > 1 ? cardHeight : cardHeight * 1.5,
        }}
      >
        {
          card && card?.card_images.length > 1
            ? (
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
            )
            : (
              <View>
                <Image
                  className='rounded-lg'
                  style={{
                    width: cardWidth * 1.5,
                    height: cardHeight * 1.5,
                  }}
                  source={{ uri: card?.card_images[0].image_url }}
                />
              </View>
            )
        }
      </View>
      <View className='mb-4 .flex flex-row justify-center items-center w-full'>
        <View className='flex flex-col w-1/2'>
          <Text className='my-2 text-lg text-center text-neutral-100'>ID: {card?.id}</Text>
          <Text className='my-2 text-lg text-center text-neutral-100'>Type: {card?.type}</Text>
        </View>
        <View className='flex flex-col w-1/2'>
          <Text className='my-2 text-lg text-center text-neutral-100'>Race: {card?.race}</Text>
          <Text className='my-2 text-lg text-center text-neutral-100'>Frame Type: {card?.frameType}</Text>
        </View>
      </View>
      <Text className='my-4 mb-4 text-lg text-center text-neutral-100'>{card?.desc}</Text>

      <TouchableOpacity
        onPress={() => {
          if (card) {
            addCardToDeck(card).then((res) => {
              if (res.error) {
                alert(res.message);
                return;
              }
              return alert(`${card.name} added to your deck`);
            }).finally(() => {
              cardList.refetch();
            });
          }
        }}
        className='absolute z-10 flex items-center justify-center w-full h-16 border rounded-lg bottom-4 left-4 bg-neutral-800 border-neutral-300'
      >
        <Text className='my-4 text-lg font-bold text-center text-neutral-100'>Add to Deck</Text>
      </TouchableOpacity>
    </View>
  );
}