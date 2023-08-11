<script lang="ts">
    import { getContext } from "svelte";
    import { getCode, roomMode } from "../helpers";
    import socket from "../socket";
    import { joined, roomType } from "../stores";
    import { key, type Context } from "./Players.svelte";
    import { playing } from "./Toggle.svelte";
    import Leave from "./Leave.svelte";

    let code = getCode();

    roomMode(() => {
        socket.emit("join", { code, playing: $playing }, (joined) => {
            if (joined) {
                $roomType = "join";
                $joined = true;
            }
        });
    });

    const { type } = getContext<Context>(key);
</script>

{#if type == $roomType}
    <h1>#{getCode()}</h1>
    <Leave />
{:else}
    <input bind:value={code} maxlength="4" type="text" name="" id="" />
    <button>{$playing ? "Fight!" : "Spectate"}</button>
{/if}
