<script>
  import { getContext } from "svelte";
  import { json, openField } from "./stores.js";

  export let key;
  export let open = false;

  $: open = $openField === key;

  function getLabel() {
    return key.replace("_", " ");
  }

  function handleDelete(i) {
    $json[key] = $json[key].slice(0, i).concat($json[key].slice(i + 1));
  }

  function handleChange(key) {
    $openField = key;
  }

  function handleAdd() {
    $json[key] = [...$json[key], ""];
  }
</script>

<style type="text/scss">
  @import "style/custom-mixins";
  .truncate {
    @include truncate();
  }

  input {
    margin: 0.5rem 0 0;
  }

  .close {
    padding-left: 0;
    margin-bottom: 0;
  }

  ul {
    list-style: none;
  }

  li {
    display: flex;
  }

  li input {
    flex: 1 1 auto;
  }
  li button {
    margin: 0.5rem 0 0;
    white-space: nowrap;
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
    <ul>
      {#each $json[key] as name, i}
        <li>
          <input
            type="text"
            id={`input_text_${name}`}
            bind:value={name}
            class="" />
          <button
            type="button"
            class="button-primary-text"
            on:click={() => handleDelete(i)}>
            -
          </button>
        </li>
      {/each}
    </ul>
    <button type="button" on:click={handleAdd}>+ Add name</button>
    <button
      class="close button-primary-text"
      on:click={() => ($openField = null)}>
      Close
    </button>
  </fieldset>
{/if}
