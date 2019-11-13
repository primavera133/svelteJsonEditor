<script>
  import { setContext } from "svelte";
  import EditableTextArea from "./EditableTextArea.svelte";
  import EditableTextLine from "./EditableTextLine.svelte";
  import EditableTextList from "./EditableTextList.svelte";
  import EditableObjectList from "./EditableObjectList.svelte";
  import { json } from "./stores.js";

  const redListOptions = [
    "Not evaluated",
    "Data deficient",
    "Least Concern",
    "Near threatened",
    "Vulnerable",
    "Endangered",
    "Critically endangered",
    "Extinct in the wild",
    "Extinct"
  ];

  const trendOptions = ["Increasing", "Stable", "Decreasing"];

  const booleanOptions = ["Yes", "No"];

  const redListSelectors = {
    habitats_directive: ["No", "IV"],
    red_list_EU27: redListOptions,
    red_list_europe: redListOptions,
    red_list_mediterranean: redListOptions,
    EU27_endemic: booleanOptions,
    red_list_europe_endemic: booleanOptions,
    trend_europe: trendOptions
  };
</script>

<style type="text/scss">

.editors {
  padding: 0 1rem;
}
</style>

{#if $json.scientific_name}
  <div class="editors">
    <EditableTextLine key="scientific_name" />
    <EditableTextList key="local_names" />
    <EditableTextArea key="description" />
    <EditableTextArea key="behaviour" />
    <EditableTextArea key="distribution" />
    <EditableTextArea key="habitat" />
    <EditableObjectList key="size" selectors={null} />
    <EditableTextList key="similar_species" />
    <EditableTextLine key="flight_period" />
    <EditableObjectList key="red_list" selectors={redListSelectors} />
  </div>
{/if}
