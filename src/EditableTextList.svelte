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
    margin: 0.5rem 0 0;
  }
  ul {
    list-style: none;
    margin: 0;
  }
  li {
    padding: 0;
  }
  fieldset {
      margin: 0 0 2rem;
      padding: 0;
      border: none;
  }
</style>

{#if !open}
  <p class="truncate" on:click={handleChange.bind(null, key)}>
    <label>{getLabel()}</label>
    : {$json[key]}
  </p>
{:else}
  <fieldset>
    <label for={`input_text_${key}`}>{key}</label>
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
  </fieldset>
{/if}
