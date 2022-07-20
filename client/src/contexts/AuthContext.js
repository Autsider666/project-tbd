import { useContext, useState, createContext } from 'react';
import { socket } from '../functions/SocketAPI';

const AuthContext = createContext();

const useAuth = () => useContext(AuthContext);



const AuthProvider = ({ children }) => {

    const [user, setUser] = useState({})

    const characterCreate = name => {
        socket.emit('character:create', { name }, token => setUser({ token }))
    }



    const signup = () => { }
    const signin = () => { }
    const signout = () => { }
    const passwordReset = () => { }

    const value = {
        characterCreate,
        user,
        signup,
        signin,
        signout,
        passwordReset,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export {
    useAuth,
    AuthProvider
}