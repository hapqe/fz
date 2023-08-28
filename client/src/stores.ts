import { writable } from "svelte/store";
import { Game } from "../../game/game";

export const playing = writable(localStorage.getItem("playing") === "true");
playing.subscribe(value => localStorage.setItem("playing", value.toString()));

export const code = writable<string | null>(null);

type State = "lobby" | "ready" | "game";

export const state = writable<State>("lobby");

export const width = writable(window.innerWidth * window.devicePixelRatio ?? 1);
export const height = writable(window.innerHeight * window.devicePixelRatio ?? 1);

export const game = writable<Game | null>(null);