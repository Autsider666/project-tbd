import { useContext, useState, createContext, useEffect } from 'react';
import { socket } from '../functions/SocketAPI';
import { useApp } from './AppContext';
// import { EVENT_NAMES, EMIT_NAMES} from '../functions/SocketAPI'
import { DateTime } from 'luxon'

const GameContext = createContext();

const useGame = () => useContext(GameContext);

const getSettlements = (originId, targetId) => new Promise(resolve => {
    socket.emit('travel:calculate', { originId, targetId }, data => {
        resolve(data)
    })
})

const transferSurvivor = (action, type, partyId) => {
    console.log({ action, type, partyId })
    socket.emit('survivor:' + action, { type, partyId })
}

const recruitSurvivor = (type, partyId) => transferSurvivor('recruit', type, partyId)

const dismissSurvivor = (type, partyId) => transferSurvivor('dismiss', type, partyId)



const GameProvider = ({ children }) => {

    const { displaySnackbar } = useApp()

    const [allEntities, setAllEntities] = useState()
    const [currentTick, setCurrentTick] = useState({})
    const { startedAt, endsAt } = currentTick
    const lStartedAt = (startedAt && endsAt) && DateTime.fromISO(startedAt)
    const lEndsAt = (startedAt && endsAt) && DateTime.fromISO(endsAt)
    const tickLength = Object.values(currentTick).length > 0 ? (startedAt && endsAt) && lEndsAt.diff(lStartedAt, 'seconds').toObject() : { seconds: 6 }
    // console.log(tickLength)
    // console.log({currentTick, lStartedAt, lEndsAt, tickLength})

    const [survivorTypes, setSurvivorTypes] = useState(null)

    const [worldRepository, setWorldRepository] = useState({})
    const [regionRepository, setRegionRepository] = useState({})
    const [borderRepository, setBorderRepository] = useState({})
    const [partyRepository, setPartyRepository] = useState({})
    const [resourceNodeRepository, setResourceNodeRepository] = useState({})
    const [settlementRepository, setSettlementRepository] = useState({})
    const [voyageRepository, setVoyageRepository] = useState({})
    const [expeditionRepository, setExpeditionRepository] = useState({})
    const [resourceRepository, setResourceRepository] = useState({})

    const [notificationLog, setNotificationLog] = useState([])

    const [tabSelected, setTabSelected] = useState(0)


    const [travelPaths, setTravelPaths] = useState({})
    const [selectedRegionTravelPath, setSelectedRegionTravelPath] = useState({})
    const [currentExpeditionTravelPath, setCurrentExpeditionTravelPath] = useState({})

    const resetRepositories = () => {
        setWorldRepository({})
        setRegionRepository({})
        setBorderRepository({})
        setPartyRepository({})
        setResourceNodeRepository({})
        setSettlementRepository({})
        setVoyageRepository({})
        setExpeditionRepository({})
        setResourceRepository({})
    }



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
        // console.log(entities)
        // Does all the pretty work of saving it into the various repositories.

        const entitiesFormatted = Object.values(entities).reduce((accum, { id, entityType, ...rest }) => {
            accum[`${entityType.toLowerCase()}Repository`][id] = { id, ...rest }
            return accum
        }, {
            worldRepository: {},
            regionRepository: {},
            borderRepository: {},
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
        setPartyRepository(prev => ({ ...prev, ...entitiesFormatted.partyRepository }))
        setResourceNodeRepository(prev => ({ ...prev, ...entitiesFormatted.resourcenodeRepository }))
        setSettlementRepository(prev => ({ ...prev, ...entitiesFormatted.settlementRepository }))
        setVoyageRepository(prev => ({ ...prev, ...entitiesFormatted.voyageRepository }))
        setExpeditionRepository(prev => ({ ...prev, ...entitiesFormatted.expeditionRepository }))
        setResourceRepository(prev => ({ ...prev, ...entitiesFormatted.resourceRepository }))

        setAllEntities(entities) // temp state for testing
        // if (isLoaded()) setLoaded(true)
    }

    const notificationUpdater = ({ message, severity, categories, timestamp }) => {
        if (severity !== "error" && severity !== "warning") {
            setNotificationLog(prev => {
                prev.unshift({
                    message, severity, categories, timestamp: DateTime.fromISO(timestamp)
                    , localTimeStamp: (new Date()).getTime()
                })
                return prev
            })
        } else {
            displaySnackbar(message, severity)
        }
    }

    

    const loaded = isLoaded()

    // const partyRepositoryLength = Object.keys(partyRepository).length

    useEffect(() => {
        if (loaded) {
            const partySettlementId = Object.values(partyRepository).find(party => party.controllable === true)?.settlement
            // console.log({ partySettlementId })
            // console.log(settlementRepository)
            const regionOfPartySettlement = settlementRepository[partySettlementId]?.region
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
            socket.emit('survivor:list', data => {
                setSurvivorTypes(data)
            })
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
    const currentSettlementParties = currentSettlement && currentSettlement.parties.map(party => partyRepository[party])
    const currentRegionId = currentSettlement && currentSettlement.region
    const selectedRegion = regionRepository[selectedRegionId]
    const selectedSettlement = selectedRegion && settlementRepository[selectedRegion.settlement]
    const currentVoyage = Object.values(voyageRepository).find(voyage => voyage.party === controlledParty.id && voyage.finished === false)

    const selectedResourceNodes = Object.values(resourceNodeRepository).filter(resourceNode => resourceNode.region === selectedRegionId)
    // console.log(expeditionRepository)
    const currentExpedition = Object.values(expeditionRepository).find(expedition => expedition.party === controlledParty.id && expedition.currentPhase !== "finished")
    const currentExpeditionPhaseStartedAt = currentExpedition && DateTime.fromJSDate(new Date(currentExpedition.currentPhaseStartedAt))
    const currentExpeditionPhaseEndsAt = currentExpedition && DateTime.fromJSDate(new Date(currentExpedition.currentPhaseEndsAt))
    const currentExpeditionPhaseTimeRemaining = currentExpedition ? currentExpeditionPhaseEndsAt.diff(DateTime.fromJSDate(new Date()), 'seconds').toObject() : { seconds: 0 }
    // console.log({ currentExpedition, currentExpeditionPhaseStartedAt })
    // currentExpedition && console.log(currentExpedition.currentPhaseStartedAt)

    const currentVoyagePhaseStartedAt = currentVoyage && DateTime.fromJSDate(new Date(currentVoyage.startedAt))
    const currentVoyagePhaseEndsAt = currentVoyage && DateTime.fromJSDate(new Date(currentVoyage.arrivalAt))
    const currentVoyagePhaseTimeRemaining = currentVoyage && currentVoyagePhaseEndsAt.diff(DateTime.fromJSDate(new Date()), 'seconds').toObject()
    // currentVoyage && console.log({currentVoyagePhaseEndsAt, currentVoyagePhaseTimeRemaining})


    // console.log({worldRepository, controlledParty})

    // con  sole.log(currentExpeditionPhaseTimeRemaining)

    // const currentExpeditionStartedAt = currentExpedition && DateTime.fromHTTP(currentExpedition.startedAt)


    // console.log(currentSettlement)

    const partySurvivors = controlledParty && controlledParty.survivors.filter(survivor => survivor)

    const partySurvivorsGrouped = partySurvivors && partySurvivors.reduce((accum, value) => {
        const survivorGroupFound = accum.find(survivorGroup => survivorGroup.name === value.name)
        if (survivorGroupFound) {
            survivorGroupFound.count += 1
        } else {
            accum.push(
                {
                    count: 1,
                    name: value.name,
                    content: value
                }
            )
        }

        return accum
    }, [])

    const currentSettlementSurvivorsGrouped = currentSettlement && currentSettlement.survivors.reduce((accum, value) => {
        const survivorGroupFound = accum.find(survivorGroup => survivorGroup.name === value.name)
        if (survivorGroupFound) {
            survivorGroupFound.count += 1
        } else {
            accum.push(
                {
                    count: 1,
                    name: value.name,
                    content: value
                }
            )
        }

        return accum
    }, [])

    const currentSettlementSurvivors = selectedSettlement && selectedSettlement.survivors
    const partyResources = controlledParty && Object.values(controlledParty.resources).map(resourceId => resourceRepository[resourceId])
    const currentSettlementResources = currentSettlement && Object.values(currentSettlement.resources).map(resourceId => resourceRepository[resourceId])





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
            // console.log(data)
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

    // console.log({ settlementRepository, partyRepository })




    const value = {
        allEntities,
        loaded,
        currentRegionId,
        worldRepository, regionRepository, borderRepository, partyRepository, resourceNodeRepository, settlementRepository, voyageRepository, expeditionRepository, resourceRepository,
        controlledParty, partyResources, partySurvivors, partySurvivorsGrouped,
        currentSettlement, currentSettlementId, currentSettlementResources, currentSettlementSurvivors, currentSettlementSurvivorsGrouped, currentSettlementParties,
        currentExpedition, currentExpeditionTravelPath, currentExpeditionPhaseTimeRemaining,
        currentVoyage, currentVoyagePhaseTimeRemaining,
        selectedResourceNodes,
        selectedRegion, selectedRegionId, setSelectedRegionId, selectedSettlement,
        travelPaths, selectedRegionTravelPath,
        tickLength,
        recruitSurvivor, dismissSurvivor,
        notificationLog,
        resetRepositories,
        survivorTypes,
        tabSelected, setTabSelected,
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