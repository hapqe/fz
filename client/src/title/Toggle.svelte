<script context="module" lang="ts">
    import { writable } from "svelte/store";

    export const playing = writable(localStorage.getItem("playing") === "true");
    playing.subscribe((value) =>
        localStorage.setItem("playing", String(value))
    );
</script>

<main class="end">
    spectate
    <span>
        <input bind:checked={$playing} type="checkbox" id="toggle" />
    </span>
    fight
</main>

<style>
    main {
        grid-area: toggle;
    }
</style>
