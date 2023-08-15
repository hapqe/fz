import { writable } from "svelte/store";

export const playing = writable(localStorage.getItem("playing") === "true");
playing.subscribe(value => localStorage.setItem("playing", value.toString()));

export const code = writable<string | null>(null);