<script lang="ts">
    import { bounceIn, bounceOut } from "svelte/easing";
    import { scale } from "svelte/transition";
    import { playing } from "./Toggle.svelte";
    import { key, type Context } from "./Players.svelte";
    import { getContext } from "svelte";
    import { io } from "socket.io-client";

    const { onConnect } = getContext<Context>(key);

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
            onConnect
                .invoke(io())
                .emit("create", { code, playing: $playing }, async (r) => {
                    if (r?.error) {
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
                });
        });
    }
</script>

<main>
    {#await create() then { qr, url }}
        <a href={url} target="_blank">
            <img
                transition:scale={{ easing: bounceOut }}
                src={qr}
                alt="QR Code"
            />
        </a>
    {/await}
</main>
