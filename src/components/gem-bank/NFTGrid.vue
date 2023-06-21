<template>
<div class="backg">
  <div class="nftBox" v-if="title === 'Wallet'">
    <div class="flex flex-wrap">
      <div class="nftTitleBox">
        <h1>Wallet NFTs <b>({{nfts?.length}})</b></h1>
        <button v-if="nfts?.length! > 0 && selectedWalletNFTs > 0" class="big-button" @click="nfts?.length! > 0 ? $emit('stake', 'stakeNotAll') : null">Move ({{ selectedWalletNFTs }})</button>
        <button v-if="nfts?.length! > 0 && selectedWalletNFTs === 0" class="big-button" @click="nfts?.length! > 0 ?  $emit('stake', 'stake') : null">Move All</button>
      </div>
      
      <div class="outerCard">
        <div class="flex gapThis">
          <div v-if="loading" class="loadingAnimation" />
          <div v-else style="display: flex;flex-direction: column; justify-content: center;align-items: center;margin-top: 50px;" v-if="nfts?.length! === 0">
            <h4 class="noneStaked" style="margin: 10px 0 !important">No BWGs in wallet!</h4>
            <a href="https://magiceden.io/marketplace/bwgz"><h4 class="noneStaked" style="margin: 10px 0 !important;cursor: pointer; text-decoration: underline;font-size: 24px;">Click here to get one!</h4></a>
          </div>
          <NFTCard
            v-for="nft in nfts"
            :key="nft"
            :nft="nft"
            :length="calcLength()"
            :state="'Wallet'"
            :isStaked="isStaked"
            :refreshXP="refreshXP"
            @selected="handleSelected"
          />
        </div>
      </div>
    </div>
  </div>

  <div class="nftBox" v-if="title === 'Vault'">

    <div class="flex flex-wrap vaultWrap">
      <div class="nftTitleBox">
        <h1>{{ isStaked === 'staked' ? 'Staked' : 'Unstaked' }} NFTs <b>({{nfts?.length}})</b></h1>
        <div class="flex" style="gap: 10px">
          <button v-if="isStaked === 'staked' && !showRefreshButton" class="big-button" @click="$emit('claim', 'claim')">{{ +((((Date.now() - farmerAcc?.rewardA.fixedRate.lastUpdatedTs*1000)/1000)*(farmerAcc?.rewardA.fixedRate.promisedSchedule.baseRate/86400))* (+farmerAcc?.gemsStaked)).toFixed(4) > 0 ? `Claim ${+((((Date.now() - farmerAcc?.rewardA.fixedRate.lastUpdatedTs*1000)/1000)*(farmerAcc?.rewardA.fixedRate.promisedSchedule.baseRate/86400))* (+farmerAcc?.gemsStaked)).toFixed(4)} $TIME` : 'All claimed!' }} </button>
          <button v-if="isStaked === 'staked' && showRefreshButton" :class="`big-button ${+(+available!/86400).toFixed(4) === 0 ? 'none_available' : null}`" @click="+available! > 0 ? $emit('claim', 'claim') : null">{{(+(+available!/86400).toFixed(4) > 0 ? `Claim ${(+available!/86400).toFixed(4)} $TIME` : 'All claimed!') }} </button>
          <button v-if="isStaked === 'staked'" class="big-button" @click="unstakeAll()">Unstake All</button>
          <button v-if="isStaked === 'pendingCooldown'" class="big-button" @click="$emit('unstake', 'endcooldown')">End Cooldown</button>
          <button v-if="isStaked === 'unstaked' && nfts?.length! > 0 && selectedVaultNFTs === 0" class="big-button" @click="$emit('unstake', 'reclaimAll')">Reclaim All NFT's</button>
          <button v-if="isStaked === 'unstaked' && nfts?.length! > 0 && selectedVaultNFTs > 0" class="big-button" @click="$emit('unstake', 'reclaim')">Reclaim NFT's ({{ selectedVaultNFTs }})</button>
          <button v-if="isStaked === 'unstaked' && nfts?.length! > 0" class="big-button" @click="$emit('stake', 'stakeAgain')">Stake NFT's</button>
          <DisplayRefresh v-if="isStaked === 'staked' && showRefreshButton === true"
            :key="farmerAcc"
            :farm="farm"
            :farmAcc="farmAcc"
            :farmer="farmer"
            :farmerAcc="farmerAcc"
            @refresh-farmer="$emit('refresh-farmer')"
          />
        </div>
      </div>
      <div class="outerCard">
        <div class="flex gapThis">
          <div v-if="loading" class="loadingAnimation" />
          <h4 v-else class="noneStaked" v-if="nfts?.length! === 0">No NFTs NFTS in vault!</h4>
          <NFTCard
            v-for="nft in nfts"
            :key="nft"
            :nft="nft"
            :length="calcLength()"
            :state="'Vault'"
            :isStaked="isStaked"
            :refreshXP="refreshXP"
            @selected="handleSelected"
          />
        </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, onMounted, ref, watch } from 'vue';
