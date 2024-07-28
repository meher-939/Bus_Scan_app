import { Pressable, StyleSheet, Text, View } from 'react-native'
import React from 'react'

const BusSearch = ({ busNumber, count }) => {
    return (
        <Pressable style={{
            backgroundColor: '#f5f5f4', marginBottom: 15, shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.25,
            shadowRadius: 10,
            elevation: 2,
            borderColor: '#94a3b8',
            borderWidth: 0.3,
            borderRadius: 1.5,
            marginHorizontal: 5
        }}>
            <View style={{ paddingHorizontal: 20, paddingVertical: 20, flexDirection: 'row', gap: 20, justifyContent: 'space-between' }}>
                <Text style={{ fontFamily: 'DmSans', fontSize: 20 }}>Bus No. : <Text style={{ fontFamily: 'DmSans-B' }}>{busNumber}</Text></Text>
                <Text style={{ fontFamily: 'DmSans', fontSize: 20 }}>Student Count: <Text style={{ fontFamily: 'DmSans-B' }}>{count}</Text></Text>
            </View >
        </Pressable >
    )
}

export default BusSearch

const styles = StyleSheet.create({})