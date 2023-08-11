import { getContext } from "svelte";
import socket from "./socket";
import { roomType, type RoomType } from "./stores";
import { key, type Context } from "./lobby/Players.svelte";

export class Action {
    constructor(public listeners: (() => void)[] = []) { }

    add(listener: () => void) {
        this.listeners.push(listener);
    }

    remove(listener: () => void) {
        this.listeners = this.listeners.filter(l => l != listener);
    }

    invoke() {
        this.listeners.forEach(l => l());
    }
}

export function getCode() {
    return new URLSearchParams(window.location.search).get("j");
}

export function roomEvent(event: string, action: (...args: any[]) => void) {
    const ctx = getContext<Context>(key);

    roomType.subscribe((value) => {
        if (value == ctx.type) {
            socket.on(event, action);
        } else {
            socket.off(event, action);
        }
    });
}

export function roomMode(action: () => void) {
    const ctx = getContext<Context>(key);

    roomType.subscribe((value) => {
        if (value == ctx.type) {
            action();
        }
    });
}