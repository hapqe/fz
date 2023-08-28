<script lang="ts">
  import socket from "./socket";
  import Lobby from "./lobby/Lobby.svelte";
  import Game from "./game/Game.svelte";
  import { height, state, width } from "./stores";
  import Bg from "./Bg.svelte";

  socket.on("error", ({ error }) => {
    console.warn(error);
  });
</script>

<svelte:window bind:innerWidth={$width} bind:innerHeight={$height} />

<main class="fill">
  <Bg />
  <Lobby />
  <Game />
</main>
