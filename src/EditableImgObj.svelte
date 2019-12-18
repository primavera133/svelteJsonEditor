<script>
  import { getContext } from "svelte";
  import { json, openField } from "./stores.js";

  export let key;
  export let open = false;
  let selectedValue = {};

  let imgKeys = ["public_id", "caption", "license", "lic_url", "by", "url"];

  $: open = $openField === key;

  function handleChange() {
    $openField = key;
  }

  function handleSelect(_key) {
    $json[key][_key] = selectedValue[_key];
  }

  function addImage() {
    $json.images.all = [
      ...$json.images.all,
      {
        public_id: "",
        caption: "",
        license: "CC BY 3.0",
        lic_url: "https://creativecommons.org/licenses/by/3.0/",
        by: "Göran Liljeberg",
        url: "http://liljebergs.nu/"
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
    <label>images</label>
    : '...'
  </button>
{:else}
  <fieldset>
    <button
      class="truncate button-primary-text"
      on:click={() => ($openField = null)}>
      <label>images</label>
    </button>
    <ul>
      <li>
        <label for={`input_text_pid_cloud_name`}>cloud_name</label>
        <input
          type="text"
          id={`input_text_pid_cloud_name`}
          name="pId_cloud_name"
          bind:value={$json.images.cloud_name}
          class="" />
      </li>

      {#each $json.images.all as image, idx}
        <button class="truncate button-primary-text">
          <label>Image {idx}</label>
        </button>
        <ul class="indented-list">
          {#each imgKeys as _key}
            <li>
              <label for={`img_${_key}_${idx}`}>{_key}</label>
              <input
                type="text"
                id={`img_${_key}_${idx}`}
                name={`img_${_key}_${idx}`}
                bind:value={$json.images.all[idx][_key]}
                class="" />
            </li>
          {/each}
        </ul>
      {/each}
    </ul>
    <button class="button-primary-text" on:click={() => addImage()}>
      Add image
    </button>
    <button
      class="close button-primary-text"
      on:click={() => ($openField = null)}>
      Close
    </button>
  </fieldset>
{/if}
