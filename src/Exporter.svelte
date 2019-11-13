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

{#if $json.items_id}
  <button class="button-success" on:click={handleClick}>Get JSON</button>
{/if}
