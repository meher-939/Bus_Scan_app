import { StyleSheet, Image, View, Text, ActivityIndicator, Alert, Keyboard } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import Input from '../components/Input'
import Button from '../components/Button'
import { useNavigation } from '@react-navigation/native'
import { login } from '../api/api'
import { getToken, useAuth } from '../context/AuthContext'

const LoginScreen = () => {
  const navigate = useNavigation()
  useEffect(() => {
    const checkLogin = async () => {
      const isValid = await getToken('isLogin')
      // console.log("isvalid "+isValid)
      if (isValid === 'true') {
        navigate.replace('Home')
      }
    }
    checkLogin()
  }, [])

  const [password, setPassword] = useState('')
  const [operatorId, setOperatorId] = useState('')
  const [loading, setLoading] = useState(false)
  const { setToken, setUsername } = useAuth()
  const handleLogin = async () => {
    Keyboard.dismiss()
    if (password.trim() == '' || password == null || operatorId == '' || operatorId == null) {
      return Alert.alert('Login Error', 'All Feilds Are Required.')
    }
    try {
      const result = await login(operatorId, password, setLoading)
      if (!result.data) {
        setPassword('')
        setOperatorId('')
        return alert('Invalid Username or Password')
      }
      console.log(result.data.data)
      await setToken("username", result.data.data)
      setUsername(result.data.data)
      await setToken("token", result.headers.authorization)
      await setToken("isLogin", "true")
      navigate.replace('Home')
      // return alert('Login Success')
    } catch (error) {
      console.error('Error occurred:', error);
      Alert.alert('Error', `Error Occured ${error}`)
    }


  }
  return (
    <SafeAreaView style={styles.container}>
      <Image source={require('../assets/aditya-logo.png')} style={{ height: 120, width: 200 }} resizeMode='contain' />
      <View style={styles.loginContainer}>
        <Text style={styles.loginText}>Login</Text>
        <View style={styles.inputContainer}>
          <Input placeholder={'Username'} value={operatorId} handleChange={(operatorId) => setOperatorId(operatorId)} disabled={loading} />
          <Input placeholder={'Password'} password value={password} handleChange={(password) => setPassword(password)} disabled={loading} />
        </View>
        <View style={{ marginVertical: 30 }}>
          <Button onPress={handleLogin} disabled={loading} />
        </View>
      </View>
      {
        loading && <View style={{ width: '100%', height: '100%', alignItems: 'center', 'justifyContent': 'center', backgroundColor: 'rgba(255,255,255)', position: 'absolute', }}>
          <ActivityIndicator color={"black"} size={40} />
        </View>
      }
    </SafeAreaView>
  )
}

export default LoginScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 12,
    alignItems: 'center',
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  loginContainer: {
    marginTop: 15,
    width: '100%',
    alignItems: 'center'
  },
  loginText: {
    fontFamily: 'DmSans',
    fontSize: 42,
    fontWeight: '600',
  },
  inputContainer: {
    marginTop: 25,
    width: '92%',
    gap: 15
  }

})