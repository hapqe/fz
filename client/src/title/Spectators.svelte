<script lang="ts">
    import { bounceOut } from "svelte/easing";
    import { scale } from "svelte/transition";

    import { key, type Context } from "./Players.svelte";
    import { getContext } from "svelte";

    const { onConnect } = getContext<Context>(key);

    let spectators = 0;

    onConnect.subscribe((socket) => {
        socket.on("spectators", (info) => {
            console.log(info);

            spectators = info.count;
        });
    });
</script>

<main class="end">
    {#key spectators}
        <h4 in:scale={{ easing: bounceOut }}>{spectators} Spectators</h4>
    {/key}
</main>

<style>
    main {
        grid-area: spectators;
        height: min-content;
    }
</style>
