<script>
  import "bulma/css/bulma.css";
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
    <div class="container is-widescreen">
      <div class="content">
        <h1>Highly specialized JSON Editor</h1>
      </div>
      <div class="selector columns">
        <div class="column">
          <FamilySelector />
          <SpecieSelector {selectedFamily} />
        </div>
        <div class="column">
          {#if $json.scientific_name}
            <div class="content">
              <h2>{$json.scientific_name}</h2>
            </div>
          {/if}
        </div>
      </div>
    </div>
  </section>
  <section class="section">
    <div class="container is-widescreen">
      <div class="content">
        <JsonEditor />
		<Exporter />
      </div>
    </div>
  </section>
</main>
