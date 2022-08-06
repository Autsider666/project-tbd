import { socket } from "./SocketAPI"

export const voyageStart = (partyId, targetId) => {
    socket.emit("voyage:start", { partyId, targetId })
}

export const expeditionStart = (partyId, targetId) => {
    socket.emit("expedition:start", { partyId, targetId })
}

export const survivorUpgrade = (partyId, currentType, targetType) => {
    socket.emit("survivor:upgrade", { partyId, currentType, targetType })
}

export const settlementUpgrade = (settlementId, building) => {
    // console.log({settlementId, building})
    socket.emit("settlement:upgrade:start", { settlementId, building })
}