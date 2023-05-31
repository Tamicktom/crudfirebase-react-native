//* Libraries imports
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';


export default function Index() {
  const route = useRouter();


  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.textWhite}>
          Board List
        </Text>
      </View>
      <View style={styles.space}>
        <TouchableOpacity onPress={() => {
          route.push('/addBoard');
        }}>
          <Text style={styles.link}>
            Add Board
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => {
          route.push('/');
        }}>
          <Text style={styles.link}>
            Board List
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