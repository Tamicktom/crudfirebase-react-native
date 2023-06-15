//* Libraries imports
import { View, Text, TouchableOpacity, FlatList, Image, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';

import removeCardFromDeck from '../src/actions/removeCardFromDeck';

//* hooks
import useCardList from '../src/hooks/useCardList';

export default function CardList() {
  const router = useRouter();

  const cardList = useCardList();

  const windowWidth = Dimensions.get('window').width;
  const cardWidth = windowWidth * 0.44; // 40% of the screen
  const cardHeight = (cardWidth * 614) / 421;

  return (
    <View className='relative justify-center flex-1'>
      <Text className='my-4 text-2xl text-center text-neutral-100'>
        {cardList.data?.length} cards in the deck
      </Text>
      <FlatList
        data={cardList.data || []}
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
                cardList.refetch();
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
