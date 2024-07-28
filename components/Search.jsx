import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import Input from './Input'
import Icon from "react-native-vector-icons/Feather"

const Search = ({ onChange, onPress, value, placeholder, keyboard = true, disabled=false }) => {
    return (
        <View style={styles.container}>
            <View style={{ flex: 1 }}>
                <Input placeholder={placeholder} handleChange={onChange} value={value} numberKeyboard={keyboard} />
            </View>
            <TouchableOpacity style={{
                padding: 15, alignItems: 'center', justifyContent: 'center', backgroundColor: '#fd8438', borderRadius: 5, shadowColor: '#000',
                shadowOffset: { width: 0, height: 1.5 },
                shadowOpacity: 0.25,
                shadowRadius: 8,
                elevation: 3,
                borderColor: '#94a3b8',
                borderWidth: 0.5
            }} onPress={onPress} disabled={disabled}>
                <Icon name='search' size={28} color={'white'} />
            </TouchableOpacity>
        </View>
    )
}
export default Search

const styles = StyleSheet.create({
    container: {
        width: '100%',
        flexDirection: "row",
        gap: 10,
        marginBottom: 15
    }
})