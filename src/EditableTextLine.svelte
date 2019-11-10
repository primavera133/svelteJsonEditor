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

{#if !open}
  <button class="truncate btn-invisible" on:click={handleChange.bind(null, key)}>
    <label>{getLabel()}</label>
    : {$json[key]}
  </button>
{:else}
  <fieldset>
    <button class="btn-invisible" on:click={() => ($selected = null)}>
    <label for={`input_text_${key}`}>{key}</label>
    </button>
    <input
      type="text"
      id={`input_text_${key}`}
      name={key}
      bind:value={$json[key]}
      class="" />
    <button on:click={() => ($selected = null)}>Close</button>

  </fieldset>
{/if}
