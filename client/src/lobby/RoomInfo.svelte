<script lang="ts">
    import Player from "./Player.svelte";
    import Spectators from "./Spectators.svelte";

    let players = [false, false, false, false];

    export function update(data) {
        players = data.players;
        spectators.update(data);
    }

    let spectators: Spectators;
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
