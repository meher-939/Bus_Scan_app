import React, { useEffect, useState } from 'react'
import { ActivityIndicator, Alert, FlatList, Image, Pressable, RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import Search from '../components/Search'
import BusSearch from '../components/BusSearch'
import { useBusData } from '../context/BusContext'
import { getBusValid, getScanData, getTodayBusData } from '../api/api'
import { useNavigation } from '@react-navigation/native'
import { useAuth } from '../context/AuthContext'
import Icon from "react-native-vector-icons/Ionicons"

const HomeScreen = () => {
  const { busNumber, setBusNumber, updateData } = useBusData()
  const { deleteToken, username } = useAuth()
  const navigation = useNavigation()
  const [data, setData] = useState([])
  const [refreshing, setRefreshing] = useState(false)
  const [loading, setLoading] = useState(false)
  const onSearchPress = async () => {
    try {
      setBusNumber('')
      if (busNumber == '' || busNumber == null) {
        return Alert.alert('Error', 'Please Provide Bus Number')
      }
      const result = await getBusValid(busNumber);
      if (!result) {
        alert('Bus not found');
      } else {
        navigation.navigate('Scanner', { busNumber: busNumber })
      }
    } catch (error) {
      console.error('Error occurred:', error);
      // Handle other errors if needed
    }
  }
  const onTextChange = (text) => {
    setBusNumber(text)
  }
  const busCounts = data.length > 0 && Object.entries(
    data.reduce((acc, bus) => {
      acc[bus.busNumber] = (acc[bus.busNumber] || 0) + 1;
      return acc;
    }, {})
  ).map(([busNumber, count]) => ({ busNumber: parseInt(busNumber), count }));
  const getData = async () => {
    setLoading(true)
    setRefreshing(true)
    const result = await getTodayBusData(username);
    if (result) {
      setData(result)
      setRefreshing(false)
      setLoading(false)
    }
  }
  useEffect(() => {
    getData()
  }, [updateData, username])
  useEffect(() => {
    getData()
  }, [])
  return (
    <SafeAreaView style={styles.container}>

      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Image source={require('../assets/aditya-logo.png')} resizeMode='contain' style={{ height: 60, width: 60 }} />
        <Text style={{ fontSize: 25, fontFamily: 'DmSans', textAlign: 'center', flex: 1 }}><Text style={{ color: '#fd8438', fontFamily: 'DmSans-B' }}>ADITYA</Text> University</Text>
        <TouchableOpacity style={{ padding: 6 }} onPress={async () => {
          deleteToken('token')
          deleteToken('isLogin')
          navigation.replace('Login')
        }}>
          <Icon name="log-in-outline" size={25} />
        </TouchableOpacity>
      </View>
      <View style={{ flex: 1, marginVertical: 20 }}>
        <Search onPress={onSearchPress} onChange={onTextChange} value={busNumber} placeholder={"Search Bus ..."} />
        {/* <FlatList showsVerticalScrollIndicator={false} style={{ flex: 1, marginTop: 20 }}>

        </FlatList> */}
        {
          data.length > 0 ? (
            <FlatList showsVerticalScrollIndicator={false} style={{ flex: 1, marginTop: 20 }}
              data={busCounts}
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={getData} />
              }
              keyExtractor={(item) => item.busNumber}
              renderItem={({ item }) => {
                return <BusSearch key={item.busNumber} busNumber={item.busNumber} count={item.count} />
              }}

            />
          ) : (
            loading ? (
              <View style={{ flex: 1, backgroundColor: 'transparent', alignItems: 'center', justifyContent: 'center' }}>
                <ActivityIndicator color={"black"} size={30} animating={true} />
              </View>
            ) : (<View style={{ flex: 1, backgroundColor: 'transparent', alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ fontFamily: 'DmSans', fontSize: 24, letterSpacing: 0.4 }}>No Buses Scanned.</Text>
            </View>)
          )
        }
      </View>

    </SafeAreaView >
  )
}

export default HomeScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 15,
    backgroundColor: '#f5f5f4'
  }
})