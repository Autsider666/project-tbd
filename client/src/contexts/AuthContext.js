import { useContext, useState, createContext, useEffect } from 'react';
import { socket, socketPromise } from '../functions/SocketAPI';
import { useGame } from './GameContext';

const AuthContext = createContext();

const useAuth = () => useContext(AuthContext);

const getWorlds = () => new Promise(resolve => {
    socket.emit('world:list', data => {
        resolve(data)
    })
})

const getSettlements = worldId => new Promise(resolve => {
    socket.emit('settlement:list', worldId, data => {
        resolve(data)
    })
})

// useEffect(() => {
//     setCount(JSON.parse(window.localStorage.getItem('count')));
// }, []);

// useEffect(() => {
//     window.localStorage.setItem('count', count);
// }, [count]);


const AuthProvider = ({ children }) => {

    const [user, setUser] = useState({})
    const { token } = user

    const tbdToken = localStorage.getItem("tbd-token")
    

    // console.log({tbdToken, token})

    const resetAuth = () => {
        localStorage.removeItem("tbd-token")
        setUser({})
    }

    const partyCreate = async name => {
        const worlds = await getWorlds()
        const selectedWorld = worlds.find(world => world.id !== "a")
        const settlements = await getSettlements({ worldId: selectedWorld.id })

        const selectedSettlement = settlements.reduce((accum, value) => {
            if (value.parties.length < accum.parties.length) accum = value
            return accum
        })
        socket.emit('party:create', { name, settlementId: selectedSettlement.id }, token => localStorage.setItem("tbd-token", token))
    }

    useEffect(() => {
        if (tbdToken) {
            console.log("Logging in based on token in local storage")
            setUser({ token: tbdToken })
            socket.emit('party:init', tbdToken)
        }

    }, [tbdToken])

    // console.log(user)



    const signup = () => { }
    const signin = () => { }
    const signout = () => { }
    const passwordReset = () => { }

    const value = {
        partyCreate,
        resetAuth,
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