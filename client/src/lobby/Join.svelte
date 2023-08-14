<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import socket from "../socket";
    import { code, joined, lobbyMode, playing } from "../stores";
    import RoomInfo from "./RoomInfo.svelte";
    import Leave from "./Leave.svelte";

    function join() {
        socket.on("roomInfo", update);

        socket.emit("join", { code: $code, playing: $playing }, (joined) => {
            $joined = joined;
        });
    }

    function update(i: any) {
        info.update(i);
    }

    if ($lobbyMode == "join") join();

    let info: RoomInfo;

    window.addEventListener("leave", () => socket.off("roomInfo", update));
</script>

<RoomInfo bind:this={info}>
    {#if $lobbyMode == "join"}
        <h1>#{$code}</h1>
        <Leave />
    {:else}
        <input bind:value={$code} maxlength="4" type="text" name="" id="" />
        <!-- <button>{$playing ? "Fight!" : "Spectate"}</button> -->
    {/if}
</RoomInfo>
