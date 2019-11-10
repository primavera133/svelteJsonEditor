<script>
  import { getContext } from "svelte";
  import { json } from "./stores.js";
  import { EDITOR } from "./JsonEditor.svelte";
  const { handleChange, selected } = getContext(EDITOR);

  export let key;
  export let open = false;
  export let selectors;
  let selectedValue = {};

  $: open = $selected === key;

  function getLabel() {
    return key.replace("_", " ");
  }

  function getTruncatedValue() {
    return JSON.stringify($json[key]).replace(/[{}"]/g, "");
  }

  function handleSelect(_key) {
    $json[key][_key] = selectedValue[_key];
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
    : {getTruncatedValue()}
  </button>
{:else}
  <fieldset>
    <button class="btn-invisible" on:click={() => ($selected = null)}>
      <label>{key}</label>
    </button>
    <ul>
      {#each Object.keys($json[key]) as _key, i}
        <li>
          <label for={`input_text_${_key}`}>{_key}</label>
          {#if selectors}
            <select
              bind:value={selectedValue[_key]}
              on:change={() => handleSelect(_key)}>
              {#each selectors[_key] as selectable}
                <option
                  selected={selectable === $json[key][_key]}
                  value={selectable}>
                  {selectable}
                </option>
              {/each}
            </select>
          {:else}
            <input
              type="text"
              id={`input_text_${_key}`}
              bind:value={$json[key][_key]}
              class="" />
          {/if}
        </li>
      {/each}
    </ul>
    <button on:click={() => ($selected = null)}>Close</button>
  </fieldset>
{/if}
