<template>
</template>
<script lang="ts">
import { onMounted, defineComponent, ref, watch } from 'vue';
import FixedScheduleDisplay from '@/components/gem-farm/FixedScheduleDisplay.vue';
import { parseDate } from '@/common/util';
import numeral from 'numeral';
import { initGemBank } from '@/common/gem-bank';
import useCluster from '@/composables/cluster';
import useWallet from '@/composables/wallet';
import {
  getNFTMetadataForMany,
  getNFTsByOwner,
  INFT,
} from '@/common/web3/NFTget';
import { PublicKey } from '@solana/web3.js';
import { initGemFarm } from '@/common/gem-farm';
import { findFarmerPDA, stringifyPKsAndBNs } from '@gemworks/gem-farm-ts';

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


export default defineComponent({
  components: { FixedScheduleDisplay },
  props: {
    reward: Object,
    farmReward: Object,
    title: String,
    status: String,
    staked: Number,
    period: Number,
    vault: String
  },
  setup(props) {
 

    return {
      parseDate,
      numeral,
    };
  },
});
</script>
<style scoped></style>
