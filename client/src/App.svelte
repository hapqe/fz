<script lang="ts">
  import socket from "./socket";
  import Lobby from "./lobby/Lobby.svelte";

  socket.on("error", ({ error }) => {
    alert(error);
  });
</script>

<main class="fill">
  <Lobby />
</main>
