import { BulkOperationBase } from 'mongodb';
import * as React from 'react';
import { Pressable, StyleSheet, TextInput } from 'react-native';
import { useState } from 'react';
import EditScreenInfo from '../components/EditScreenInfo';
import { Text, View } from '../components/Themed';
import { RootTabScreenProps } from '../types';
import { useNavigation } from '@react-navigation/core';
//import {useMutation, gql} from @"apolllo/cliente"

/* const   SIGN_IN_MUTATION=gql`
mutation SignIn($email:String!, $password:String!){
  signUp(input:{email, password:$password}){
    token
    user{
      id
      name
      email
    }
  }
} */


export default function SignInScreen({ navigation }: RootTabScreenProps<'TabOne'>) {
  const [email, setEmail]= useState("")
  const [password, SetPassword]= useState("")
  const navegation=useNavigation();

  //const [signIn, {data, error, loading}]=useMutation(SIGN_IN_MUTATION)

  return (
    <View style={{padding:20}}>
      <Text>Log In</Text>
      <TextInput
        placeholder="Email here!" 
        value={email}
        onChangeText={setEmail}
        style={{
          color:"black",
          fontSize:18,
          marginVertical:25,
          width: "50%",
          marginHorizontal:"25%"
        }}
        />
        <TextInput
        placeholder="Password"
        value={password}
        onChangeText={SetPassword}
        secureTextEntry 
        style={{
          color:"black",
          fontSize:18,
          marginVertical:25,
          width: "50%",
          marginHorizontal:"25%"
        }}
        />
        <Pressable
        onPress={()=>{console.warn("navigate"); navegation.navigate("signUp")}}
        style={{
          backgroundColor:"blue",
          height:50,
          borderRadius:5,
          alignItems:"center",
          justifyContent:"center",          
          marginTop:30,
          width: "50%",
          marginHorizontal:"25%"
        }}
        >
          <Text
            style={{
              color:"white",
              fontSize:18,
              fontWeight:"bold"
            }} > 
              Start Sesion 
          </Text>
        </Pressable>

        <Pressable
          style={{
            height:50,
            alignItems:"center",
            justifyContent:"center",
            margin:30,
            width:"50%",
            marginHorizontal:"25%"
          }}>
            <Text
            style={{
              color:"blue",
              fontSize:18,
              fontWeight:"bold"
            }} >
              Nuevo? Regístrese Aquí
            </Text>
        </Pressable>
        
          </View>
          
  );

  //export defaul SignInScreen
  
}


