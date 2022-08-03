import { useContext, useState, createContext, useEffect } from 'react';

const LogContext = createContext();

const useLog = () => useContext(LogContext);

const LogProvider = ({ children }) => {

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