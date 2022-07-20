import { useContext, useState, createContext, useEffect } from 'react';
import { socket, EVENT_NAMES, EMIT_NAMES } from '../functions/SocketAPI';
import { useAuth } from './AuthContext';

const ChatContext = createContext();

const useChat = () => useContext(ChatContext);

const ChatProvider = ({ children }) => {

    const { user } = useAuth()
    const { token = "" } = user

    // "WorldRepository"
    const [chat, setChat] = useState({})
    useEffect(() => {
        socket.emit(EMIT_NAMES.CHAT, token, setChat)
        !socket.hasListeners(EVENT_NAMES.CHAT) && socket.on(EVENT_NAMES.CHAT, setChat)
        return () => socket.off(EVENT_NAMES.CHAT, setChat)
    }, [token])

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