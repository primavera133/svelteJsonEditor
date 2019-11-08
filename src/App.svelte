<script>
  import { onMount, onDestroy, setContext } from "svelte";
  import { getJson } from "./utils/getJson";
  import FamilySelector from "./FamilySelector.svelte";
  import SpecieSelector from "./SpecieSelector.svelte";
  import JsonEditor from "./JsonEditor.svelte";
  import Exporter from "./Exporter.svelte";
  import { json } from "./stores.js";

  let selectedFamily = "";
  let selectedSpecie = "";
  let scientific_name = "";

  setContext("family", {
    setFamily: value => (selectedFamily = value)
  });
  setContext("specie", {
    setSpecie: value => (selectedSpecie = value)
  });

  $: {
    if (selectedFamily && selectedSpecie) {
      getJson({ family: selectedFamily, species: selectedSpecie }).then(data => json.set(data));
    }
  }
</script>

<style>
  h1 {
    color: #e67e22;
  }
  .selector {
    background: #e67e22;
    /* display: flex;
    flex-flow: row;
    align-items: top;
    justify-content: space-around; */
    padding: 1rem;
  }
</style>

<main>
  <section class="section">
    <div class="">
      <div class="">
        <h1>Highly specialized JSON Editor</h1>
      </div>
      <div class="selector">
        <div class="">
          <FamilySelector />
          <SpecieSelector {selectedFamily} />
        </div>
        <div class="">
          {#if $json.scientific_name}
            <div class="">
              <h2>{$json.scientific_name}</h2>
            </div>
          {/if}
        </div>
      </div>
    </div>
  </section>
  <section class="">
    <div class="">
      <div class="">
        <JsonEditor />
		<Exporter />
      </div>
    </div>
  </section>
</main>
