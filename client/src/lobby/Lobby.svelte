<script lang="ts">
    import { fly, scale } from "svelte/transition";
    import { getCode } from "../helpers";
    import socket from "../socket";
    import { code, playing } from "../stores";
    import Button from "./Button.svelte";
    import Name from "./Name.svelte";
    import Qr from "./Qr.svelte";
    import RoomInfo from "./RoomInfo.svelte";
    import Toggle from "./Toggle.svelte";
    import Join from "./Join.svelte";

    let joinDialog: Join;

    function generateCode() {
        let code = "";

        let q = Math.random() < 0.5;
        const letters = ["aeiou", "bcdfghjklmnpqrstvwxyz"];
        for (let i = 0; i < 4; i++) {
            q = !q;
            code +=
                letters[q ? 0 : 1][
                    Math.floor(Math.random() * letters[q ? 0 : 1].length)
                ];
        }
        return code;
    }

    function create() {
        let c = generateCode();
        socket.emit("create", { code: c, playing: $playing }, (created) => {
            if (!created) create();
            else {
                $code = c;
            }
        });
    }

    function join() {
        let c = getCode();
        socket.emit("join", { code: c, playing: $playing }, (joined) => {
            if (joined.success) $code = c;
            else if (joined.full) {
                $playing = false;
                join();
            } else {
                create();
            }
        });
    }

    function leave() {
        $code = null;
        socket.emit("leave");

        create();
    }

    if (!getCode()) create();
    else join();
</script>

<main>
    <Name />
    <Toggle />
    <RoomInfo>
        <Qr />
    </RoomInfo>
    <buttons>
        <Button on:click={leave}><h3>New Room</h3></Button>
        <Button on:click={joinDialog.show}><h3>Join</h3></Button>
    </buttons>
</main>

<Join bind:this={joinDialog} on:failed={create} />

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
</style>
