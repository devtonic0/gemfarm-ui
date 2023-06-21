<template>
  <div class="mainHomeWrapper">
    <div class="farmScreen">
      <div v-if="farmerAcc">
      <!--
        <FarmerDisplay
          :key="farmerAcc"
          :farm="farm"
          :farmAcc="farmAcc"
          :farmer="farmer"
          :farmerAcc="farmerAcc"
          :vault="farmerAcc.vault.toBase58()"
          @refresh-farmer="handleRefreshFarmer"
        />
      -->
        <Vault
          :key="farmerAcc"
          class="mb-10"
          :vault="farmerAcc.vault.toBase58()"
          :reward="farmerAcc.rewardA"
          @selected-wallet-nft="handleNewSelectedNFT"
        >
        </Vault>
      </div>
      <div class="neverStaked" v-else>
        <template v-if="!wallet?.publicKey?.toBase58()">
          <div class="stats">
            <h1>Back We Go Staking</h1>
            <div class="flex">
              <div>
                <h2>Total Staked</h2>
                <h3>{{ farmAcc.gemsStaked }}<b>/{{hashlist.length}}</b></h3>
              </div>
              <div>
                <h2>Min. Value Locked</h2>
                <h3>${{ (+floorPrice * +solPrice * farmAcc.gemsStaked).toFixed(0) }}</h3>
              </div>
            </div>
            <ConfigPane />
          </div>
        </template>
        <template v-else>
          <div class="chooseScreenOptions">
            <button @click="showScreen = 'Wallet'" :style="showScreen === 'Wallet' ? {background: '#2c1937ec',color: '#ffffff'} : {background: '#2c1937ec',color: '#ffffff'}">Wallet (0)</button>
            <button @click="showScreen = 'Vault'" :style="showScreen !== 'Wallet' ? {background: '#2c1937ec',color: '#ffffff'} : {background: '#2c1937ec',color: '#ffffff'}">Vault (0)</button>
          </div>
          <div class="flex items-stretch stakeSection">
              <!--left-->
              <template v-if="showScreen === 'Wallet'">
              <div class="backg">
              <div class="nftBox">
                <div class="flex flex-wrap">
                  <div class="nftTitleBox">
                    <h1>Wallet NFTs<b>(0)</b></h1>
                  </div>
                  <div class="outerCard">
                    <div class="flex gapThis" style="margin-top: 50px;">
                        <div v-if="loading" class="loadingAnimation" />
                        <template v-else>
                          <h4 style="font-style: italic;opacity: 0.5; color: #f1f1f1;text-align: center;">
                            Looks like you've never staked with us before! Click the button below to verify your account with the smart contract and begin staking (roughly 0.018 SOL).
                          </h4>
                          <button class="big-button" @click="initFarmer">
                            Verify
                          </button>
                        </template>
                    </div>
                  </div>
                  </div>
                </div>
              </div>
              </template>

              <template v-if="showScreen === 'Vault'">
              <div class="backg">
                <div class="nftBox">
                  <div class="flex flex-wrap">
                    <div class="nftTitleBox">
                      <h1>Unstaked NFTs <b>(0)</b></h1>
                    </div>
                    <div class="outerCard">
                      <div class="flex gapThis" style="margin-top: 50px;">
                          <div v-if="loading" class="loadingAnimation" />
                          <template v-else>
                            <h4 style="font-style: italic;opacity: 0.5; color: #f1f1f1;text-align: center;">
                              Looks like you've never staked with us before! Click the button below to verify your account with the smart contract and begin staking (roughly 0.018 SOL).
                            </h4>
                            <button class="big-button" @click="initFarmer">
                              Verify
                            </button>
                          </template>
                      </div>
                      </div>
                    </div>
                  </div>
                </div>
              </template>

          </div>
        </template>
      </div>
    </div>
    <Alert 
      v-if="showAlert === true"
      :message="'Must stake with a Ra/Anubis'"
      :type="'error'"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, nextTick, onMounted, ref, watch } from 'vue';
