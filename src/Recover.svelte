<script>
  import { json } from "./stores.js";

  function handleRecover() {
      const item = window.localStorage.getItem($json.items_id)
      json.set(JSON.parse(item))
  }
</script>

{#if $json.items_id}
  <button on:click={handleRecover}>Recover</button>
{/if}
