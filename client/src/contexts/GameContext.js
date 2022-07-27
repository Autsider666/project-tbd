import { useContext, useState, createContext, useEffect } from 'react';
import { socket } from '../functions/SocketAPI';
// import { EVENT_NAMES, EMIT_NAMES} from '../functions/SocketAPI'
import { useAuth } from './AuthContext';

const GameContext = createContext();

const useGame = () => useContext(GameContext);

const GameProvider = ({ children }) => {

    const { user } = useAuth()
    const { token = null } = user

    // const [loaded, setLoaded] = useState(false)

    const [allEntities, setAllEntities] = useState()

    const [worldRepository, setWorldRepository] = useState({})
    const [regionRepository, setRegionRepository] = useState({})
    const [borderRepository, setBorderRepository] = useState({})
    const [survivorRepository, setSurvivorRepository] = useState({})
    const [partyRepository, setPartyRepository] = useState({})
    const [resourceNodeRepository, setResourceNodeRepository] = useState({})
    const [settlementRepository, setSettlementRepository] = useState({})
    const [voyageRepository, setVoyageRepository] = useState({})

    const isLoaded = () => {
        // console.log({
        //     worldRepository, regionRepository,
        //     borderRepository,
        //     survivorRepository,
        //     partyRepository,
        //     resourceNodeRepository,
        //     settlementRepository,
        // })
        // if (Object.keys(worldRepository).length === 0) console.log("errors out at: worldRepository")
        if (Object.keys(worldRepository).length === 0) return false
        // if (Object.keys(regionRepository).length === 0) console.log("errors out at: regionRepository")
        if (Object.keys(regionRepository).length === 0) return false
        // if (Object.keys(borderRepository).length === 0) console.log("errors out at: borderRepository")
        if (Object.keys(borderRepository).length === 0) return false
        // if (Object.keys(survivorRepository).length === 0) console.log("errors out at: survivorRepository")
        if (Object.keys(survivorRepository).length === 0) return false
        // if (Object.keys(partyRepository).length === 0) console.log("errors out at: partyRepository")
        if (Object.keys(partyRepository).length === 0) return false
        // if (Object.keys(resourceNodeRepository).length === 0) console.log("errors out at: resourceNodeRepository")
        if (Object.keys(resourceNodeRepository).length === 0) return false
        // if (Object.keys(settlementRepository).length === 0) console.log("errors out at: settlementRepository")
        if (Object.keys(settlementRepository).length === 0) return false
        console.log("IS LOADED NOW! YAY")
        return true
    }

    const [selectedRegion, setSelectedRegion] = useState(null)

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
            resourcenodeRepository: {},
            settlementRepository: {},
            voyageRepository: {}
        })
        setWorldRepository(prev => ({ ...prev, ...entitiesFormatted.worldRepository }))
        setRegionRepository(prev => ({ ...prev, ...entitiesFormatted.regionRepository }))
        setBorderRepository(prev => ({ ...prev, ...entitiesFormatted.borderRepository }))
        setSurvivorRepository(prev => ({ ...prev, ...entitiesFormatted.survivorRepository }))
        setPartyRepository(prev => ({ ...prev, ...entitiesFormatted.partyRepository }))
        setResourceNodeRepository(prev => ({ ...prev, ...entitiesFormatted.resourcenodeRepository }))
        setSettlementRepository(prev => ({ ...prev, ...entitiesFormatted.settlementRepository }))
        setVoyageRepository(prev => ({ ...prev, ...entitiesFormatted.voyageRepository }))




        setAllEntities(entities) // temp state for testing
        // if (isLoaded()) setLoaded(true)
    }

    const loaded = isLoaded()

    // const partyRepositoryLength = Object.keys(partyRepository).length

    useEffect(() => {
        if (loaded) {
            const partySettlementId = Object.values(partyRepository)[0].settlement
            // console.log({ partySettlementId })
            // console.log(settlementRepository)
            const regionOfPartySettlement = settlementRepository[partySettlementId].region
            // console.log({ regionOfPartySettlement })
            setSelectedRegion(regionOfPartySettlement)
        }
    }, [loaded])

    // useEffect(()=>{
    //     console.log(loaded2)
    //     console.log(settlementRepository)
    //     // console.log(isLoaded())
    // },[loaded2])


    // console.log({
    //     worldRepository, regionRepository, borderRepository, survivorRepository, partyRepository,
    // })

    useEffect(() => {
        !socket.hasListeners('entity:update') && socket.on('entity:update', entityUpdater)
        // token && socket.emit('party:init', token, data => console.log(data))
        return () => socket.off('entity:update', entityUpdater)
    }, [])

    const value = {
        allEntities,
        loaded,
        token,
        worldRepository, regionRepository, borderRepository, survivorRepository, partyRepository, resourceNodeRepository, settlementRepository, voyageRepository,
        selectedRegion, setSelectedRegion,
    };

    // console.log(value)

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