<script context="module">
  export const EDITOR = {};
</script>

<script>
  import { setContext } from "svelte";
  import EditableTextArea from "./EditableTextArea.svelte";
  import EditableTextLine from "./EditableTextLine.svelte";
  import EditableTextList from "./EditableTextList.svelte";
  import { json } from "./stores.js";
  import { writable } from "svelte/store";

  const selected = writable(null);

  const handleChange = function(newValue) {
    selected.set(newValue);
  };

  setContext(EDITOR, {
    handleChange,
    selected
  });
</script>

{#if $json.scientific_name}
  <div class="">
    <EditableTextLine key="scientific_name" />
    <EditableTextList key="local_names" />
    <EditableTextArea key="description" />
    <EditableTextArea key="behaviour" />
    <EditableTextArea key="habitat" />
    <!-- <EditableText label={'Size'} text={$json.size} /> -->
    <!-- <EditableTextList label={'Similar species'} text={$json.similar_species} /> -->
    <EditableTextLine key="flight_period" />
    <!-- <EditableText label={'Red list'} text={$json.red_list} /> -->
  </div>
{/if}
