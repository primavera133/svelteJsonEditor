<script>
  import { json } from "./stores.js";

  function handleSave() {
      window.localStorage.setItem($json.items_id, JSON.stringify($json))
  }
</script>

{#if $json.items_id}
  <button on:click={handleSave}>Save</button>
{/if}
