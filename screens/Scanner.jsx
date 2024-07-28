import { StyleSheet, Text, View, Image, ActivityIndicator, Alert, Keyboard, Pressable, FlatList, RefreshControl } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import Search from '../components/Search'
import Icon from "react-native-vector-icons/Ionicons"
import { useNavigation } from '@react-navigation/native'
import { getScanData, getStuDetails } from '../api/api'
import { useAuth } from '../context/AuthContext'
import { useBusData } from '../context/BusContext'

const Scanner = ({ route }) => {


    const { busNumber } = route.params
    const date = new Date().toISOString().split('T')[0].split('-').reverse().join('-')
    const navigation = useNavigation()
    const [rollNo, setRollNo] = useState('')
    const [loading, setLoading] = useState(false)
    const [dataLoading, setDataLoading] = useState(false)
    const [data, setData] = useState([])
    const [refreshing, setRefreshing] = useState(false)
    const { username } = useAuth()
    const { updateData, setUpdateData } = useBusData()
    const getData = async () => {
        setRefreshing(true)
        setDataLoading(true)
        const result = await getScanData(date, busNumber)
        if (result) {
            setData(result)
            setRefreshing(false)
            setDataLoading(false)
        }
    }
    useEffect(() => {
        setUpdateData(false)
        getData()
    }, [])
    useEffect(() => {
        setUpdateData(false)
        getData()
    }, [updateData])
    const handleSubmit = async () => {
        Keyboard.dismiss()
        if (rollNo === '') return Alert.alert('Error', 'Please Provide Roll No')
        setLoading(true)
        const result = await getStuDetails(rollNo.trim().toUpperCase(), busNumber, setLoading, username)
        console.log(result)
        setRollNo('')
        if (result == 404) {
            setLoading(false)
            return Alert.alert('Invalid', 'Student Not Found')
        }
        if (result == 400) {
            setLoading(false)
            return Alert.alert('Invalid', 'Already Scanned')
        }
        if (result == 403) {
            setLoading(false)
            return Alert.alert('Invalid', 'Fraud Already Scanned')
        }
        setLoading(false)
        return Alert.alert('Scanned Details', `Name: ${result.firstname} ${result.lastname}\nRollNo:${result.rollno}\nFeePaid:${result.feePaid}\nBusCanceled:${result.isBusCanceled}`, [{ 'text': 'OK', onPress: () => { getData() } }])
    }
    return (
        <SafeAreaView style={styles.container}>
            <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10 }}>
                <Image source={require('../assets/aditya-logo.png')} resizeMode='contain' style={{ height: 60, width: 60 }} />
                <Text style={{ fontSize: 25, fontFamily: 'DmSans', textAlign: 'center', flex: 1 }}><Text style={{ color: '#fd8438', fontFamily: 'DmSans-B' }}>ADITYA</Text> University</Text>
                <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                    <Pressable style={{ padding: 10 }} onPress={() => navigation.navigate('Scan', { busNumber: busNumber })}>
                        <Icon name="qr-code-outline" size={30} />
                    </Pressable>
                    {/* <Text style={{ fontFamily: 'DmSans', fontSize: 25, marginTop: -10 }}>Scan</Text> */}
                </View>
            </View>
            <View style={{ flex: 1, marginVertical: 10, marginTop: 15 }}>
                <Text style={{ fontSize: 20, fontFamily: 'DmSans', marginBottom: 8 }}>Today Date: <Text style={{ fontFamily: 'DmSans-B' }}>{date}</Text></Text>
                <Text style={{ fontSize: 20, fontFamily: 'DmSans' }}>Selected Bus: <Text style={{ fontFamily: 'DmSans-B' }}>{busNumber}</Text></Text>
                <View style={{ marginTop: 24 }}>
                    <Text style={{ fontFamily: 'DmSans', fontSize: 25 }}>Search Student</Text>
                    <View style={{ marginTop: 15 }}>

                        <Search placeholder={'Enter RollNo'} value={rollNo} onChange={(text) => setRollNo(text)} onPress={handleSubmit} keyboard={false} disabled={loading} />
                        {
                            loading && <View style={{ width: '100%', height: '100%', alignItems: 'center', 'justifyContent': 'center', position: 'absolute', top: -10 }}>
                                <ActivityIndicator color={"black"} size={30} />
                            </View>
                        }

                    </View>
                    {/* <Text style={{ textAlign: 'center', marginVertical: 15, fontFamily: 'DmSans-B', letterSpacing: 0.5, fontSize: 20 }}>OR</Text> */}

                    {/* <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                        <Pressable style={{ padding: 20 }} onPress={() => navigation.navigate('Scan', { busNumber: busNumber })}>
                            <Icon name="qr-code-outline" size={20} />
                        </Pressable>
                        <Text style={{ fontFamily: 'DmSans', fontSize: 25, marginTop: -10 }}>Scan</Text>
                    </View> */}
                </View>
                <Text style={{ fontFamily: 'DmSans', fontSize: 18, textAlign: 'center', marginVertical: 10 }}>Scanned Details</Text>
                <View style={{ width: '100%', borderWidth: 0.3, borderColor: 'lightgrey' }} />
                {
                    data.length > 0 ? (
                        <FlatList style={{ flex: 1, marginTop: 3 }}
                            showsVerticalScrollIndicator={false}
                            data={data}
                            refreshControl={
                                <RefreshControl refreshing={refreshing} onRefresh={getData} />
                            }
                            keyExtractor={(item) => item._id}
                            renderItem={({ item }) => {
                                return <View style={{ backgroundColor: 'transparent', flexDirection: 'row', padding: 10, justifyContent: 'space-between', marginBottom: 4, gap: 10 }}>
                                    <Text style={{ fontFamily: 'DmSans', fontSize: 20, width: '40%' }}>{item.rollNo}</Text>
                                    <Text style={{ fontFamily: 'DmSans', fontSize: 20, flex: 1, textAlign: 'left' }}>{item.firstName + " " + item.lastName}</Text>
                                </View>
                            }}
                        ></FlatList>
                    ) : (
                        dataLoading ? (
                            <View style={{ flex: 1, alignItems: 'center', 'justifyContent': 'center' }}>
                                <ActivityIndicator color={"black"} size={24} />
                            </View>
                        ) : (
                            <View style={{ flex: 1, alignItems: 'center', 'justifyContent': 'center' }}>
                                <Text style={{ fontFamily: 'DmSans', fontSize: 25 }}>No History</Text>
                            </View>
                        )
                    )
                }
            </View>
        </SafeAreaView >
    )
}

export default Scanner

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 15,
        justifyContent: 'center'
    }
})
