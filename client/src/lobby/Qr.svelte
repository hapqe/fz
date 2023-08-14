<script lang="ts">
    import { bounceOut } from "svelte/easing";
    import { scale } from "svelte/transition";
    import socket from "../socket";
    import Leave from "./Leave.svelte";

    let code = "";

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
</script>

<main>
    {#if false}
        {#await create() then { qr, url }}
            <a href={url} target="_blank">
                <img
                    transition:scale={{ easing: bounceOut }}
                    src={qr}
                    alt="QR Code"
                />
            </a>
        {/await}

        <button on:click={() => {}}>Start Game!</button>
    {:else}
        You need to leave your current room to create a new one.
        <Leave />
    {/if}
</main>
