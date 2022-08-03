import { useContext, useState, createContext, useEffect } from 'react';
import { socket } from '../functions/SocketAPI';
import { useApp } from './AppContext';
// import { EVENT_NAMES, EMIT_NAMES} from '../functions/SocketAPI'
import { useAuth } from './AuthContext';
import { DateTime } from 'luxon'

const GameContext = createContext();

const useGame = () => useContext(GameContext);

const getSettlements = (originId, targetId) => new Promise(resolve => {
    socket.emit('travel:calculate', { originId, targetId }, data => {
        resolve(data)
    })
})

const transferSurvivor = (type, survivorId, partyId) => {
    socket.emit('survivor:' + type, { survivorId, partyId })
}

const recruitSurvivor = (survivorId, partyId) => transferSurvivor('recruit', survivorId, partyId)
const dismissSurvivor = (survivorId, partyId) => transferSurvivor('dismiss', survivorId, partyId)



const GameProvider = ({ children }) => {

    const { user } = useAuth()
    const { token = null } = user
    const { displaySnackbar } = useApp()

    const [allEntities, setAllEntities] = useState()
    const [currentTick, setCurrentTick] = useState({})
    const { startedAt, endsAt } = currentTick

    const lStartedAt = (startedAt && endsAt) && DateTime.fromISO(startedAt)
    const lEndsAt = (startedAt && endsAt) && DateTime.fromISO(endsAt)
    const tickLength = (startedAt && endsAt) && lStartedAt.diff(lEndsAt, 'seconds').toObject()


    const [worldRepository, setWorldRepository] = useState({})
    const [regionRepository, setRegionRepository] = useState({})
    const [borderRepository, setBorderRepository] = useState({})
    const [survivorRepository, setSurvivorRepository] = useState({})
    const [partyRepository, setPartyRepository] = useState({})
    const [resourceNodeRepository, setResourceNodeRepository] = useState({})
    const [settlementRepository, setSettlementRepository] = useState({})
    const [voyageRepository, setVoyageRepository] = useState({})
    const [expeditionRepository, setExpeditionRepository] = useState({})
    const [resourceRepository, setResourceRepository] = useState({})

    const [notificationLog, setNotificationLog] = useState([])


    const [travelPaths, setTravelPaths] = useState({})
    const [selectedRegionTravelPath, setSelectedRegionTravelPath] = useState({})
    const [currentExpeditionTravelPath, setCurrentExpeditionTravelPath] = useState({})



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
        // console.log("IS LOADED NOW! YAY")
        return true
    }

    const [selectedRegionId, setSelectedRegionId] = useState(null)

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
            voyageRepository: {},
            expeditionRepository: {},
            resourceRepository: {},
        })
        setWorldRepository(prev => ({ ...prev, ...entitiesFormatted.worldRepository }))
        setRegionRepository(prev => ({ ...prev, ...entitiesFormatted.regionRepository }))
        setBorderRepository(prev => ({ ...prev, ...entitiesFormatted.borderRepository }))
        setSurvivorRepository(prev => ({ ...prev, ...entitiesFormatted.survivorRepository }))
        setPartyRepository(prev => ({ ...prev, ...entitiesFormatted.partyRepository }))
        setResourceNodeRepository(prev => ({ ...prev, ...entitiesFormatted.resourcenodeRepository }))
        setSettlementRepository(prev => ({ ...prev, ...entitiesFormatted.settlementRepository }))
        setVoyageRepository(prev => ({ ...prev, ...entitiesFormatted.voyageRepository }))
        setExpeditionRepository(prev => ({ ...prev, ...entitiesFormatted.expeditionRepository }))
        setResourceRepository(prev => ({ ...prev, ...entitiesFormatted.resourceRepository }))

        setAllEntities(entities) // temp state for testing
        // if (isLoaded()) setLoaded(true)
    }

    const notificationUpdater = ({ message, severity, categories }) => {
        setNotificationLog(prev => {
            prev.unshift({ message, severity, categories, localTimeStamp: (new Date()).getTime() })
            return prev
        })
        // console.log({ message, severity })
        displaySnackbar(message, severity)
    }

    const loaded = isLoaded()

    // const partyRepositoryLength = Object.keys(partyRepository).length

    useEffect(() => {
        if (loaded) {
            const partySettlementId = Object.values(partyRepository).find(party => party.controllable === true).settlement
            // console.log({ partySettlementId })
            // console.log(settlementRepository)
            const regionOfPartySettlement = settlementRepository[partySettlementId].region
            // console.log({ regionOfPartySettlement })
            setSelectedRegionId(regionOfPartySettlement)
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
        if (!socket.hasListeners('entity:update')) {
            socket.on('entity:update', entityUpdater)
            socket.on('notification', notificationUpdater)
            socket.on('server:turn', setCurrentTick)
        }
        // token && socket.emit('party:init', token, data => console.log(data))
        return () => {
            socket.off('entity:update', entityUpdater)
            socket.off('notification', notificationUpdater)
            socket.off('server:turn,', setCurrentTick)
        }
    }, [])

    const controlledParty = Object.values(partyRepository).find(party => party.controllable)
    const currentSettlement = controlledParty && Object.keys(settlementRepository).length > 0 && settlementRepository[controlledParty.settlement]
    const currentSettlementId = currentSettlement && currentSettlement.id
    const currentRegionId = currentSettlement && currentSettlement.region
    const selectedRegion = regionRepository[selectedRegionId]
    const selectedSettlement = selectedRegion && settlementRepository[selectedRegion.settlement]
    const currentVoyage = Object.values(voyageRepository).find(voyage => voyage.party === controlledParty.id && voyage.finished === false)

    const selectedResourceNodes = Object.values(resourceNodeRepository).filter(resourceNode => resourceNode.region === selectedRegionId)
    const currentExpedition = Object.values(expeditionRepository).find(expedition => expedition.party === controlledParty.id && expedition.phase !== "finished")

    const partySurvivors = controlledParty && controlledParty.survivors.map(survivorId => survivorRepository[survivorId]).filter(survivorId => survivorId)
    console.log(selectedSettlement)
    const currentSettlementSurvivors = selectedSettlement && selectedSettlement.survivors ? selectedSettlement.survivors.map(survivorId => survivorRepository[survivorId]).filter(survivorId => survivorId) : []

    // console.log({controlledParty, survivorRepository, partySurvivors})
    const partyInventory = controlledParty && controlledParty.inventory.map(resourceId => resourceRepository[resourceId])
    const currentSettlementStorage = currentSettlement && currentSettlement.storage.map(resourceId => resourceRepository[resourceId])


    // console.log({partyInventory, currentSettlementStorage})





    const { origin: currentExpeditionOrigin, target: currentExpeditionTarget } = currentExpedition || {}
    useEffect(() => {
        const originId = currentRegionId
        const targetId = selectedRegionId
        originId && targetId && socket.emit('travel:calculate', {
            originId,
            targetId,
        }, data => {
            setTravelPaths(prev => {
                if (prev[originId]) {
                    prev[originId][targetId] = data
                } else {
                    prev[originId] = { [targetId]: data }
                }
                return prev
            })
            setCurrentExpeditionTravelPath(data)
        })
    }, [currentExpeditionOrigin, currentExpeditionTarget])

    // console.log({ selectedRegionId, currentRegionId, travelPaths })
    // const selectedRegionTravelPath = selectedRegionId && currentRegionId && travelPaths[currentRegionId] && travelPaths[currentRegionId][selectedRegionId]
    // console.log(survivorRepository)

    useEffect(() => {
        const originId = currentRegionId
        const targetId = selectedRegionId
        originId && targetId && socket.emit('travel:calculate', {
            originId,
            targetId,
        }, data => {
            console.log(data)
            setTravelPaths(prev => {
                if (prev[originId]) {
                    prev[originId][targetId] = data
                } else {
                    prev[originId] = { [targetId]: data }
                }
                return prev
            })
            setSelectedRegionTravelPath(data)
        })
    }, [selectedRegionId, currentRegionId])






    const value = {
        allEntities,
        loaded,
        token,
        currentRegionId,
        worldRepository, regionRepository, borderRepository, survivorRepository, partyRepository, resourceNodeRepository, settlementRepository, voyageRepository, expeditionRepository, resourceRepository,
        controlledParty, partyInventory, partySurvivors,
        currentSettlement, currentSettlementId, currentSettlementStorage, currentSettlementSurvivors,
        currentExpedition, currentExpeditionTravelPath,
        currentVoyage,
        selectedResourceNodes,
        selectedRegion, selectedRegionId, setSelectedRegionId, selectedSettlement,
        travelPaths, selectedRegionTravelPath,
        tickLength,
        recruitSurvivor, dismissSurvivor,
        notificationLog,

    };

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