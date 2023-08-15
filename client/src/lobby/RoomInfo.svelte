<script lang="ts">
    import socket from "../socket";
    import Player from "./Player.svelte";
    import Spectators from "./Spectators.svelte";

    let players = [false, false, false, false];
    let you = -1;

    socket.on("roomInfo", (info) => {
        players = info.players;
        you = info.you;
        spectators.update(info);

        if (players.every((p) => p)) {
            let interval = setInterval(() => {
                seconds--;
                if (seconds == 0) {
                    clearInterval(interval);
                }
            }, 1000);
        }
    });

    let seconds = 5;

    let spectators: Spectators;
</script>

<main>
    {#each [...Array(4).keys()] as index}
        <Player active={players[index]} {index} you={index == you} />
    {/each}

    <div class="center">
        <slot />
        <span>
            {#if players.every((p) => p)}
                Game starts in {seconds} seconds
            {/if}
        </span>
    </div>

    <Spectators bind:this={spectators} />
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
