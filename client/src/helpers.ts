export function getCode() {
    return new URLSearchParams(window.location.search).get("j");
}

export class Action<T> {
    constructor(public listeners: ((data: T) => void)[] = [], public invoked = false) { }
    data: T;

    invoke(data: T) {
        this.data = data;
        this.listeners.forEach((listener) => listener(data));
        this.invoked = true;
        return data;
    }

    subscribe(listener: (data: T) => void) {
        this.listeners.push(listener);
        if (this.invoked)
            this.invoke(this.data);
    }
}