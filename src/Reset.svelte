<script>
  import { json } from "./stores.js";
  import { getJson } from "./utils/getJson";

  export let selectedFamily = "";
  export let selectedSpecie = "";

  function handleReset() {
    window.localStorage.removeItem($json.items_id);

    getJson({ family: selectedFamily, species: selectedSpecie }).then(data =>
      json.set(data)
    );
  }
</script>

{#if $json.scientific_name}
  <button on:click={handleReset}>Reset</button>
{/if}
