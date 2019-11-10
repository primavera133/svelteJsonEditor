<script>
  import { json } from "./stores.js";

  function updateClipboard(newClip) {
    navigator.clipboard.writeText(newClip).then(
      function() {
        alert("JSON was copied to your clipboard");
      },
      function() {
        alert("FAILED");
      }
    );
  }

  const handleClick = function() {
    navigator.permissions.query({ name: "clipboard-write" }).then(result => {
      if (result.state == "granted" || result.state == "prompt") {
        /* write to the clipboard now */
        updateClipboard(JSON.stringify($json));
      }
    });
  };
</script>

<style type="text/scss">


div {
  padding: 2rem 1rem;
}
</style>

{#if $json.scientific_name}
<div>
  <button class="button-success" on:click={handleClick}>Get JSON</button>
</div>
{/if}
