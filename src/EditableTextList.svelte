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

  function handleDelete(i) {
    $json[key] = $json[key].slice(0, i).concat($json[key].slice(i + 1));
  }

  function handleAdd() {
    $json[key] = [...$json[key], ""];
  }
</script>

<style>
  input {
    margin: 0.5rem 0 0;
  }
</style>

{#if !open}
  <button
    class="truncate btn-invisible"
    on:click={handleChange.bind(null, key)}>
    <label>{getLabel()}</label>
    : {$json[key]}
  </button>
{:else}
  <fieldset>
    <button class="btn-invisible" on:click={() => ($selected = null)}>
      <label for={`input_text_${key}`}>{key}</label>
    </button>
    <ul>
      {#each $json[key] as name, i}
        <li>
          <input
            type="text"
            id={`input_text_${name}`}
            bind:value={name}
            class="" />
          <button type="button" on:click={() => handleDelete(i)}>-</button>
        </li>
      {/each}
    </ul>
    <button type="button" on:click={handleAdd}>Add name +</button>
    <button on:click={() => ($selected = null)}>Close</button>
  </fieldset>
{/if}
