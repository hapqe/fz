<script lang="ts">
    import { createEventDispatcher } from "svelte";

    export let area: string = "",
        center: boolean = true;

    const dispatch = createEventDispatcher();
</script>

<button
    on:click={() => dispatch("click")}
    class={center ? "center" : ""}
    style="grid-area: {area};"><slot /></button
>

<style>
    button {
        border-radius: 20px;
        flex-grow: 1;
    }
</style>
