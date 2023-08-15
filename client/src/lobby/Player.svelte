<script lang="ts">
    import { bounceOut } from "svelte/easing";
    import { scale } from "svelte/transition";

    export let index: number, you: boolean, active: boolean;

    const colors = ["red", "green", "blue", "yellow"];
</script>

{#key active}
    <main
        transition:scale={{ easing: bounceOut }}
        class="center"
        style="background-color: {colors[index]}; 
        grid-area: p{index};
        visibility: {active ? 'visible' : 'hidden'};"
    >
        Player {index + 1}
        {#if you}
            (you)
        {/if}
    </main>
{/key}

<style>
    main {
        width: 15svw;
    }
</style>
