import { io } from 'socket.io-client';

let socketURL = "";
socketURL = "backend.domain.com"

if (process.env.NODE_ENV === 'development') {
    socketURL = "localhost:5000"
}

const socket = io(socketURL, {
    cors: {
        origin: "localhost:3000",
        credentials: true,
    }
})

// socket.on('connect', function () {
//     socket.emit('authenticate', { token: localStorage.getItem('idToken') }, data => { console.log(data) });
// });

const NodeRequest = 'NodeRequest';
const socketPromise = {
    emit: (eventName, args, ack = () => { }) => {
        return new Promise(resolve => {
            socket.emit(eventName, args, data => {
                ack(data)
                resolve(data)
            })
        })
    }
}

const EVENT_NAMES = {
    WORLD: 'event:world',
    REGION: 'event:regions',
    BORDERS: 'event:borders',
    CHARACTERS: 'event:characters',
    CHAT: 'event:chat',
    LOG: 'event:log',
}

const EMIT_NAMES = {
    WORLD: 'entities:world',
    REGIONS: 'entities:regions',
    BORDERS: 'entities:borders',
    CHARACTERS: 'entities:characters',
    CHAT: 'entities:chat',
    LOG: 'entities:log',
}

export { socket, NodeRequest, socketPromise, EVENT_NAMES, EMIT_NAMES }