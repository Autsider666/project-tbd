import { io } from 'socket.io-client';

const socket = io(process.env.BACKEND)

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
