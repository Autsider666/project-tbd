import { useContext, useState, createContext, useEffect } from 'react';

const ChatContext = createContext();

const useChat = () => useContext(ChatContext);

const ChatProvider = ({ children }) => {

    // "WorldRepository"
    const [chat, setChat] = useState({})
   
    const value = {
        chat,
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