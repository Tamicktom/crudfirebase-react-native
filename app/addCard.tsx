//* Libraries imports
import { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, FlatList, Image, Dimensions, Keyboard } from 'react-native';
import { useRouter } from 'expo-router';

//* Local types
import type { APIResponse, CardData, Meta } from "../src/types/yugioh-api-response";

//* Actions
import addCardToDeck from '../src/actions/addCardToDeck';

//* hooks
import useCardList from '../src/hooks/useCardList';

const windowWidth = Dimensions.get('window').width;
const cardWidth = windowWidth * 0.44; // 40% of the screen
const cardHeight = (cardWidth * 614) / 421;

export default function AddCard() {
  const router = useRouter();

  const cardList = useCardList();

  const [cards, setCards] = useState<CardData[]>([]);
  const [search, setSearch] = useState<string>('');
  const [actualPage, setActualPage] = useState<number>(0);
  const [pagination, setPagination] = useState<Meta>({
    current_rows: 0,
    total_rows: 0,
    next_page: '',
    next_page_offset: 0,
    pages_remaining: 0,
    rows_remaining: 0,
    total_pages: 0,
  });

  useEffect(() => {
    console.log(pagination, actualPage);
    //compute actual page
    setActualPage((pagination.next_page_offset || 10) / 10);
  }, [pagination]);

  const handleSearch = () => {
    console.log(search);
    fetch(`https://db.ygoprodeck.com/api/v7/cardinfo.php?&fname=${search}&num=10&offset=0`)
      .then((response) => response.json())
      .then((data: APIResponse) => {
        setCards(data.data);
        if (data.meta) {
          setPagination(data.meta);
        }
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(()=>{
        Keyboard.dismiss();
      })
  }

  const nextPage = () => {
    if (actualPage > 0) {
      fetch(`https://db.ygoprodeck.com/api/v7/cardinfo.php?&fname=${search}&num=10&offset=${pagination.next_page_offset}`)
        .then((response) => response.json())
        .then((data: APIResponse) => {
          setCards(data.data);
          if (data.meta) {
            setPagination(data.meta);
          }
        })
        .catch((error) => {
          console.log(error);
        })
    }
  }

  const previousPage = () => {
    if (((pagination.next_page_offset || 21) - 20) >= 0 && actualPage > 0) {
      fetch(`https://db.ygoprodeck.com/api/v7/cardinfo.php?&fname=${search}&num=10&offset=${(pagination.next_page_offset || 10) - 20}`)
        .then((response) => response.json())
        .then((data: APIResponse) => {
          setCards(data.data);
          if (data.meta) {
            setPagination(data.meta);
          }
        })
        .catch((error) => {
          console.log(error);
        })
    } else {
      console.log('No more pages');
    }
  }

  return (
    <View className='relative justify-center flex-1'>
      <View className='flex flex-col items-center justify-center w-full p-4 bg-red-500'>
        <TextInput
          className='w-full p-4 mb-3 text-lg border rounded-lg border-neutral-500 text-neutral-100 bg-neutral-950'
          placeholder="Card name"
          autoCorrect={false}
          onChangeText={setSearch}
        />
        <TouchableOpacity
          onPress={handleSearch}
          className='items-center w-full p-4 bg-blue-700 rounded-lg'
        >
          <Text className='text-2xl text-center text-blue-300'>Search</Text>
        </TouchableOpacity>
      </View>

      <View className='flex items-center justify-center flex-1 pb-16 bg-blue-600'>
        <FlatList
          data={cards || []}
          renderItem={({ item, index }) => (
            <TouchableOpacity
              style={{
                marginRight: index % 2 === 0 ? 8 : 0,
              }}
              className='flex items-center justify-center mb-2'
              onPress={() => {
                router.push({
                  pathname: 'cardDetail',
                  params: {
                    card: item.name,
                  }
                })
              }}
              onLongPress={() => {
                addCardToDeck(item).then((res) => {
                  if (res.error) {
                    alert(res.message);
                    return;
                  }
                  return alert(`${item.name} added to your deck`);
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
          contentContainerStyle={{
            paddingHorizontal: 16
          }}
        />
      </View>

      <View className='absolute bottom-0 left-0 flex flex-row items-center justify-between w-full p-4 bg-red-800'>
        <TouchableOpacity onPress={previousPage}>
          <Text className='text-2xl text-center text-blue-300'>Previous</Text>
        </TouchableOpacity>
        <Text className='text-2xl text-center text-neutral-100'>{pagination.current_rows * actualPage} / {pagination.total_rows}</Text>
        <TouchableOpacity onPress={nextPage}>
          <Text className='text-2xl text-center text-blue-300'>Next</Text>
        </TouchableOpacity>
      </View>

    </View>
  )
}