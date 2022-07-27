import { socket } from "./SocketAPI"

export const voyageStart = (partyId, targetId) => {
    socket.emit("voyage:start",{partyId, targetId})
}

export const expeditionStart = (partyId, targetId) => {
    socket.emit("expedition:start",{partyId, targetId})
}