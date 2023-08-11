<script context="module" lang="ts">
    import { writable } from "svelte/store";
    import type { Socket } from "socket.io-client";

    export const playing = writable(localStorage.getItem("playing") === "true");

    playing.subscribe((value) => {
        localStorage.setItem("playing", String(value));
    });
</script>

<main class="end">
    spectate
    <input bind:checked={$playing} type="checkbox" id="toggle" />
    fight
</main>

<style>
    main {
        grid-area: toggle;
    }
</style>
