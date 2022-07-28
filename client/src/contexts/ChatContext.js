import { useContext, useState, createContext, useEffect } from 'react';
import { socket } from '../functions/SocketAPI';
import { useAuth } from './AuthContext';

const ChatContext = createContext();

const useChat = () => useContext(ChatContext);

const ChatProvider = ({ children }) => {

    const { user } = useAuth()
    const { token = "" } = user

    // "WorldRepository"
    const [chat, setChat] = useState({})
   
    const value = {
        chat,
        token
    };

    return (
        <ChatContext.Provider value={value}>
            {children}
        </ChatContext.Provider>
    );
}

export {
    useChat,
    ChatProvider
}