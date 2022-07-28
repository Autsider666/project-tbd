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


export { socket, NodeRequest, socketPromise }