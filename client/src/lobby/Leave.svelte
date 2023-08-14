<script>
    const event = new CustomEvent("leave");
</script>

<button on:click={() => window.dispatchEvent(event)}>Leave</button>
