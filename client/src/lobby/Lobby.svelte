<script lang="ts">
    import Button from "./Button.svelte";
    import Name from "./Name.svelte";
    import Players from "./Players.svelte";
    import Spectators from "./Spectators.svelte";
    import Toggle from "./Toggle.svelte";
    import { onMount } from "svelte";
    import Qr from "./Qr.svelte";
    import { getCode } from "../helpers";
    import Join from "./Join.svelte";

    let players: HTMLElement;

    onMount(() => {
        const join = getCode() != null;

        players.scrollLeft = ((join ? 2 : 1) * players.scrollWidth) / 3;
    });
</script>

<main>
    <Name />
    <Toggle />
    <players bind:this={players}>
        <Players type="online">No online yet...</Players>
        <Players type="create"><Qr /></Players>
        <Players type="join"><Join /></Players>
    </players>
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

    players {
        width: 100%;
        overflow-x: scroll;
        grid-area: players;

        scrollbar-width: none;
        -ms-overflow-style: none;

        display: flex;

        scroll-snap-type: x mandatory;
    }

    players::-webkit-scrollbar {
        display: none;
    }
</style>
