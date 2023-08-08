<script lang="ts">
    export let index: number;

    const colors = ["red", "green", "blue", "yellow"];
</script>

<main style="background-color: {colors[index]}; grid-area: p{index}">hi</main>

<style>
    main {
        width: 15svw;
    }
</style>
