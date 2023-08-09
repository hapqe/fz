<script context="module" lang="ts">
    export type Context = {
        onConnect: Action<Socket>;
    };

    export const key = Symbol();
</script>

<script lang="ts">
    import { Socket, io } from "socket.io-client";
    import Player from "./Player.svelte";
    import Spectators from "./Spectators.svelte";
    import { setContext } from "svelte";
    import { Action } from "../helpers";
    import { playing } from "./Toggle.svelte";

    let players = [false, false, false, false];

    const context = {
        onConnect: new Action<Socket>(),
    };

    setContext(key, context);

    context.onConnect.subscribe((socket) => {
        socket.on("join", (info) => {
            players[info.id] = true;
        });

        playing.subscribe((value) => {
            socket.emit("role", { playing: value });
        });
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
