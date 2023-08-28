<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import socket from "../socket";
  import Player from "./Player.svelte";
  import Spectators from "./Spectators.svelte";
  import { state } from "../stores";

  let players = [false, false, false, false];
  let you = -1;
  let ready = false;
  let time = 0;

  socket.on("roomInfo", (info) => {
    players = info.players;
    you = info.you;
    spectators.update(info);

    if (info.start) {
      if (!ready) {
        time = (info.start - Date.now()) / 1000;
        ready = true;

        const interval = setInterval(() => {
          time--;
          if (time <= 0) {
            clearInterval(interval);
            time = 0;
          }
        }, 1000);

        $state = "ready";

        setTimeout(() => {
          $state = "game";
        }, info.start - Date.now());
      }
    }
  });

  let spectators: Spectators;

  const dispatch = createEventDispatcher();
</script>

<main>
  {#each [...Array(4).keys()] as index}
    <Player active={players[index]} {index} you={index == you} />
  {/each}

  <div class="center">
    <slot />
    {#if ready}
      <h5>Starting in {time}s</h5>
    {:else}
      <h5>Waiting for players...</h5>
    {/if}
  </div>

  <Spectators bind:this={spectators} />
</main>

<style>
  main {
    grid-area: players;
    display: grid;
    grid-template-areas:
      "p0 qr p1"
      "p2 qr p3"
      "spectators spectators spectators";

    grid-template-columns: min-content 1fr min-content;
    grid-template-rows: 1fr 1fr min-content;

    flex: 0 0 100%;
    scroll-snap-align: center;
  }

  div {
    grid-area: qr;
  }
</style>