import NFTCard from '@/components/gem-bank/NFTCard.vue';
import { async } from '@firebase/util';
import { showRefreshButton } from '@/config'
import {
	getFirestore,
	collection,
	getDocs,
	setDoc,
	doc,
	updateDoc,
	getDoc,
	deleteDoc,
	query,
    addDoc
} from "firebase/firestore";
import DisplayRefresh from '../gem-farm/DisplayRefresh.vue';
export default defineComponent({
  components: { NFTCard, DisplayRefresh },
  emits: ['selected', 'unstake', 'stake', 'claim', 'refresh-farmer'],
  props: {
    title: String,
    nfts: Array,
    isStaked: String,
    loading: Boolean,
    available: String,
    farm: String,
    farmAcc: Object,
    farmer: String,
    farmerAcc: Object,
  },
  watch: {
    nfts: function test(oldVal, newVal) {
      this.selectedVaultNFTs = 0
      this.selectedWalletNFTs = 0
    }
  },
  setup(props, ctx) {
    const selectedWalletNFTs = ref<Number>(0)
    const selectedVaultNFTs = ref<Number>(0)
    const handleSelected = (e: any) => {
      ctx.emit('selected', e);
      console.log(e)
      if (e.location === 'wallet') {
        if (e.selected === false) {
          selectedWalletNFTs.value = +selectedWalletNFTs.value - 1
        } else {
          selectedWalletNFTs.value = +selectedWalletNFTs.value + 1
        }
      } else {
          if (e.selected === false) {
            selectedVaultNFTs.value = +selectedVaultNFTs.value - 1
          } else {
            selectedVaultNFTs.value = +selectedVaultNFTs.value + 1
          }
      }
    };
    console.log(props.isStaked)
    selectedVaultNFTs.value = 0
    selectedWalletNFTs.value = 0
    const calcLength = () => {
      let i=0
      if (props) {
        if (props.nfts) {
          props.nfts.forEach((nft: any) => {
            if (nft?.externalMetadata.symbol !== 'MMT') {
              i++
            }
          })
        }
      }
      return i
    }
    console.log("Amount to claim: " + +((((Date.now() - props.farmerAcc?.rewardA.fixedRate.lastUpdatedTs*1000)/1000)*(props.farmerAcc?.rewardA.fixedRate.promisedSchedule.baseRate/86400))* (+props.farmerAcc?.gemsStaked)).toFixed(4))
    const refreshXP = ref<boolean>(false)
    
    const unstakeAll = async() => {
      ctx.emit('unstake', 'unstake')
    }
    return {
      handleSelected,
      calcLength,
      selectedWalletNFTs,
      selectedVaultNFTs,
      refreshXP,
      unstakeAll,
      showRefreshButton
    };
  },
});
</script>
<style scoped></style>