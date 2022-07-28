import { useContext, useState, createContext, useEffect } from 'react';
import { socket } from '../functions/SocketAPI';
import { useAuth } from './AuthContext';

const LogContext = createContext();

const useLog = () => useContext(LogContext);

const LogProvider = ({ children }) => {

    const { user } = useAuth()
    const { token = "" } = user

    // "WorldRepository"
    const [log, setLog] = useState({})


    const value = {
        log
    };

    return (
        <LogContext.Provider value={value}>
            {children}
        </LogContext.Provider>
    );
}

export {
    useLog,
    LogProvider
}