<script>
  export let onClick = () => {};
</script>

<button
  class={`text-blue-900 active:bg-blue-100 p-1 rounded-md border-none focus:outline-none focus-visible:ring-1 ring-blue-600 ${$$props.class}`}
  type="button"
  on:click={onClick}>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    focusable="false"
    aria-hidden="true"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    style="width: 1em; height: 1em">
    <path
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="2"
      d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
  </svg>
  <span class="sr-only">Switch</span>
</button>
