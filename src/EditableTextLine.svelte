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
  input {
    margin-bottom: 0.5rem;
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
    <input
      type="text"
      id={`input_text_${key}`}
      name={key}
      bind:value={$json[key]}
      class="" />
    <button
      class="close button-primary-text"
      on:click={() => ($openField = null)}>
      Close
    </button>

  </fieldset>
{/if}
