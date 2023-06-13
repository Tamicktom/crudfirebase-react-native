//* Libraries imports
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

import firebase from "../src/services/firebaseConections";


export default function Index() {
  const route = useRouter();


  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.textWhite}>
          Add board
        </Text>
      </View>
      <View style={styles.space}>
        <TouchableOpacity onPress={() => {
          route.push('/');
        }}>
          <Text style={styles.link}>
            Board List
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => {
          route.push('/editBoard');
        }}>
          <Text style={styles.link}>
            edit Board
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => {
          route.push('/boardDetails');
        }}>
          <Text style={styles.link}>
            Board Details
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
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
  }
})