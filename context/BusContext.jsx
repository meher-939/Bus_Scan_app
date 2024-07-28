import { useContext, createContext, useState } from "react";

const BusContext = createContext()

export const useBusData = () => {
    let context = useContext(BusContext)
    if (!context) {
        throw new Error('useBusData must be used inside the BusContext')
    }
    return context;
}

export default BusProvider = ({ children }) => {
    const [busNumber, setBusNumber] = useState()
    const [updateData, setUpdateData] = useState(false)
    return <BusContext.Provider value={{ busNumber, setBusNumber ,updateData,setUpdateData}}>
        {children}
    </BusContext.Provider>
}