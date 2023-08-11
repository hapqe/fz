<script lang="ts">
    import { bounceOut } from "svelte/easing";
    import { scale } from "svelte/transition";
    import socket from "../socket";
    import { roomEvent } from "../helpers";
    import { getContext } from "svelte";
    import { key, type Context } from "./Players.svelte";

    let spectators = 0;

    roomEvent("roomInfo", (info) => {
        spectators = info.spectators;
    });

    const { leave } = getContext<Context>(key);

    leave.add(() => {
        spectators = 0;
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
