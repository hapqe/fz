<script lang="ts" context="module">
    export const key = Symbol();
    export type Context = {
        type: RoomType;
        leave: Action;
    };
</script>

<script lang="ts">
    import Player from "./Player.svelte";
    import Spectators from "./Spectators.svelte";
    import { playing } from "./Toggle.svelte";
    import socket from "../socket";
    import { Action, roomEvent } from "../helpers";
    import { joined, roomType, type RoomType } from "../stores";
    import { setContext } from "svelte";

    let players = [false, false, false, false];

    export let type: RoomType;

    playing.subscribe((value) => {
        if ($roomType == type && $joined)
            socket.emit("role", { playing: $playing }, (changed) => {
                if (!changed) $playing = !$playing;
            });
    });

    const leave = new Action();
    setContext(key, { type, leave });

    roomEvent("roomInfo", (info) => {
        players = info.players;
    });

    leave.add(() => {
        socket.emit("leave");
        players = [false, false, false, false];

        const baseUrl = window.location.origin + window.location.pathname;
        history.replaceState({}, document.title, baseUrl);

        $roomType = "create";
    });

    roomType.subscribe((value) => {
        if (value == "create") {
            players = [false, false, false, false];
        }
    });
</script>

<main>
    {#each [...Array(4).keys()] as index}
        {#if players[index]}
            <Player {index} />
        {/if}
    {/each}

    <div class="center">
        <slot />
    </div>

    <Spectators />
</main>

<style>
    main {
        grid-area: players;
        display: grid;
        grid-template-areas:
            "p0 qr p1"
            "p2 qr p3"
            "spectators spectators spectators";

        grid-template-columns: min-content 1fr min-content;
        grid-template-rows: 1fr 1fr min-content;

        flex: 0 0 100%;
        scroll-snap-align: center;
    }

    div {
        grid-area: qr;
    }
</style>
