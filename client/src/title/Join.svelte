<script lang="ts">
    import { getCode } from "../helpers";

    let code = getCode();
</script>

<input bind:value={code} maxlength="4" type="text" name="" id="" />
<button>join</button>
