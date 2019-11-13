<script>
  import { json, savedSpecie } from "./stores.js";

  let item = null;
  $: if ($json.items_id || $savedSpecie === $json.items) {
    item = window.localStorage.getItem($json.items_id);
  }

  function handleRecover() {
    const item = window.localStorage.getItem($json.items_id);
    json.set(JSON.parse(item));
  }
</script>

{#if item}
  <button on:click={handleRecover}>Recover</button>
{/if}