import useWallet from '@/composables/wallet';
import useCluster from '@/composables/cluster';
import { initGemFarm } from '@/common/gem-farm';
import { PublicKey } from '@solana/web3.js';
import FarmerDisplay from '@/components/gem-farm/FarmerDisplay.vue';
import InfoDisplay from '@/components/gem-farm/InfoDisplay.vue';
import Vault from '@/components/gem-bank/Vault.vue';
import { findFarmerPDA, stringifyPKsAndBNs } from '@gemworks/gem-farm-ts';
import { farmAddress } from '@/config';
import DisplayRefresh from '@/components/gem-farm/DisplayRefresh.vue';
import { parseDate, timeAgo } from '@/common/util';
import {
  getNFTMetadataForMany,
  getNFTsByOwner,
  INFT,
} from '@/common/web3/NFTget';
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
import { initGemBank } from '@/common/gem-bank';
import Alert from '../components/Alert.vue'
import NFTGrid from '../components/gem-bank/NFTGrid.vue'
import { useRouter } from 'vue-router';
import ConfigPane from '@/components/ConfigPane.vue';
const hashlist = require("../hashlist.json")

export default defineComponent({
  components: { Vault, FarmerDisplay, ConfigPane, DisplayRefresh, Alert, NFTGrid },
  setup() {
    const { wallet, getWallet } = useWallet();
    const { cluster, getConnection } = useCluster();

    let gf: any;
    watch([wallet, cluster], async () => {
      farmerAcc.value = null

      await freshStart();
      gb = await initGemBank(getConnection(), getWallet()!);

      //populate wallet + vault nfts
      await Promise.all([populateVaultNFTs(), populateWalletNFTs()]);
    });

    //needed in case we switch in from another window
    onMounted(async () => {
      getInfo()
      await freshStart();
      gb = await initGemBank(getConnection(), getWallet()!);

      //populate wallet + vault nfts
      await Promise.all([populateVaultNFTs()]);
    });

    // --------------------------------------- farmer details
    const farm = ref<string>(farmAddress);
    const farmAcc = ref<any>();

    const farmerIdentity = ref<string>();
    const farmerAcc = ref<any>();
    const farmerState = ref<string>();

    const availableA = ref<string>();
    const availableB = ref<string>();

    const toSendToDB = ref<number>();
    const loading = ref<boolean>(true);
    const showAlert = ref<boolean>(false);

    const floorPrice = ref<Number>(0)
    const solPrice = ref<Number>(0)

    const showScreen = ref<string>('Wallet')


    //auto loading for when farm changes
    watch(farm, async () => {
      await freshStart();
      gb = await initGemBank(getConnection(), getWallet()!);

      //populate wallet + vault nfts
      await Promise.all([populateVaultNFTs()]);
    });

    const updateAvailableRewards = async () => {
      availableA.value = farmerAcc.value.rewardA.accruedReward
        .sub(farmerAcc.value.rewardA.paidOutReward)
        .toString();
      availableB.value = farmerAcc.value.rewardB.accruedReward
        .sub(farmerAcc.value.rewardB.paidOutReward)
        .toString();

      toSendToDB.value = Number(farmerAcc.value.rewardA.accruedReward/1000000000)

      console.log("SEND TO DB!")
      console.log(toSendToDB.value)
    };
  
    const fetchFarn = async () => {
      farmAcc.value = await gf.fetchFarmAcc(new PublicKey(farm.value!));
      console.log(
        `farm found at ${farm.value}:`,
        stringifyPKsAndBNs(farmAcc.value)
      );
    };

    const getFarmInfo = async () => {
        gf = await initGemFarm(getConnection(), getWallet()!);
        fetchFarn()
    }

    getFarmInfo()

    const fetchFarmer = async () => {
      const [farmerPDA] = await findFarmerPDA(
        new PublicKey(farm.value!),
        getWallet()!.publicKey!
      ); 
      farmerIdentity.value = getWallet()!.publicKey?.toBase58();
      farmerAcc.value = await gf.fetchFarmerAcc(farmerPDA);
      farmerState.value = gf.parseFarmerState(farmerAcc.value);
      await updateAvailableRewards();
      console.log(
        `farmer found at ${farmerIdentity.value}:`,
        stringifyPKsAndBNs(farmerAcc.value)
      );
    };

    const freshStart = async () => {
      if (getWallet() && getConnection()) {
        gf = await initGemFarm(getConnection(), getWallet()!);
        farmerIdentity.value = getWallet()!.publicKey?.toBase58();

        //reset stuff
        farmAcc.value = undefined;
        farmerAcc.value = undefined;
        farmerState.value = undefined;
        availableA.value = undefined;
        availableB.value = undefined;

        try {
          await fetchFarn();
          await fetchFarmer();
          setTimeout(() => {
            loading.value=false
          }, 1000)
        } catch (e) {
          console.log(`farm with PK ${farm.value} not found :(`);
          setTimeout(() => {
            loading.value=false
          }, 1000)
        }
      }
    };

    const initFarmer = async () => {
      await gf.initFarmerWallet(new PublicKey(farm.value!));
      await fetchFarmer();
    };

    watch([showAlert], () => {
      if (showAlert.value === true) {
        setTimeout(() => {
          showAlert.value = false
        }, 5000)
      }
    })

    // --------------------------------------- staking
    const beginStaking = async () => {
      if (pharaos.value > 0) {
        await gf.stakeWallet(new PublicKey(farm.value!));
        await fetchFarmer();
        selectedNFTs.value = [];
      } else {
        showAlert.value = true
      }
    };

    const endStaking = async () => {
      await gf.unstakeWallet(new PublicKey(farm.value!));
      await fetchFarmer();
      selectedNFTs.value = [];
    };

    const claim = async () => {
      await gf.claimWallet(
        new PublicKey(farm.value!),
        new PublicKey(farmAcc.value.rewardA.rewardMint!),
        new PublicKey(farmAcc.value.rewardB.rewardMint!)
      );
      await fetchFarmer();
    };

    const handleRefreshFarmer = async () => {
      await fetchFarmer();
    };

    // --------------------------------------- adding extra gem
    const selectedNFTs = ref<INFT[]>([]);

    const handleNewSelectedNFT = (newSelectedNFTs: INFT[]) => {
      console.log(`selected ${newSelectedNFTs.length} NFTs`);
      selectedNFTs.value = newSelectedNFTs;
    };

    const addSingleGem = async (
      gemMint: PublicKey,
      gemSource: PublicKey,
      creator: PublicKey
    ) => {
      await gf.flashDepositWallet(
        new PublicKey(farm.value!),
        '1',
        gemMint,
        gemSource,
        creator
      );
      await fetchFarmer();
    };

    const addGems = async () => {
      await Promise.all(
        selectedNFTs.value.map((nft) => {
          const creator = new PublicKey(
            //todo currently simply taking the 1st creator
            (nft.onchainMetadata as any).data.creators[0].address
          );
          console.log('creator is', creator.toBase58());

          addSingleGem(nft.mint, nft.pubkey!, creator);
        })
      );
      console.log(
        `added another ${selectedNFTs.value.length} gems into staking vault`
      );
    };

    
    const pharaos = ref(0);
    const multiplier = ref(0)
    const lastClaim = ref(0)
    const userInfo = ref<any>(null)
    const baseRate = ref(0)
    const totalXP = ref(0)
    const rate = ref<Number>(0)
    const earned = ref<Number>(0)

    const calculateRate = (period: any) => {
      console.log("calculating rate")
      if (typeof period === "object") {

        let curTime = new Date().getTime()/1000
        let startTime = new Date(period).getTime()/1000
        let timeStaked
        if (lastClaim.value === 0 || lastClaim.value < startTime) {
          timeStaked = (curTime - startTime)
        } else {
          timeStaked = (curTime - lastClaim.value)
        }

        const calcRateHelper = (perDay: number)  => {
          let perSecond = perDay/86400
          //in seconds
          baseRate.value = perDay
          rate.value = perSecond * multiplier.value * farmerAcc.value.gemsStaked
          earned.value = timeStaked * perSecond * multiplier.value * farmerAcc.value.gemsStaked
          console.log(timeStaked)
          console.log(perSecond)
          console.log(multiplier.value)
          console.log(farmerAcc.value.gemsStaked)
        }
        //in seconds

        if (timeStaked/60 >= 43800*10) {

          //ten months staked
          calcRateHelper(49)

        } else if (timeStaked/60 >= 43800*9) {

          //nine months staked
          calcRateHelper(39)

        } else if (timeStaked/60 >= 43800*8) {

          //eight months staked
          calcRateHelper(31)

        } else if (timeStaked/60 >= 43800*7) {

          //seven months staked
          calcRateHelper(25)

        } else if (timeStaked/60 >= 43800*6) {

          //six months staked
          calcRateHelper(20)

        } else if (timeStaked/60 >= 43800*5) {

          //five months staked
          calcRateHelper(16)

        } else if (timeStaked/60 >= 43800*4) {

          //four months staked
          calcRateHelper(13)

        } else if (timeStaked/60 >= 43800*3) {

          //three months staked
          calcRateHelper(10)

        } else if (timeStaked/60 >= 43800*2) {

          //two months staked
          calcRateHelper(8)

        } else if (timeStaked/60 >= 43800) {

          //one months staked
          calcRateHelper(6.5)

        } else if (timeStaked/60 < 43800) {

          //just staked
          calcRateHelper(5)

        } else {
          rate.value = 0
          earned.value = 0
        }

      } else {
        return null
      }
    }

    const currentVaultNFTs = ref<INFT[]>([]);
    const currentWalletNFTs = ref<INFT[]>([]);
    const desiredWalletNFTs = ref<INFT[]>([]);

    let gb: any;
    const gdrs = ref<PublicKey[]>([]);

    const populateWalletNFTs = async () => {
      // zero out to begin with
      currentWalletNFTs.value = [];

      if (getWallet()) {
        currentWalletNFTs.value = await getNFTsByOwner(
          getWallet()!.publicKey!,
          getConnection()
        );
        desiredWalletNFTs.value = [...currentWalletNFTs.value];
      }
    };

    const populateVaultNFTs = async () => {
      // zero out to begin with
      currentVaultNFTs.value = [];

      const foundGDRs = await gb.fetchAllGdrPDAs(farmerAcc.value.vault);
      if (foundGDRs && foundGDRs.length) {
        gdrs.value = foundGDRs;
        console.log(foundGDRs);

        const mints = foundGDRs.map((gdr: any) => {
          return { mint: gdr.account.gemMint };
        });
        currentVaultNFTs.value = await getNFTMetadataForMany(
          mints,
          getConnection()
        );
        currentVaultNFTs.value.forEach((nft) => {
          if (nft.externalMetadata.name === "NFT 2") {
            pharaos.value += 1
          }
          console.log(pharaos)
          console.log(nft.externalMetadata);
        })
      }
    };
    
    const parseFarmerState = (farmer: any): string => {
      return Object.keys(farmer.state)[0];
    };

    function time_convert(numb: any) { 
      var hours = Math.floor(numb / 60);
      var minutes = Math.floor(numb % 60);
      var days = Math.floor(hours/24);
      if (days >= 1) {
        hours = hours - (days * 24)
        return days + " days " + hours + " hours " + minutes + " minutes"
      } else {
        return hours + " hours " + minutes + " minutes"
      }
    }
    const getStakingPeriod = (period: any) => {
      if (typeof period === "object") {
        let curTime = new Date().getTime()/1000
        let startTime = period.getTime()/1000
        console.log('period: ', startTime)
        console.log('cur: ', curTime)
        let timeStaked = (curTime - startTime)/60
        let returnThis = time_convert(timeStaked)
        calculateRate(period)
        return returnThis
      } else {
        calculateRate(period)
      }
    }

  //////////////////////////////// MANUAL CLAIM /////////////////////////////////////////////

    const getInfo = async () => {
      console.log("getting info...")

      var requestOptions: any = {
        method: "GET",
        redirect: "follow"
      };

      fetch(
        "<your_stats_API",
        requestOptions
      )
        .then((response) => response.json())
        .then((result) => floorPrice.value=+result?.floorPrice!/+1000000000)
        .catch((error) => console.log("error", error));

      fetch(
        "https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd",
        requestOptions
      )
        .then((response) => response.json())
        .then((result) => solPrice.value=+result?.solana.usd)
        .catch((error) => console.log("error", error));
    };
    
    const router = useRouter()
    const changeRoute = () => {
      router.push('/profile')
      window.scroll({
        top: 0,
        left: 0,
        behavior: 'smooth'
      })
    }

    return {
      wallet,
      farm,
      farmAcc,
      farmer: farmerIdentity,
      farmerAcc,
      farmerState,
      availableA,
      availableB,
      initFarmer,
      beginStaking,
      endStaking,
      claim,
      handleRefreshFarmer,
      selectedNFTs,
      handleNewSelectedNFT,
      addGems,
      calculateRate,
      pharaos,
      multiplier,
      lastClaim,
      baseRate,
      totalXP,
      rate,
      earned,
      parseFarmerState,
      getStakingPeriod,
      parseDate,
      loading,
      timeAgo,
      showAlert,
      desiredWalletNFTs,
      currentVaultNFTs,
      floorPrice,
      solPrice,
      userInfo,
      changeRoute,
      showScreen,
      hashlist
    };
  },
});
</script>

<style scoped></style>
