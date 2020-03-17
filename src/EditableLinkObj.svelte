<script>
  import { getContext } from "svelte";
  import { json, openField } from "./stores.js";

  export let key;
  export let open = false;
  let selectedValue = {};

  let linkKeys = ["label", "link"];

  $: open = $openField === key;

  function handleChange() {
    $openField = key;
  }

  function handleSelect(_key) {
    $json[key][_key] = selectedValue[_key];
  }

  function addLink() {
    $json.links = [
      ...$json.links,
      {
        label: "",
        link: ""
      }
    ];
  }
</script>

<style type="text/scss">
  @import "style/custom-mixins";
  input {
    margin: 0.5rem 0 0;
  }

  .truncate {
    @include truncate();
  }
  .close {
    padding-left: 0;
    margin-bottom: 0;
  }

  .indented-list {
    margin-left: 1rem;
  }

  ul {
    list-style: none;
  }
</style>

{#if !open}
  <button class="truncate button-primary-text" on:click={() => handleChange()}>
    <label>links</label>
    : '...'
  </button>
{:else}
  <fieldset>
    <button
      class="truncate button-primary-text"
      on:click={() => ($openField = null)}>
      <label>links</label>
    </button>
    <ul>
      {#each $json.links as link, idx}
        <button class="truncate button-primary-text">
          <label>Link {idx}</label>
        </button>
        <ul class="indented-list">
          {#each linkKeys as _key}
            <li>
              <label for={`link_${_key}_${idx}`}>{_key}</label>
              <input
                type="text"
                id={`link_${_key}_${idx}`}
                name={`link_${_key}_${idx}`}
                bind:value={$json.links[idx][_key]}
                class="" />
            </li>
          {/each}
        </ul>
      {/each}
    </ul>
    <button class="button-primary-text" on:click={() => addLink()}>
      Add link
    </button>
    <button
      class="close button-primary-text"
      on:click={() => ($openField = null)}>
      Close
    </button>
  </fieldset>
{/if}
