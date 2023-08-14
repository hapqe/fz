<script lang="ts">
    import socket from "../socket";
    import { code, joined, lobbyMode, playing } from "../stores";
    import Leave from "./Leave.svelte";
    import RoomInfo from "./RoomInfo.svelte";

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

    export function create() {
        $lobbyMode = "create";

        socket.on("roomInfo", (i) => info.update(i));

        $code = generateCode();
        socket.emit("create", { code: $code, playing: $playing }, (created) => {
            if (!created) create();
            else {
                $joined = true;
                url = new URL(window.location.href) + "?j=" + $code;
            }
        });
    }

    if ($lobbyMode == "create") create();

    let info: RoomInfo;

    let url = "";

    window.addEventListener("leave", create);
</script>

<RoomInfo bind:this={info}>
    {#if $lobbyMode == "create"}
        <a target="_blank" href={url}>{url}</a>
    {:else}
        You need to leave your current room to create a new one. <Leave />
    {/if}
</RoomInfo>
