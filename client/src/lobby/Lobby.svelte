<script lang="ts">
    import Button from "./Button.svelte";
    import Name from "./Name.svelte";
    import RoomInfo from "./RoomInfo.svelte";
    import Toggle from "./Toggle.svelte";
    import { onMount } from "svelte";
    import Join from "./Join.svelte";
    import Create from "./Create.svelte";
    import { lobbyMode } from "../stores";

    let modes: HTMLElement;

    onMount(() => {
        modes.scrollLeft =
            (($lobbyMode == "join" ? 2 : 1) * modes.scrollWidth) / 3;
    });

    let create: Create;
</script>

<main>
    <Name />
    <Toggle />
    <modes bind:this={modes}>
        <RoomInfo>No online yet...</RoomInfo>
        <Create bind:this={create} />
        <Join on:leave={create.create} />
    </modes>
    <buttons>
        <Button><h3>Online</h3></Button>
        <Button><h3>Create</h3></Button>
        <Button><h3>Join</h3></Button>
    </buttons>
</main>

<style>
    main {
        padding: var(--gap);
        height: calc(100svh - 2 * var(--gap));
        width: calc(100svw - 2 * var(--gap));

        gap: var(--gap);

        display: grid;
        grid-template-areas:
            "name . toggle"
            "players players players"
            "buttons buttons buttons";

        grid-template-rows: min-content 1fr min-content;
    }

    buttons {
        grid-area: buttons;
        display: flex;
        justify-content: space-evenly;
        gap: var(--gap);
    }

    modes {
        width: 100%;
        overflow-x: scroll;
        grid-area: players;

        scrollbar-width: none;
        -ms-overflow-style: none;

        display: flex;

        scroll-snap-type: x mandatory;
    }

    modes::-webkit-scrollbar {
        display: none;
    }
</style>
