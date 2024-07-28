import { StyleSheet, Text, TouchableOpacity } from 'react-native'
import React from 'react'

const Button = ({ onPress, disabled }) => {
    return (
        <TouchableOpacity style={styles.btnContainer} onPress={onPress}>
            <Text style={{ fontFamily: 'DmSans', fontSize: 20, color: '#fff' }}>Login</Text>
        </TouchableOpacity>
    )
}

export default Button

const styles = StyleSheet.create({
    btnContainer: {
        backgroundColor: '#001247',
        paddingHorizontal: 40,
        paddingVertical: 15,
        borderRadius: 5
    }
})