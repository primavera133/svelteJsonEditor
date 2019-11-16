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
  import { json, savedSpecie } from "./stores.js";

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

  onMount(() => {
    const S_KEY_CODE = 83;
    document.addEventListener(
      "keydown",
      function(e) {
        if (
          (window.navigator.platform.match("Mac") ? e.metaKey : e.ctrlKey) &&
          e.keyCode == S_KEY_CODE
        ) {
          e.preventDefault();
          if ($json.items_id) {
            window.localStorage.setItem($json.items_id, JSON.stringify($json));
            savedSpecie.set($json.items_id);
          }
        }
      },
      false
    );
  });

  $: {
    getJson({ family: selectedFamily, species: selectedSpecie }).then(data =>
      json.set(data)
    );
    // .catch(e => {
    //   // console.log(e);
    // });
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

  .heading {
    display: flex;
    flex-flow: row;
    align-items: center;
  }

  .heading img {
    max-width: 48px;
  }
</style>

<main>
  <section class="container">
    <div class="heading">
      <img src="/libellula-bw.png" alt="libellula" />
      <h1 class="h4">Dragonfly API JSON Editor</h1>
    </div>

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
