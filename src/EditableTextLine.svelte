<script>
  import { getContext } from "svelte";
  import { json } from "./stores.js";
  import { EDITOR } from "./JsonEditor.svelte";
  const { handleChange, selected } = getContext(EDITOR);

  export let key;
  export let open = false;

  $: open = $selected === key;

  function getLabel() {
    return key.replace("_", " ");
  }
</script>

<style>
  .truncate {
    width: 100%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  label {
    font-weight: bold;
    text-transform: capitalize;
  }
  input {
    margin: .5rem 0 2rem;
  }
</style>

{#if !open}
  <p class="truncate" on:click={handleChange.bind(null, key)}>
    <label>{getLabel()}</label>
    : {$json[key]}
  </p>
{:else}
  <label for={`input_text_${key}`}>{key}</label>
  <input
    type="text"
    id={`input_text_${key}`}
    name={key}
    bind:value={$json[key]}
    class="" />
{/if}
