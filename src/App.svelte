<script>
  import { onMount, onDestroy, setContext } from "svelte";
  import { getJson } from "./utils/getJson";
  import FamilySelector from "./FamilySelector.svelte";
  import SpecieSelector from "./SpecieSelector.svelte";
  import JsonEditor from "./JsonEditor.svelte";
  import Exporter from "./Exporter.svelte";
  import Save from "./Save.svelte";
  import Recover from "./Recover.svelte";
  import Reset from "./Reset.svelte";
  import { json } from "./stores.js";

  let selectedFamily = "";
  let selectedSpecie = "";
  let scientific_name = "";

  setContext("family", {
    setFamily: value => {
      selectedFamily = value;
      selectedSpecie = "";
      json.set({});
    }
  });
  setContext("specie", {
    setSpecie: value => {
      selectedSpecie = value;
      json.set({});
    }
  });

  $: {
    if (selectedFamily && selectedSpecie) {
      getJson({ family: selectedFamily, species: selectedSpecie }).then(data =>
        json.set(data)
      );
    }
  }
</script>

<style type="text/scss">
  @import "style/mustard-ui/src/scss/vars/colors.scss";

  h1,
  h2 {
    color: $color-gray-800;
    padding: 0 1rem;
  }

  .hero {
    background-color: $color-amber-500;
    padding: 1rem;
  }

  .container {
    padding: 1rem 0 0;
  }
</style>

<main>
  <section class="container">
    <h1 class="h4">Dragonfly API JSON Editor</h1>

    <div class="row hero">
      <div class="col-sm-4">
        <FamilySelector />
        <SpecieSelector {selectedFamily} {selectedSpecie} />
      </div>
      <div class="col-sm-8">
        {#if $json.scientific_name}
          <h2 class="h4">{$json.scientific_name}</h2>
        {/if}
      </div>
    </div>
  </section>
  <section class="container">
    <div class="row">
      <div class="col-sm-12">
        <JsonEditor />

        <div>
          <Exporter />
          <Save />
          <Recover />
          <Reset {selectedFamily} {selectedSpecie} />
        </div>
      </div>
    </div>
  </section>
</main>
