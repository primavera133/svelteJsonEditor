<script>
  import { json, savedSpecie } from "./stores.js";
  import { getJson } from "./utils/getJson";

  export let selectedFamily = "";
  export let selectedSpecie = "";

  let item = null;
  $: if ($json.items_id || $savedSpecie === $json.items) {
    item = window.localStorage.getItem($json.items_id);
  }

  function handleReset() {
    window.localStorage.removeItem($json.items_id);

    getJson({ family: selectedFamily, species: selectedSpecie }).then(data =>
      json.set(data)
    );
  }
</script>

{#if item}
  <button on:click={handleReset}>Reset</button>
{/if}
