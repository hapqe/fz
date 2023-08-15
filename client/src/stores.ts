import { writable } from "svelte/store";

export const playing = writable(localStorage.getItem("playing") === "true");
export const code = writable<string | null>(null);