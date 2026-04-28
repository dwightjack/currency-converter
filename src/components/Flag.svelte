<script lang="ts">
  interface Props {
    currency: string;
    class?: string;
  }
  const { currency, class: className = '' }: Props = $props();

  const currencyFlag = $derived(
    `url(/flags.svg#code-${currency.toLowerCase()})`,
  );
</script>

<span
  class={[
    'bg-[image:var(--flag)] bg-surface-200 bg-contain bg-no-repeat rounded-xs shrink-0 grow-0 inline-6 aspect-ratio-[4/3] inline-block @dark:bg-surface-500',
    className,
  ]}
  style:--flag={currencyFlag}
></span>
