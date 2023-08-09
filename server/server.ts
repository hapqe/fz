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
const spectators = new Map<string, string[]>();

class ClientError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "ClientError";
    }
}

function handle(e: any, callback: any) {
    if (e instanceof ClientError)
        if (callback instanceof Function)
            callback({ error: e.message });
        else {
            console.log(e.message);
            if (callback instanceof Function)
                callback({ error: 'Unknown error' });
        }
}

function validate(info: any, callback: any) {
    if (!(callback instanceof Function) || !info.code || !(info.code.length === 4) || typeof info.playing !== 'boolean') {
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

        io.to(info.code).to(info.code + '_s').emit('join', { id });

        return new Player(info.code, id);
    }

    socket.join(info.code + "_s");

    const s = spectators.get(info.code) || [];
    spectators.set(info.code, [...s, socket.id]);
    io.to(info.code).to(info.code + '_s').emit('spectators', { count: s.length + 1 })

    return new Player(info.code);
}

function leave(socket: Socket) {
    const player = players.get(socket.id);
    if (!player) return;

    if (player.code) {
        if (player.id) {
            const room = rooms.get(player.code)!;
            room.leave(player.id);

            if (room.empty()) {
                rooms.delete(player.code);
            }

            io.to(player.code).to(player.code + '_s').emit('leave', { id: player.id });
        }
        else {
            const s = spectators.get(player.code)!;
            spectators.get(player.code)!.splice(s.indexOf(socket.id), 1);
            io.to(player.code).to(player.code + '_s').emit('spectators', { count: s.length - 1 })
        }
    }
    players.delete(socket.id);
}

io.on('connection', (socket) => {
    socket.on('join', (info, callback) => {
        try {
            validate(info, callback);

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
            validate(info, callback);

            if (rooms.has(info.code))
                throw new ClientError('Room already exists');

            rooms.set(info.code, new Room());

            const p = join(socket, info);
            players.set(socket.id, p);

            callback();
        }
        catch (e) {
            handle(e, callback);
        }
    });

    socket.on('disconnect', () => {
        leave(socket);
    });
});

server.listen(4000, () => {
    console.log('listening on *:4000');
});