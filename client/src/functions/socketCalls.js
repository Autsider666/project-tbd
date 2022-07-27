import { socket } from "./SocketAPI"

export const travelToSettlement = (partyId, targetId) => {
    socket.emit("voyage:start",{partyId, targetId})
}

