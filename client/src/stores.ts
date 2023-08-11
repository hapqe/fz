import { writable } from "svelte/store";
import { getCode } from "./helpers";

export type RoomType = "online" | "create" | "join";
export type Phase = "lobby" | "deck" | "game" | "end";

export const roomType = writable<RoomType>(getCode() ? "join" : "create");
export const phase = writable<Phase>("lobby");

export const joined = writable(false);