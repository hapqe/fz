<script lang="ts">
    import { io } from "socket.io-client";
    import Player from "./Player.svelte";
    import Spectators from "./Spectators.svelte";
    import socket from "../socket";

    let players = [false, false, false, false];

    socket.on("join", (index: number) => {
        console.log(index);

        players[index] = true;
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
