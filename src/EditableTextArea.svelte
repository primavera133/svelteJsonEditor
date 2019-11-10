<script>
  import { getContext } from "svelte";
  import { json, openField } from "./stores.js";

  export let key;
  export let open = false;

  $: open = $openField === key;

  function getLabel() {
    return key.replace("_", " ");
  }

  function handleChange(key) {
    $openField = key;
  }
</script>

<style type="text/scss">
  @import "style/custom-mixins";

  .truncate {
    @include truncate();
  }

  .close {
    padding-left: 0;
    margin-bottom: 0;
  }
</style>

{#if !open}
  <button
    class="truncate button-primary-text"
    on:click={() => handleChange(key)}>
    <label>{getLabel()}</label>
    : {$json[key]}
  </button>
{:else}
  <fieldset>
    <button
      class="truncate button-primary-text"
      on:click={() => ($openField = null)}>
      <label for={`input_text_${key}`}>{key}</label>
    </button>
    <textarea id={`input_text_${key}`} name={key} class="" rows={12}>
      {$json[key]}
    </textarea>
    <button
      class="close button-primary-text"
      on:click={() => ($openField = null)}>
      Close
    </button>
  </fieldset>
{/if}
