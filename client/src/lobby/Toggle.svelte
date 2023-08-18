<script lang="ts">
  import { writable } from "svelte/store";
  import { code, playing } from "../stores";
  import socket from "../socket";

  let full = false;
  socket.on("roomInfo", (info) => {
    full = info.players.every((p) => p);
  });

  playing.subscribe((value) => {
    localStorage.setItem("playing", String(value));

    if ($code) {
      if (full && $playing) {
        $playing = false;
        alert("Room is full");
      }
      socket.emit("role", { playing: $playing });
    }
  });
</script>

<main class="end">
  spectate
  <input bind:checked={$playing} type="checkbox" id="toggle" />
  fight
</main>

<style>
  main {
    grid-area: toggle;
  }
</style>
