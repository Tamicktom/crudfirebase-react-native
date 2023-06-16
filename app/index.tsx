import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { z } from 'zod';
import { EnvelopeSimple, Lock } from 'phosphor-react-native';

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
      //@ts-ignore
      setError(error?.message);
      console.log(error);
    }
  };

  return (
    <View className="justify-center flex-1 bg-black">
      <View className='mb-5'>
        <Text className='text-4xl font-bold text-center text-white'>Login</Text>
      </View>
      <View className='flex flex-col gap-3 px-5'>
        <TextInput
          className='p-4 mb-3 text-base text-white border rounded-md border-neutral-300'
          placeholder="Email"
          placeholderTextColor="gray"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          className='p-4 mb-3 text-base text-white border rounded-md border-neutral-300'
          placeholder="Password"
          placeholderTextColor="gray"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity className='items-center p-4 bg-blue-700 rounded-lg' onPress={handleLogin}>
          <Text className='text-lg text-neutral-100'>Login</Text>
        </TouchableOpacity>
        {error ? <Text className='mt-2 text-red-500'>{error}</Text> : null}
      </View>
    </View>
  );
}