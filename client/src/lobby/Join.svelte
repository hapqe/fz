<script lang="ts">
    import { bounceIn, bounceOut } from "svelte/easing";
    import { scale } from "svelte/transition";
    import socket from "../socket";
    import { playing, code } from "../stores";
    import { createEventDispatcher } from "svelte";

    let dialog: HTMLDialogElement;
    let open = false;
    let c = "";

    export function show() {
        dialog.showModal();
        open = true;
    }

    function join() {
        $code = null;
        socket.emit("leave");

        socket.emit("join", { code: c, playing: $playing }, (joined) => {
            if (joined.success) $code = c;
            else if (joined.full) {
                $playing = false;
                join();
            } else {
                dispatch("failed");
            }
        });
        dialog.close();
    }

    const dispatch = createEventDispatcher();
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
<dialog
    on:click={() => dialog.close()}
    bind:this={dialog}
    on:close={() => (open = false)}
>
    {#key open}
        <!-- svelte-ignore a11y-no-static-element-interactions -->
        <div
            on:click|stopPropagation
            in:scale={{ easing: bounceOut }}
            class="fill"
        >
            <input bind:value={c} maxlength="4" type="text" name="" id="" />
            <button disabled={c.length != 4} on:click={join}>Join!</button>
        </div>
    {/key}
</dialog>

<style>
    dialog {
        background: none;
        border: none;
    }
</style>
