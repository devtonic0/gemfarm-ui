<template>
    <div
      class="card flex justify-center"
      :class="{ 'card-selected': selected }"
      @click="toggleSelect1"
      v-if="state === 'Vault'"
    >
      <img
        :src="nft.externalMetadata.image"
        :alt="nft.onchainMetadata.data.name"
      />
      <div class="statOuter">
        <button>In Vault</button>
      </div>
    </div>
    <div
      class="card flex justify-center"
      :class="{ 'card-selected': selected }"
      @click="toggleSelect2"
      v-if="state === 'Wallet'"
    >
      <img
        :src="nft.externalMetadata.image"
        :alt="nft.onchainMetadata.data.name"
      />
      <div class="statOuter">
        <button @click="$emit('selected')">Stake</button>
      </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, watch } from 'vue';

export default defineComponent({
  props: {
    nft: { type: Object, required: true },
    length: Number,
    state: String,
    isStaked: String,
    refreshXP: Boolean
  },
  watch: {
    refreshXP: function test(oldVal, newVal) {
      this.refresh = !this.refresh
    }
  },
  emits: ['selected'],
  setup(props, ctx) {
    const selected = ref<boolean>(false);
    const refresh = ref<boolean>(false);
    const nftInfo = ref<any>()
    const nftLevel = ref<Number>(0)
    const nftRarity = ref<Number>(8888)

    const toggleSelect1 = () => {
      if (props.isStaked !== 'staked') {
        selected.value = !selected.value;
        console.log('selected', props.nft.mint.toBase58());
        ctx.emit('selected', {
          nft: props.nft,
          selected: selected.value,
          location: 'vault'
        });
      }
    };

    const toggleSelect2 = () => {
        selected.value = !selected.value;
        console.log('selected', props.nft.mint.toBase58());
        ctx.emit('selected', {
          nft: props.nft,
          selected: selected.value,
          location: 'wallet'
        });
    };

    function time_convert(stakeStart: any) {
      let curTime = new Date().getTime()/1000
      console.log(stakeStart, curTime)
      let timeStaked = (curTime - Number(stakeStart))/60

      console.log("time staked: " + timeStaked)
      
      var hours = Math.floor(timeStaked / 60);
      var minutes = Math.floor(timeStaked % 60);
      var days = Math.floor(hours/24);

      if (days >= 1) {
        hours = hours - (days * 24)
        return days + (days === 1 ? " day " : " days ") + hours + " hrs "
      } else {
        return hours + " hrs " + minutes + " mins"
      }
    }

    return {
      selected,
      toggleSelect1,
      toggleSelect2,
      nftInfo,
      time_convert,
      refresh,
      nftLevel,
      nftRarity,
    };
  },
});
</script>
<!--
<style scoped>
img {
  max-width: 100%;
  max-height: 100%;
  height: auto;
  width: auto;
}

.card {
  width: 150px;
  height: 150px;
}

.card:hover {
  @apply border-4 border-solid border-gray-200;
}

.card-selected {
  @apply border-4 border-solid;
  border-color: #000;
}
</style>
-->