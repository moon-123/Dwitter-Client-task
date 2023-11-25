import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import { config } from '../config.js';

class Socket {
    constructor(server){
        this.io = new Server(server, {
            cors: {
                origin: '*'
            }
        });

        this.io.use((socket, next) => {
            const token = socket.handshake.auth.token;
            // 서로 맞물렸을때 auth안에 token을 넣어서 전달
            if(!token){
                return next(new Error('인증 에러!'))
            }
            jwt.verify(token, config.jwt.secretkey, (error, decoded) => {
                if(error){
                    return next(new Error('인증 에러!'))
                }
                next();
            });
        });

        this.io.on('connection', (socket) => {
            console.log('클라이언트 접속!');
        })
    }
}

let socket;
export function initSocket(server){
    // GET /socket.io/?EIO=4&transport=polling&t=Om0Cry4 404 0.309 ms - 9 
    // 에러 조치 완료
    // 발생 이유 : server에서 값을 받고, new Socket을 초기화 하는 함수까지는 좋았지만
    // new Socket의 값이 전달되지 않았기 때문에 지속적으로 에러가 발생함.
    if(!socket){
        socket = new Socket(server);
    }
}

export function getSocketIO(){
    if(!socket){
        throw new Error('먼저 init를 실행해야 함!');
    }
    return socket.io;
}