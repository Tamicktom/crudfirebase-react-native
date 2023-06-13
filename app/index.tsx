import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { z } from 'zod';

import firebase from '../src/services/firebaseConections';

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    try {
      schema.parse({ email, password });
      await firebase.auth().signInWithEmailAndPassword(email, password)
      // Login successful, navigate to the next screen
      router.push('/cardList');
    } catch (error) {
      setError(error?.message);
      console.log(error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.tittleHolder}>
        <Text style={styles.textWhite}>Login</Text>
      </View>
      <View style={styles.space}>
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="gray"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="gray"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: "black",
  },
  tittleHolder: {
    marginBottom: 20,
  },
  textWhite: {
    textAlign: 'center',
    color: 'white',
    fontSize: 32,
    fontWeight: 'bold',
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
  },
  button: {
    backgroundColor: 'blue',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
  },
  errorText: {
    color: 'red',
    marginTop: 10,
  },
  space: {
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
    paddingHorizontal: 20,
  },
});
