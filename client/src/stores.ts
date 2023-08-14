import { writable } from "svelte/store";
import { getCode } from "./helpers";

export type LobbyMode = "online" | "create" | "join";

export const playing = writable(localStorage.getItem("playing") === "true");
export const lobbyMode = writable<LobbyMode>(getCode() ? "join" : "create");
export const joined = writable(false);
export const code = writable(getCode());