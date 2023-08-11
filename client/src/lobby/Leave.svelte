<script lang="ts">
    import { getContext } from "svelte";
    import { key, type Context } from "./Players.svelte";

    const { leave } = getContext<Context>(key);
</script>

<button on:click={() => leave.invoke()}>Leave</button>
