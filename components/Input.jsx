import React from 'react'
import { StyleSheet, TextInput, View } from 'react-native'

const Input = ({ placeholder, value, password, handleChange, numberKeyboard, disabled }) => {
    return (
        <View style={styles.container}>
            <TextInput
                placeholder={placeholder}
                value={value}
                onChangeText={handleChange}
                secureTextEntry={password ? true : false}
                style={styles.input}
                keyboardType={numberKeyboard ? 'numeric' : 'default'}
            // editable={disabled}
            />
        </View>
    )
}

export default Input

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        paddingHorizontal: 20,
        paddingVertical: 15,
        borderRadius: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 10,
        elevation: 5,
        borderColor: '#94a3b8',
        borderWidth: 0.5
    },
    input: {
        fontFamily: 'DmSans',
        fontSize: 19,
        letterSpacing: 0.7,
    }
})