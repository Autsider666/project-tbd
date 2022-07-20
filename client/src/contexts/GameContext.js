import { useContext, useState, createContext, useEffect } from 'react';
import { socket, EVENT_NAMES, EMIT_NAMES } from '../functions/SocketAPI';
import { useAuth } from './AuthContext';

const GameContext = createContext();

const useGame = () => useContext(GameContext);

const GameProvider = ({ children }) => {

    const { user } = useAuth()
    const { token = "" } = user

    const [loaded, setLoaded] = useState(false)

    const [allEntities, setAllEntities] = useState()

    const entityUpdater = entities => {
        // Does all the pretty work of saving it into the various repositories.

        // temp state for testing
        setAllEntities(entities)
        setLoaded(true)
    }

    useEffect(() => {
        !socket.hasListeners('entity:update') && socket.on('entity:update', entityUpdater)
        socket.emit('character:init', token, data => console.log(data))
        return () => socket.off('entity:update', setCharacters)
    }, [token])

    const [world, setWorld] = useState({})
    const [regions, setRegions] = useState([])
    const [borders, setBorders] = useState([])
    const [characters, setCharacters] = useState([])

    // // "WorldRepository"
    // useEffect(() => {
    //     socket.emit(EMIT_NAMES.WORLD, jwt, setWorld)
    //     !socket.hasListeners(EVENT_NAMES.WORLD) && socket.on(EVENT_NAMES.WORLD, setWorld)
    //     return () => socket.off(EVENT_NAMES.WORLD, setWorld)
    // }, [jwt])

    // // "RegionRepository"
    // useEffect(() => {
    //     socket.emit(EMIT_NAMES.REGIONS, jwt, setRegions)
    //     !socket.hasListeners(EVENT_NAMES.REGIONS) && socket.on(EVENT_NAMES.REGIONS, setRegions)
    //     return () => socket.off(EVENT_NAMES.REGIONS, setRegions)
    // }, [jwt])

    // // "BorderRepository"
    // useEffect(() => {
    //     socket.emit(EMIT_NAMES.BORDERS, jwt, setBorders)
    //     !socket.hasListeners(EVENT_NAMES.BORDERS) && socket.on(EVENT_NAMES.BORDERS, setBorders)
    //     return () => socket.off(EVENT_NAMES.BORDERS, setBorders)
    // }, [jwt])

    // // "CharacterRepository"
    // useEffect(() => {
    //     socket.emit(EMIT_NAMES.CHARACTERS, jwt, setCharacters)
    //     !socket.hasListeners(EVENT_NAMES.CHARACTERS) && socket.on(EVENT_NAMES.CHARACTERS, setCharacters)
    //     return () => socket.off(EVENT_NAMES.CHARACTERS, setCharacters)
    // }, [jwt])



    const value = {
        allEntities,
        loaded,
        token
    };

    console.log(value)

    return (
        <GameContext.Provider value={value}>
            {children}
        </GameContext.Provider>
    );
}

export {
    useGame,
    GameProvider
}