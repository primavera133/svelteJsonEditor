<script>
  import { setContext } from "svelte";
  import EditableTextArea from "./EditableTextArea.svelte";
  import EditableTextLine from "./EditableTextLine.svelte";
  import EditableTextList from "./EditableTextList.svelte";
  import EditableObjectList from "./EditableObjectList.svelte";
  import EditableImgObj from "./EditableImgObj.svelte";
  import { json } from "./stores.js";

  const redListOptions = [
    "",
    "Not Evaluated",
    "Not present",
    "Not Applicable",
    "Data Deficient",
    "Least Concern",
    "Least Concern to Near threatened depending on subspecies",
    "Near threatened",
    "Vulnerable",
    "Endangered",
    "Endangered to Critically Endangered depending on subspecies",
    "Critically endangered",
    "Extinct in the wild",
    "Extinct"
  ];

  const habitasDirectiveOptions = ["", "No", "II", "IV", "II+IV"];
  const endemicOptions = ["", "No", "Endemic"];
  const trendOptions = [
    "",
    "Increasing",
    "Stable",
    "Decreasing",
    "Unknown",
    "Stable to Decreasing depending on subspecie"
  ];
  // const booleanOptions = ["Yes", "No"];

  const redListSelectors = {
    habitats_directive: habitasDirectiveOptions,
    red_list_EU27: redListOptions,
    red_list_europe: redListOptions,
    red_list_mediterranean: redListOptions,
    EU27_endemic: endemicOptions,
    red_list_europe_endemic: endemicOptions,
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
    <EditableTextLine key="author_citation" />
    <EditableTextList key="local_names" />
    <EditableTextArea key="description" />
    <EditableTextArea key="behaviour" />
    <EditableTextArea key="distribution" />
    <EditableTextArea key="habitat" />
    <EditableObjectList key="size" selectors={null} />
    <EditableTextList key="similar_species" />
    <EditableTextLine key="flight_period" />
    <EditableObjectList key="red_list" selectors={redListSelectors} />
    <EditableImgObj key="images" />
    <EditableTextList key="sources" />
  </div>
{/if}
