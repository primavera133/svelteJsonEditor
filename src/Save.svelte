<script>
  import { json, savedSpecie } from "./stores.js";

  function handleSave() {
      window.localStorage.setItem($json.items_id, JSON.stringify($json))
      savedSpecie.set($json.items_id)
  }
</script>

{#if $json.items_id}
  <button on:click={handleSave}>Save</button>
{/if}
