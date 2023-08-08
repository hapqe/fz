<script lang="ts">
    import { bounceOut } from "svelte/easing";
    import { scale } from "svelte/transition";

    let spectators = 0;
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
