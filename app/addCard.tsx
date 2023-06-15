//* Libraries imports
import { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, FlatList, Image, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';

import type { APIResponse, CardData, Meta } from "../src/types/yugioh-api-response";

import addCardToDeck from '../src/actions/addCardToDeck';
import firebase from "../src/services/firebaseConections";

export default function Index() {
  const router = useRouter();

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

  const windowWidth = Dimensions.get('window').width;
  const cardWidth = windowWidth * 0.44; // 40% of the screen
  const cardHeight = (cardWidth * 614) / 421;

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
    <View style={styles.container}>
      <View style={styles.holder}>
        <TextInput
          style={styles.input}
          placeholder="Card name"
          autoCorrect={false}
          onChangeText={setSearch}
        />
        <TouchableOpacity
          onPress={handleSearch}
          style={styles.button}
        >
          <Text style={styles.link}>Search</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.cardsHolder}>
        <FlatList
          data={cards || []}
          renderItem={({ item, index }) => (
            <TouchableOpacity
              style={[styles.cardContainer, {
                marginRight: index % 2 === 0 ? 8 : 0,
              }]}
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
          contentContainerStyle={styles.flatListContentContainer}
        />
      </View>

      <View style={styles.paginationHolder}>
        <TouchableOpacity onPress={previousPage}>
          <Text style={styles.link}>Previous</Text>
        </TouchableOpacity>
        <Text style={styles.textWhite}>{pagination.current_rows * actualPage} / {pagination.total_rows}</Text>
        <TouchableOpacity onPress={nextPage}>
          <Text style={styles.link}>Next</Text>
        </TouchableOpacity>
      </View>

    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    position: 'relative',
  },
  holder: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    width: '100%',
    backgroundColor: 'darkred',
  },
  cardsHolder: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    backgroundColor: 'darkblue',
    paddingBottom: 64,
  },
  cardContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  input: {
    paddingVertical: 16,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 16,
    color: "white",
    borderRadius: 8,
    fontSize: 18,
    width: '100%',
    backgroundColor: 'black',
  },
  button: {
    backgroundColor: 'blue',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    width: '100%',
  },
  textWhite: {
    textAlign: 'center',
    color: 'white',
    fontSize: 28,
  },
  link: {
    color: 'lightblue',
    textAlign: 'center',
    fontSize: 20,
  },
  space: {
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
  },
  paginationHolder: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    width: '100%',
    position: 'absolute',
    bottom: 0,
    left: 0,
    backgroundColor: 'darkred',
  },
  flatListContentContainer: {
    paddingHorizontal: 16,
  },
})