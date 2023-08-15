import express from 'express';
import http from 'http';
import { Server, Socket } from 'socket.io';
import { createProxyMiddleware } from 'http-proxy-middleware';
import Joi, { func } from 'joi';

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(createProxyMiddleware('/', { target: 'http://localhost:4001', ws: true }));

class ClientError extends Error {
    constructor(message: string) {
        super(message);
    }
}

function handle(e: any, socket: Socket) {
    if (e instanceof ClientError) {
        socket.emit('error', { error: e.message });
    }
    else {
        socket.emit('error', { error: 'An error occurred' });
        console.warn(e);
    }
}

function validate(info: any, schema: Joi.ObjectSchema<any>) {
    const { error, value } = schema.validate(info);

    if (error) {
        console.log(error);
        throw new ClientError("Invalid data");
    }

    return value;
}

function requireCallback(callback: any) {
    if (!(callback instanceof Function))
        throw new ClientError("An error occurred");
}

class Room {
    players: (Player | null)[] = [null, null, null, null];
    spectators = new Set<Player>();
    constructor(public code: string) { }

    play(player: Player, info: any) {
        const index = this.players.indexOf(null);
        if (index == -1)
            throw new ClientError("Room is full");

        this.players[index] = player;
        player.room = this;

        this.inform();
    }

    spectate(player: Player) {
        this.spectators.add(player);
        player.room = this;

        this.inform();
    }

    leave(player: Player, deleteIfEmpty = true) {
        const index = this.players.indexOf(player);

        if (index != -1) {
            this.players[index] = null;
        }
        else {
            this.spectators.delete(player);
        }

        if (deleteIfEmpty && this.players.every(p => p == null) && this.spectators.size == 0)
            rooms.delete(this.code);

        player.room = null;

        this.inform();
    }

    full() {
        return this.players.every(p => p != null);
    }

    inform() {
        [...this.players, ...this.spectators].forEach((p) => {
            p?.socket.emit('roomInfo', {
                you: this.players.indexOf(p),
                players: this.players.map(p => p != null),
                spectators: this.spectators.size,
            });
        });
    }
}

class Player {
    room: Room | null = null;
    constructor(public socket: Socket) { }
}

const rooms = new Map<string, Room>();

io.on('connection', (socket) => {
    const player = new Player(socket);

    socket.on('create', (info, callback) => {
        try {
            requireCallback(callback);

            const schema = Joi.object({
                code: Joi.string().length(4).required(),
                playing: Joi.boolean().required()
            })

            validate(info, schema);

            if (rooms.has(info.code)) {
                callback(false);
                throw new ClientError("Room already exists");
            }

            const room = new Room(info.code);
            rooms.set(info.code, room);

            if (info.playing)
                room.play(player, info);
            else
                room.spectate(player);

            callback(true);
        }
        catch (e) {
            handle(e, socket)
        }
    });

    socket.on('join', (info, callback) => {
        try {
            if (player.room)
                throw new ClientError("Already in a room");

            requireCallback(callback);

            const schema = Joi.object({
                code: Joi.string().length(4).required(),
                playing: Joi.boolean().required()
            })

            validate(info, schema);

            const room = rooms.get(info.code);

            if (!room) {
                callback(false);
                throw new ClientError("Room does not exist");
            }

            if (info.playing) {
                if (room.full()) {
                    callback({ full: true });
                }
                room.play(player, info);
            }
            else room.spectate(player);

            callback({ success: true });
        }
        catch (e) {
            handle(e, socket);
        }
    });

    socket.on('role', (info) => {
        try {
            const schema = Joi.object({
                playing: Joi.boolean().required()
            })

            validate(info, schema);

            const room = player.room;
            if (!room)
                throw new ClientError("Not in a room");

            room.leave(player, false);

            if (info.playing)
                room.play(player, info);
            else
                room.spectate(player);
        }
        catch (e) {
            handle(e, socket);
        }
    });


    socket.on('leave', () => {
        player.room?.leave(player);
    });

    socket.on('disconnect', () => {
        player.room?.leave(player);
    });
});


server.listen(4000, () => {
    console.log('listening on *:4000');
});