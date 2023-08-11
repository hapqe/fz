<script lang="ts">
    import { bounceIn, bounceOut } from "svelte/easing";
    import { scale } from "svelte/transition";
    import { playing } from "./Toggle.svelte";
    import { getContext, onMount } from "svelte";
    import socket from "../socket";
    import { getCode, roomEvent } from "../helpers";
    import { joined, phase, roomType } from "../stores";
    import { type Context, key } from "./Players.svelte";
    import Leave from "./Leave.svelte";

    let code = "";

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
        return new Promise<{ qr: string; url: string }>((resolve, reject) => {
            code = generateCode();
            socket.emit(
                "create",
                { code, playing: $playing },
                async (created) => {
                    if (!created) {
                        create();
                    } else {
                        $joined = true;

                        const url =
                            new URL(window.location.href) + "?j=" + code;

                        const link = await fetch(
                            `https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${url}`
                        );
                        const qr = await link.blob();
                        resolve({ qr: URL.createObjectURL(qr), url });
                    }
                }
            );
        });
    }

    const { type } = getContext<Context>(key);

    let all = false;
    roomEvent("roomInfo", (info) => {
        all = info.players.every((p) => p);
    });

    function start() {
        $phase = "deck";
    }
</script>

<main>
    {#if type == $roomType}
        {#await create() then { qr, url }}
            <a href={url} target="_blank">
                <img
                    transition:scale={{ easing: bounceOut }}
                    src={qr}
                    alt="QR Code"
                />
            </a>
        {/await}

        <!-- disabled={!all} -->
        <button on:click={start}>Start Game!</button>
    {:else}
        You need to leave your current room to create a new one.
        <Leave />
    {/if}
</main>
