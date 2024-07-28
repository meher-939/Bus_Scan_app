import axios from "axios"
import { getToken } from "../context/AuthContext";

const api = axios.create({
    baseURL: 'http://143.47.59.97:4000',
    headers: {
        "Content-Type": 'application/json'
    }
})

api.interceptors.request.use(async (config) => {
    const token = await getToken('token');
    if (token) {
        config.headers.Authorization = token
    }
    return config;
}, (error) => {
    console.log(error)
    return Promise.reject(error)
})

export const getBusValid = async (busNumber) => {
    try {
        const res = await api.get(`/api/v1/op/validBus/${busNumber}`);
        return res.status === 200;
    } catch (err) {
        console.log(err)
        return false;
    }
}

export const getStuDetails = async (rollno, busNumber, setLoading, username) => {
    try {
        const res = await api.post(`/api/v1/op/check`, {
            rollNo: rollno, busNumber: busNumber, operator: username
        })
        console.log(res)
        return res.data.details;
    } catch (error) {
        return error.response.status
    }
    finally {
        setLoading(false)
    }
}

export const login = async (operatorId, password, setLoading) => {
    try {
        setLoading(true)
        const res = await axios.post(`http://143.47.59.97:4000/api/v1/op/login`, {
            operator_id: operatorId,
            password: password
        })
        return res;
    } catch (error) {
        return false
    }
    finally {
        setLoading(false)
    }
}

export const getScanData = async (date, busNumber) => {
    try {
        // console.log(date, busNumber)
        const res = await api.post(`api/v1/op/getScanData`, {
            date: date,
            busNumber: busNumber
        })
        return res.data.data
    } catch (error) {
        console.log(error)
        return error.response
    }
}


export const getTodayBusData = async (username) => {
    try {
        console.log("username" + username)
        const date = new Date().toISOString().split('T')[0].split('-').reverse().join("-").toString()
        const res = await api.get(`api/v1/op/getTodayBus/${date}/${username}`);
        return res.data.data
    }
    catch (error) {
        console.log(error)
        return error.response
    }
}