<script>
  import config from "./config";
  import { getContext } from "svelte";

  export let selectedFamily;
  let selected;

  let species = [];
  $: {
    if (selectedFamily) {
      species = config.dataTree[selectedFamily];
    }
  }

  const { setSpecie } = getContext("specie");

  function handleChange() {
    setSpecie(selected);
  }
</script>

<style>
  @media only screen and (max-width: 960px) {
    .select-specie {
      margin-top: 0.5rem;
    }
  }
</style>

{#if selectedFamily}
  <div class="select select-specie">
    <select
      id="species"
      value={selected}
      bind:value={selected}
      on:change={handleChange}>
      <option>Välj en art inom {selectedFamily}</option>
      {#each species as specie}
        <option value={specie}>{specie}</option>
      {/each}
    </select>
  </div>
{/if}
