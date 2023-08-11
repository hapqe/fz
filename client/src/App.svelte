<script lang="ts">
  import Deck from "./deckBuilding/Deck.svelte";
  import socket from "./socket";
  import { phase } from "./stores";
  import Lobby from "./lobby/Lobby.svelte";
  import { blur, fade, scale, slide } from "svelte/transition";

  socket.on("error", ({ error }) => {
    alert(error);
  });
</script>

<main class="fill">
  {#if $phase == "lobby"}
    <div transition:slide={{ axis: "x" }}>
      <Lobby />
    </div>
  {:else if $phase == "deck"}
    <div transition:slide={{ delay: 300, axis: "y" }}>
      <Deck />
    </div>
  {/if}
</main>
