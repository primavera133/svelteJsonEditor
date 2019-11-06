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
  }
</style>

{#if !open}
  <p class="truncate" on:click={handleChange.bind(null, key)}>
    <label>{getLabel()}</label>
    : {$json[key]}
  </p>
{:else}
  <div class="box">
    <article class="media">
      <div class="media-content">
        <label for={`input_text_${key}`}>{key}</label>
        <textarea id={`input_text_${key}`} name={key} class="textarea" rows={12}>{$json[key]}</textarea>
      </div>
    </article>
  </div>
{/if}
