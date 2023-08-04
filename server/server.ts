import express from 'express';
import http from 'http';
import { Server, Socket } from 'socket.io';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { Game } from '../game/game';

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(createProxyMiddleware('/', { target: 'http://localhost:4001', ws: true }));

class Player {
    constructor(public code?: string, public id?: number) { }
}

class Room {
    players: boolean[] = [false, false, false, false];

    empty() {
        return this.players.every((value) => !value);
    }

    next() {
        return this.players.indexOf(false);
    }

    leave(id: number) {
        this.players[id] = false;
    }
}

const players = new Map<string, Player>();
const rooms = new Map<string, Room>();

class ClientError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "ClientError";
    }
}

function handle(e: any, callback: any) {
    if (e instanceof ClientError)
        callback({ error: e.message });
    else {
        console.log(e.message);
        callback({ error: 'Unknown error' });
    }
}

function validate(info: any) {
    if (!info.code || typeof info.playing !== 'boolean') {
        throw new ClientError('Invalid data');
    }
}

function join(socket: Socket, info: any) {
    if (info.playing) {
        const room = rooms.get(info.code);

        if (!room)
            throw new ClientError('Room does not exist');

        const id = room.next();
        if (id === -1) {
            throw new ClientError('Room is full');
        }
        room.players[id] = true;
        socket.join(info.code);

        return new Player(info.code, id);
    }

    socket.join(info.code);
    return new Player(info.code);
}

io.on('connection', (socket) => {
    socket.on('join', (info, callback) => {
        try {
            validate(info);

            if (players.has(socket.id))
                throw new ClientError('Already joined');

            players.set(socket.id, join(socket, info));
        }
        catch (e) {
            handle(e, callback);
        }
    });

    socket.on('create', (info, callback) => {
        try {
            validate(info);

            if (rooms.has(info.code))
                throw new ClientError('Room already exists');

            rooms.set(info.code, new Room());

            const p = join(socket, info);
            players.set(socket.id, p);
        }
        catch (e) {
            handle(e, callback);
        }
    });

    socket.on('disconnect', () => {
        const player = players.get(socket.id);
        if (!player) return;

        if (player.code) {
            const room = rooms.get(player.code)!;
            room.leave(player.id!);

            if (room.empty()) {
                rooms.delete(player.code);
            }
        }
        players.delete(socket.id);
    });
});

server.listen(4000, () => {
    console.log('listening on *:4000');
});