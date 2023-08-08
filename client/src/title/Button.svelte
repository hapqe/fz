<script lang="ts">
    export let area: string = "",
        center: boolean = true;
</script>

<button class={center ? "center" : ""} style="grid-area: {area};"
    ><slot /></button
>

<style>
    button {
        border-radius: 20px;
        flex-grow: 1;
    }
</style>
