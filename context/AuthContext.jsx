import { useContext, createContext, useState, useEffect } from "react";
import * as SecureStore from 'expo-secure-store';

const AuthContext = createContext()

export const useAuth = () => {
    let context = useContext(AuthContext)
    if (!context) {
        throw new Error('useAuth must be used inside the AuthContext')
    }
    return context;
}
export const getToken = async (key) => {
    const token = await SecureStore.getItemAsync(key);
    return token;
}
export const AuthProvider = ({ children }) => {
    const [userToken, setUserToken] = useState('')

    const [username, setUsername] = useState()

    const setToken = async (key, value) => {
        if (key != '' || key != null || value != '' || value != null) {
            await SecureStore.setItemAsync(key, value)
        }
        else {
            throw new Error('Unable to Store')
        }
    }
    const deleteToken = async (key) => {
        await SecureStore.deleteItemAsync(key)
    }
    useEffect(() => {
        try {
            // Get user token from secure store and save it in state
            getToken('token')
                .then((res) => {
                    if (res != '' || res != undefined || res != null) {
                        setUserToken(res)
                    }
                })
                .catch((err) => {
                    throw new Error(err)
                })

            getToken('username')
                .then((res) => {
                    if (res != '' || res != undefined || res != null) {
                        setUsername(res)
                    }
                })
                .catch((err) => {
                    throw new Error(err)
                })
        } catch (error) {
            throw new Error(error)
        }
    }, [])

    return <AuthContext.Provider value={{ userToken, deleteToken, setToken, username, setUsername }}>
        {children}
    </AuthContext.Provider>
}