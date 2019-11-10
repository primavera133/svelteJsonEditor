<script>
  import config from "./config";
  import { getContext } from "svelte";

  const families = Object.keys(config.dataTree);

  let selected;

  const { setFamily } = getContext("family");

  function handleChange() {
    setFamily(selected);
  }
</script>

<style>
</style>

<div class="select">
  <select
    id="family"
    bind:value={selected}
    on:change={handleChange}>
    <option>Välj en familj</option>
    {#each families as family}
      <option value={family}>{family}</option>
    {/each}
  </select>
</div>
