<script lang="ts">
    import { bounceOut } from "svelte/easing";
    import { scale } from "svelte/transition";
    import { code } from "../stores";

    async function create() {
        const url = new URL(window.location.origin) + "?r=" + $code;
        const link = await fetch(
            `https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${url}`
        );
        const blob = await link.blob();
        const qr = URL.createObjectURL(blob);
        window.history.replaceState(null, "", url.toString());

        return { qr, url };
    }
</script>

<main>
    {#if $code}
        {#await create() then { qr, url }}
            <a href={url} target="_blank">
                <div transition:scale={{ easing: bounceOut }} class="center">
                    <h1>#{$code}</h1>
                    <img src={qr} alt="QR Code" />
                </div>
            </a>
        {/await}
    {/if}
</main>

<style>
    * {
        text-decoration: none;
    }
</style>
