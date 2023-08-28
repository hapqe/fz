import socket from "./socket";

export function getCode() {
    return new URLSearchParams(window.location.search).get("r");
}

export class Action {
    constructor(public listeners: ((...args: any[]) => void)[] = []) { }

    add(listener: (...args: any[]) => void) {
        this.listeners.push(listener);
    }

    invoke(...args: any[]) {
        this.listeners.forEach(listener => listener(...args));
    }
}