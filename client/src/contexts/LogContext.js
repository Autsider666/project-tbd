import { useContext, useState, createContext, useEffect } from 'react';
import { socket, EVENT_NAMES, EMIT_NAMES } from '../functions/SocketAPI';
import { useAuth } from './AuthContext';

const LogContext = createContext();

const useLog = () => useContext(LogContext);

const LogProvider = ({ children }) => {

    const { user } = useAuth()
    const { token = "" } = user

    // "WorldRepository"
    const [log, setLog] = useState({})
    useEffect(() => {
        socket.emit(EMIT_NAMES.LOG, token, setLog)
        !socket.hasListeners(EVENT_NAMES.LOG) && socket.on(EVENT_NAMES.LOG, setLog)
        return () => socket.off(EVENT_NAMES.LOG, setLog)
    }, [token])

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