<script lang="ts">
    import { Game } from "../../../game/game";
    import { game, height, state, width } from "../stores";

    async function ready() {
        const initVisuals = (await import(".././visuals/renderer")).default;
        initVisuals();
    }

    $: if ($state == "ready") {
        ready();
    }
    $: if ($state == "game") {
        $game = new Game();
    }
</script>

<main class="fill center">
    <canvas width={$width} height={$height} class="fill" />
</main>

<style>
    main {
        background: url("board.png") center no-repeat;
        background-size: contain;
    }
</style>
