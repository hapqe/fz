export class Game {

    players: string[] = [];
    spectators: string[] = [];

    constructor() {
    }

    join(player: string, spectator: boolean) {
        if (spectator)
            this.spectators.push(player);
        else {
            if (this.players.length == 4)
                return { error: 'Room is full' };
            this.players.push(player);
        }
    }

    leave(player: string) {
    }
}