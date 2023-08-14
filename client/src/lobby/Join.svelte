<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import socket from "../socket";
    import { code, joined, lobbyMode, playing } from "../stores";
    import RoomInfo from "./RoomInfo.svelte";

    function join() {
        socket.on("roomInfo", (i) => info.update(i));

        socket.emit("join", { code: $code, playing: $playing }, (joined) => {
            $joined = joined;
        });
    }

    if ($lobbyMode == "join") join();

    let info: RoomInfo;

    const dispatch = createEventDispatcher();
</script>

<RoomInfo bind:this={info}>
    {#if $lobbyMode == "join"}
        <h1>#{$code}</h1>
        <button on:click={() => dispatch("leave")}>Leave</button>
    {:else}
        <input bind:value={$code} maxlength="4" type="text" name="" id="" />
        <!-- <button>{$playing ? "Fight!" : "Spectate"}</button> -->
    {/if}
</RoomInfo>
