import { useContext, useState, createContext, useEffect } from 'react';
import { socket } from '../functions/SocketAPI';
// import { EVENT_NAMES, EMIT_NAMES} from '../functions/SocketAPI'
import { useAuth } from './AuthContext';

const GameContext = createContext();

const useGame = () => useContext(GameContext);

const GameProvider = ({ children }) => {

    const { user } = useAuth()
    const { token = null } = user

    const [loaded, setLoaded] = useState(false)

    const [allEntities, setAllEntities] = useState()

    const [worldRepository, setWorldRepository] = useState({})
    const [regionRepository, setRegionRepository] = useState({})
    const [borderRepository, setBorderRepository] = useState({})
    const [survivorRepository, setSurvivorRepository] = useState({})
    const [partyRepository, setPartyRepository] = useState({})
    const [expeditionTargetRepository, setExpeditionTargetRepository] = useState({})

    const entityUpdater = entities => {
        console.log(entities)
        // Does all the pretty work of saving it into the various repositories.

        const entitiesFormatted = Object.values(entities).reduce((accum, { id, entityType, ...rest }) => {
            accum[`${entityType.toLowerCase()}Repository`][id] = { id, ...rest }
            return accum
        }, {
            worldRepository: {},
            regionRepository: {},
            borderRepository: {},
            survivorRepository: {},
            partyRepository: {},
            expeditionTargetRepository: {},
        })
        setWorldRepository(prev => ({ ...prev, ...entitiesFormatted.worldRepository }))
        setRegionRepository(prev => ({ ...prev, ...entitiesFormatted.regionRepository }))
        setBorderRepository(prev => ({ ...prev, ...entitiesFormatted.borderRepository }))
        setSurvivorRepository(prev => ({ ...prev, ...entitiesFormatted.survivorRepository }))
        setPartyRepository(prev => ({ ...prev, ...entitiesFormatted.partyRepository }))
        setExpeditionTargetRepository(prev => ({ ...prev, ...entitiesFormatted.expeditionTargetRepository }))


        setAllEntities(entities) // temp state for testing
        setLoaded(true)
    }

    console.log({
        worldRepository, regionRepository, borderRepository, survivorRepository, partyRepository,
    })

    useEffect(() => {
        !socket.hasListeners('entity:update') && socket.on('entity:update', entityUpdater)
        token && socket.emit('party:init', token, data => console.log(data))
        return () => socket.off('entity:update', entityUpdater)
    }, [token])


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

    const [selectedRegion, setSelectedRegion] = useState(null)


    const value = {
        allEntities,
        loaded,
        token,
        worldRepository, regionRepository, borderRepository, survivorRepository, partyRepository,
        selectedRegion, setSelectedRegion,
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