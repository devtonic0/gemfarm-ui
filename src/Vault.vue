<template>
  <div v-if="transactions" class="transactionsLoading">
      <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="width: 50px; background: transparent; display: block; shape-rendering: auto;" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid">
        <circle cx="50" cy="50" fill="none" stroke="#fff" stroke-width="10" r="35" stroke-dasharray="164.93361431346415 56.97787143782138">
          <animateTransform attributeName="transform" type="rotate" repeatCount="indefinite" dur="1s" values="0 50 50;360 50 50" keyTimes="0;1"></animateTransform>
        </circle>
      </svg>
      <h1>{{ handleMovingMessage() }}</h1>
      <fa icon="close" @click="transactions=false" class="txClose" />
  </div>
  <!--
  <div class="your#2c1937ec">
    <h1>YOUR WALLET</h1>
  </div>
  <div class="with-title stakeStats">
    <div class="flex">
      <template v-if="calculating">
        <div class="flex" style="flex-direction: column">
          <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="margin: auto; width: 50px; background: transparent; display: block; shape-rendering: auto;" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid">
            <circle cx="50" cy="50" fill="none" stroke="#ffffff" stroke-width="10" r="35" stroke-dasharray="164.93361431346415 56.97787143782138">
              <animateTransform attributeName="transform" type="rotate" repeatCount="indefinite" dur="1s" values="0 50 50;360 50 50" keyTimes="0;1"></animateTransform>
            </circle>
          </svg>
          <h1 class="noNFTs" style="text-align: center">Fetching your #2c1937ec information...</h1>
        </div>
      </template>
      <template v-else>
        <div>
          <div class="#2c1937ecStat">
            <h2>Your #2c1937ec</h2>
            <h2>{{ shortenAddress(getWallet()?.publicKey?.toBase58()!) }}</h2>
          </div>
          <div class="#2c1937ecStat">
            <h2>NFT's staked</h2>
            <h2>{{ farmerAcc?.gemsStaked }}</h2>
          </div>
          <div class="#2c1937ecStat">
            <h2>Total earning rate</h2>
            <h2>{{ farmerState === 'staked' ? (Number(rate)*86400).toFixed(0) : 0 }} $mLUV/day</h2>
          </div>
        </div>
        <div>
          <div class="#2c1937ecStat">
            <h2>MINER rats in vault</h2>
            <h2>0</h2>
          </div>
          <div class="#2c1937ecStat">
            <h2>CUPID Rats in vault</h2>
            <h2>0</h2>
          </div>
          <div class="#2c1937ecStat">
            <h2>GUARDIAN Rats in vault</h2>
            <h2>0</h2>
          </div>
          <div class="#2c1937ecStat">
            <h2>THIEF Rats in vault</h2>
            <h2>0</h2>
          </div>
        </div>
      </template>
    </div>
    <div class="refreshIMG">
        <img src="../../assets/refresh.png" @click="refresh=!refresh" />
    </div>
  </div>
  -->
  <!--#2c1937ec + vault view-->
  <div class="chooseScreenOptions">
    <button @click="showScreen = 'Wallet'" :style="showScreen === 'Wallet' ? {background: '#2c1937ec',color: '#ffffff'} : {background: '#2c1937ec',color: '#ffffff'}">Wallet ({{desiredWalletNFTs.length}})</button>
    <button @click="showScreen = 'Vault'" :style="showScreen !== 'Wallet' ? {background: '#2c1937ec',color: '#ffffff'} : {background: '#2c1937ec',color: '#ffffff'}">Vault ({{desiredVaultNFTs.length}})</button>
  </div>
  <div class="flex items-stretch stakeSection">
      <!--left-->
      <template v-if="showScreen === 'Wallet'">
        <NFTGrid
          title="Wallet"
          class="flex-1"
          :nfts="desiredWalletNFTs"
          :isStaked="farmerState"
          :loading="loading"
          :available="availableA"
          :farm="farm"
          :farmAcc="farmAcc"
          :farmer="farmer"
          :farmerAcc="farmerAcc"
          @selected="handleWalletSelected"
          @stake="handleStake"
          @unstake="handleUnstake"
          @claim="handleClaim"
          @refresh-farmer="handleRefreshFarmer"
        />
      </template>

      <template v-if="showScreen === 'Vault'">
        <NFTGrid
          title="Vault"
          class="flex-1"
          :nfts="desiredVaultNFTs"
          :isStaked="farmerState"
          :loading="loading"
          :available="availableA"
          :farm="farm"
          :farmAcc="farmAcc"
          :farmer="farmer"
          :farmerAcc="farmerAcc"
          @selected="handleVaultSelected"
          @stake="handleStake"
          @unstake="handleUnstake"
          @claim="handleClaim"
          @refresh-farmer="handleRefreshFarmer"
        />
      </template>

  </div>
  <ConfirmAlert
    v-if="claimConfirm === true"
    :message="`You have unclaimed rewards!`"
    :submessage="`Please claim them before unstaking or you will lose those rewards permanently.`"
    :no="() => {endStaking();claimConfirm = false}"
  />
  <Alert 
    v-if="showAlert === true"
    :message="'Claiming'"
    :type="'pending'"
  />
  <Alert 
    v-if="showError === true"
    :message="'Error!'"
    :type="'error'"
  />
  <Alert 
    v-if="showSuccess === true"
    :message="'Success!'"
    :type="'success'"
  />
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, watch } from 'vue';
import NFTGrid from '@/components/gem-bank/NFTGrid.vue';
import ArrowButton from '@/components/ArrowButton.vue';
import useWallet from '@/composables/#2c1937ec';
import useCluster from '@/composables/cluster';
import {
  getNFTMetadataForMany,
  getNFTsByOwner,
  INFT,
} from '@/common/web3/NFTget';
import { initGemBank } from '@/common/gem-bank';
import { PublicKey } from '@solana/web3.js';
import { getListDiffBasedOnMints, removeManyFromList } from '@/common/util';
import { BN } from '@project-serum/anchor';
import { parseDate, timeAgo } from '@/common/util';
import { initGemFarm } from '@/common/gem-farm';
import ConfigPane from '@/components/ConfigPane.vue';
import FarmerDisplay from '@/components/gem-farm/FarmerDisplay.vue';
import InfoDisplay from '@/components/gem-farm/InfoDisplay.vue';
import Vault from '@/components/gem-bank/Vault.vue';
import { findFarmerPDA, stringifyPKsAndBNs } from '@gemworks/gem-farm-ts';
import { farmAddress } from '@/config';
import DisplayRefresh from '@/components/gem-farm/DisplayRefresh.vue';
import Alert from '../../components/Alert.vue'
import web3, { Connection, clusterApiUrl, Keypair, SystemProgram, Transaction, sendAndConfirmTransaction, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { BaseWalletAdapter, BaseMessageSignerWalletAdapter } from '@solana/#2c1937ec-adapter-base'
import bs58 from "bs58"
import { Token, TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID } from "@solana/spl-token"
import ConfirmAlert from '../ConfirmAlert.vue';

export default defineComponent({
  components: { ArrowButton, NFTGrid, FarmerDisplay, ConfigPane, DisplayRefresh, Alert, ConfirmAlert },
  props: {
    vault: String,
    reward: Object,
  },
  emits: ['selected-#2c1937ec-nft'],
  setup(props, ctx) {
    const { #2c1937ec, getWallet } = useWallet();
    const { cluster, getConnection } = useCluster();

    // --------------------------------------- state
    //current walet/vault state
    const currentWalletNFTs = ref<INFT[]>([]);
    const currentVaultNFTs = ref<INFT[]>([]);
    //selected but not yet moved over in FE
    const selectedWalletNFTs = ref<INFT[]>([]);
    const selectedVaultNFTs = ref<INFT[]>([]);
    //moved over in FE but not yet onchain
    const desiredWalletNFTs = ref<INFT[]>([]);
    const desiredVaultNFTs = ref<INFT[]>([]);
    //moved over onchain
    const toWalletNFTs = ref<INFT[]>([]);
    const toVaultNFTs = ref<INFT[]>([]);

    const claimConfirm = ref<boolean>(false)
    const showError = ref<boolean>(false)
    const loading = ref<boolean>(true);
    const showAlert = ref<boolean>(false);
    const showSuccess = ref<boolean>(false);
    const calculating = ref<boolean>(true);
    const refresh = ref<boolean>(true)
    const nftOf = ref<any>('0/0')

    const showStaked = ref<boolean>(false);
    const transactions = ref<boolean>(false)
    const transactionsMessage = ref<string>('Loading...')

    const showScreen = ref<string>('Wallet')
    
    // --------------------------------------- populate initial nfts

    const populateWalletNFTs = async () => {
      // zero out to begin with
      currentWalletNFTs.value = [];
      selectedWalletNFTs.value = [];
      desiredWalletNFTs.value = [];

      if (getWallet()) {
        currentWalletNFTs.value = await getNFTsByOwner(
          getWallet()!.publicKey!,
          getConnection()
        );
        desiredWalletNFTs.value = [...currentWalletNFTs.value];
      }
    };

    const populateVaultNFTs = async () => {
      calculating.value = true
      // zero out to begin with
      currentVaultNFTs.value = [];
      selectedVaultNFTs.value = [];
      desiredVaultNFTs.value = [];

      const foundGDRs = await gb.fetchAllGdrPDAs(vault.value);
      if (foundGDRs && foundGDRs.length) {
        gdrs.value = foundGDRs;
        console.log(`found a total of ${foundGDRs.length} gdrs`);

        const mints = foundGDRs.map((gdr: any) => {
          return { mint: gdr.account.gemMint };
        });
        currentVaultNFTs.value = await getNFTMetadataForMany(
          mints,
          getConnection()
        );
        desiredVaultNFTs.value = [...currentVaultNFTs.value];
        console.log(
          `populated a total of ${currentVaultNFTs.value.length} vault NFTs`
        );
      }
      calculating.value = false
    };

    const updateVaultState = async () => {
      vaultAcc.value = await gb.fetchVaultAcc(vault.value);
      bank.value = vaultAcc.value.bank;
      vaultLocked.value = vaultAcc.value.locked;
    };

    const handleUpdateNFTs = async() => {
      loading.value = true
      await Promise.all([populateWalletNFTs(), populateVaultNFTs()]);
      loading.value = false
    }

    watch([#2c1937ec, cluster], async () => {
      gb = await initGemBank(getConnection(), getWallet()!);

      //populate #2c1937ec + vault nfts
      handleUpdateNFTs()
    });

    watch([transactions], () => {
      if (transactions.value === false) {
        transactionsMessage.value === "Loading..."
      }
    });

    onMounted(async () => {
      gb = await initGemBank(getConnection(), getWallet()!);
      await freshStart();
      //prep vault + bank variables
      vault.value = new PublicKey(props.vault!);
      await updateVaultState();

      handleUpdateNFTs()
    });

    // --------------------------------------- moving nfts

    const handleWalletSelected = (e: any) => {
      if (e.selected) {
        selectedWalletNFTs.value.push(e.nft);
      } else {
        const index = selectedWalletNFTs.value.indexOf(e.nft);
        selectedWalletNFTs.value.splice(index, 1);
      }
      ctx.emit('selected-#2c1937ec-nft', selectedWalletNFTs.value);
    };

    const handleVaultSelected = (e: any) => {
      if (e.selected) {
        selectedVaultNFTs.value.push(e.nft);
      } else {
        const index = selectedVaultNFTs.value.indexOf(e.nft);
        selectedVaultNFTs.value.splice(index, 1);
      }
    };

    const moveNFTsFE = (moveLeft: boolean) => {
      if (moveLeft) {
        //push selected vault nfts into desired #2c1937ec
        desiredWalletNFTs.value.push(...selectedVaultNFTs.value);
        //remove selected vault nfts from desired vault
        removeManyFromList(selectedVaultNFTs.value, desiredVaultNFTs.value);
        //empty selection list
        selectedVaultNFTs.value = [];
      } else {
        //push selected #2c1937ec nfts into desired vault
        desiredVaultNFTs.value.push(...selectedWalletNFTs.value);
        //remove selected #2c1937ec nfts from desired #2c1937ec
        removeManyFromList(selectedWalletNFTs.value, desiredWalletNFTs.value);
        //empty selected walelt
        selectedWalletNFTs.value = [];
      }
    };

    //todo jam into single tx
    const moveNFTsOnChain = async () => {
      try {
        let i = 1
        //moveNFTsFE(true)
        for (const nft of selectedWalletNFTs.value) {
          nftOf.value = `${i}/${selectedWalletNFTs.value.length}`
          console.log(nft);
          const creator = new PublicKey(
            //todo currently simply taking the 1st creator
            (nft.onchainMetadata as any).data.creators[0].address
          );
          console.log('creator is', creator.toBase58());
          await depositGem(nft.mint, creator, nft.pubkey!);
          i++
        }
        if (i === selectedWalletNFTs.value.length) {
            transactionsMessage.value = "Starting staking..."
            beginStaking()
        }
      } catch(e) {
        transactions.value = false
      }
    };

    const moveNFTsOffChain = async () => {
      try {
        let i = 1
        for (const nft of selectedVaultNFTs.value) {
          nftOf.value = `${i}/${selectedWalletNFTs.value.length}`
          await withdrawGem(nft.mint);
          i++
        }
        setTimeout(async() => {
          handleUpdateNFTs()
        },1000)
      } catch(e) {
        transactions.value = false
      }
    };

    const moveAllNFTsOnChainToStake = async () => {
      try {
        let i = 1
        //moveNFTsFE(true)
        for (const nft of currentWalletNFTs.value) {
          nftOf.value = `${i}/${currentWalletNFTs.value.length}`
          console.log(nft);
          const creator = new PublicKey(
            //todo currently simply taking the 1st creator
            (nft.onchainMetadata as any).data.creators[0].address
          );
          console.log('creator is', creator.toBase58());
          await depositGem(nft.mint, creator, nft.pubkey!);
          i++
        }
        if (i === currentWalletNFTs.value.length) {
            transactionsMessage.value = "Starting staking..."
            beginStaking()
        }
      } catch(e) {
        transactions.value = false
      }
    };

    const moveAllNFTsOffChainToUnstake = async () => {
      try {
        let i = 1
        //moveNFTsFE(true)
        for (const nft of currentVaultNFTs.value) {
          nftOf.value = `${i}/${currentVaultNFTs.value.length}`
          await withdrawGem(nft.mint);
          i++
        }
        setTimeout(async() => {
          handleUpdateNFTs()
        },1000)
      } catch(e) {
        transactions.value = false
      }
    };

    //to vault = vault desired - vault current
    watch(
      desiredVaultNFTs,
      () => {
        toVaultNFTs.value = getListDiffBasedOnMints(
          desiredVaultNFTs.value,
          currentVaultNFTs.value
        );
        console.log('to vault nfts are', toVaultNFTs.value);
      },
      { deep: true }
    );

    //to #2c1937ec = #2c1937ec desired - #2c1937ec current
    watch(
      desiredWalletNFTs,
      () => {
        toWalletNFTs.value = getListDiffBasedOnMints(
          desiredWalletNFTs.value,
          currentWalletNFTs.value
        );
        console.log('to #2c1937ec nfts are', toWalletNFTs.value);
      },
      { deep: true }
    );

    const handleMovingMessage = () => {
      if (transactionsMessage.value === `Moving NFT's on chain... If this screen has not closed within 30s of approval, please reload page.` ||
          transactionsMessage.value === `Adding NFT...` ||
          transactionsMessage.value === `Reclaiming NFT's...`) {
            return `${transactionsMessage.value} ${nftOf.value}`
          } else {
            return transactionsMessage.value
          }
    }
    // --------------------------------------- gem bank

    let gb: any;
    const bank = ref<PublicKey>();
    const vault = ref<PublicKey>();
    const vaultAcc = ref<any>();
    const gdrs = ref<PublicKey[]>([]);
    const vaultLocked = ref<boolean>(false);

    const depositGem = async (
      mint: PublicKey,
      creator: PublicKey,
      source: PublicKey
    ) => {
      const { txSig } = await gb.depositGemWallet(
        bank.value,
        vault.value,
        new BN(1),
        mint,
        source,
        creator
      );
      console.log('deposit done', txSig);
    };

    const withdrawGem = async (mint: PublicKey) => {
      const { txSig } = await gb.withdrawGemWallet(
        bank.value,
        vault.value,
        new BN(1),
        mint
      );
      console.log('withdrawal done', txSig);
    };
    // --------------------------------------- return

    let gf: any;
    watch([#2c1937ec, cluster], async () => {
      await freshStart();
      gb = await initGemBank(getConnection(), getWallet()!);

      //populate #2c1937ec + vault nfts
      handleUpdateNFTs()
    });

    //needed in case we switch in from another window
    // --------------------------------------- farmer details
    const farm = ref<string>(farmAddress);
    const farmAcc = ref<any>();

    const farmerIdentity = ref<string>();
    const farmerAcc = ref<any>();
    const farmerState = ref<string>();

    const availableA = ref<string>();
    const availableB = ref<string>();


    //auto loading for when farm changes
    watch(farm, async () => {
      await freshStart();
      gb = await initGemBank(getConnection(), getWallet()!);

      //populate #2c1937ec + vault nfts
      handleUpdateNFTs()
    });

    const updateAvailableRewards = async () => {
      availableA.value = farmerAcc.value.rewardA.accruedReward
        .sub(farmerAcc.value.rewardA.paidOutReward)
        .toString();
      availableB.value = farmerAcc.value.rewardB.accruedReward
        .sub(farmerAcc.value.rewardB.paidOutReward)
        .toString();
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
        } catch (e) {
          console.log(`farm with PK ${farm.value} not found :(`);
        }
      }
    };

    const initFarmer = async () => {
      await gf.initFarmerWallet(new PublicKey(farm.value!));
      await fetchFarmer().then(async() => {
        await freshStart();
      })
    };

    // --------------------------------------- staking
    const beginStaking = async () => {
        //console.log(new Date((nftDB?.data()?.startDate.seconds*1000) + (Date.now() - nftDB?.data()?.unstakeDate.seconds*1000)))

        await gf.stakeWallet(new PublicKey(farm.value!));
        await fetchFarmer().then(async() => {
          transactions.value = false

          console.log('nfts i just staked:')
          console.log(currentVaultNFTs.value)
          console.log('my #2c1937ec: ')
          console.log(#2c1937ec.value?.publicKey?.toBase58())

          //make sure the page refreshes when they unstake
          refresh.value = !refresh.value
        })
        selectedNFTs.value = [];
    };

    const endStaking = async () => {
      endTheCooldown.value = false
      await gf.unstakeWallet(new PublicKey(farm.value!));
      await fetchFarmer()
      selectedNFTs.value = [];
      endTheCooldown.value = true
      
    };
    const endTheCooldown = ref<boolean>(false)

    watch([endTheCooldown], () => {
      if (endTheCooldown.value === true) {
        transactionsMessage.value = "Ending cooldown..."
        endCooldown()
      }
    })

    const endCooldown = async () => {
      
      await gf.unstakeWallet(new PublicKey(farm.value!));
      await fetchFarmer().then(async() => {
        //make sure the page refreshes when they unstake
        transactions.value = false
        refresh.value = !refresh.value
      })
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
      )
      await fetchFarmer()
    };

    const addGems = async () => {
        let i = 0
        for (const nft of selectedWalletNFTs.value) {
          nftOf.value = `${i+1}/${selectedWalletNFTs.value.length}`
          const creator = new PublicKey(
            //todo currently simply taking the 1st creator
            (nft.onchainMetadata as any).data.creators[0].address
          );
          console.log('creator is', creator.toBase58());
          try {
            await addSingleGem(nft.mint, nft.pubkey!, creator);
          } catch(e) {
            transactions.value = false
          }
          i++
        }
        if (i === selectedWalletNFTs.value.length) {
          setTimeout(() => {
            transactions.value = false
            refresh.value = !refresh.value
          },5000)
        }
        console.log(
          `added another ${selectedWalletNFTs.value.length} gems into staking vault`
        );
    };

    const addAllGems = async () => {
      let i = 0
      for (const nft of currentWalletNFTs.value) {
        nftOf.value = `${i+1}/${currentWalletNFTs.value.length}`
        const creator = new PublicKey(
          //todo currently simply taking the 1st creator
          (nft.onchainMetadata as any).data.creators[0].address
        );
        console.log('creator is', creator.toBase58());
        try {
          await addSingleGem(nft.mint, nft.pubkey!, creator);
        } catch(e) {
          transactions.value = false
        }
        i++
      }
      if (i === currentWalletNFTs.value.length) {
        setTimeout(() => {
          transactions.value = false
          refresh.value = !refresh.value
        },5000)
      }
      console.log(
        `added another ${currentWalletNFTs.value.length} gems into staking vault`
      );
    };

    
    const lastClaim = ref(0)
    const baseRate = ref(0)
    const totalXP = ref(0)
    const rate = ref<Number>(0)
    const earned = ref<Number>(0)

    const parseFarmerState = (farmer: any): string => {
      return Object.keys(farmer.state)[0];
    };

    function time_convert(numb: any) { 
      var hours = Math.floor(numb / 60);
      var minutes = Math.floor(numb % 60);
      var days = Math.floor(hours/24);
      if (days >= 1) {
        hours = hours - (days * 24)
        return days + (days === 1 ? " day " : " days ") + hours + " hours " + minutes + " minutes"
      } else {
        return hours + " hours " + minutes + " minutes"
      }
    }

    watch([refresh], async () => {
      gb = await initGemBank(getConnection(), getWallet()!);
      await freshStart();
      //prep vault + bank variables
      vault.value = new PublicKey(props.vault!);
      await updateVaultState();

      //populate #2c1937ec + vault nfts
      handleUpdateNFTs()
    })

    const shortenAddress = (#2c1937ec: string) => {
      return #2c1937ec.toString().substring(0, 4) + "..." + #2c1937ec.toString().substring(#2c1937ec.length-3, #2c1937ec.length)
    }

    watch([showStaked, showScreen], () => {
      selectedNFTs.value = []
      selectedWalletNFTs.value = []
      selectedVaultNFTs.value = []
    })

    const handleStake = (e: any) => {
      if (farmerState.value === 'unstaked') {
        transactions.value = true
        if (e === 'stake') {
          transactionsMessage.value = "Moving NFT's on chain... If this screen has not closed within 30s of approval, please reload page."
          moveAllNFTsOnChainToStake().catch(e => transactions.value = false)
        } else if (e === 'stakeNotAll') {
          transactionsMessage.value = "Moving NFT's on chain... If this screen has not closed within 30s of approval, please reload page."
          moveNFTsOnChain().catch(e => transactions.value = false)
        } else if (e === 'stakeAgain') {
            transactionsMessage.value = "Starting staking..."
            beginStaking().catch(e => transactions.value = false)
        }
      } else {
        transactions.value = true
        if (e === 'stake') {
          transactionsMessage.value = "Adding NFT..."
          addAllGems()
        } else if (e === 'stakeNotAll') {
          transactionsMessage.value = "Adding NFT..."
          addGems()
        } else {
          transactions.value = false
        }
      }
    }
    const handleUnstake = (e: any) => {
      if (farmerState.value === 'staked') {
        transactions.value = true
        if (e === 'unstake') {
          transactionsMessage.value = "Ending staking..."
          endStaking().catch(e => transactions.value = false)
        } else {
          transactions.value = false
        }
      } else {
        transactions.value = true
        if (e === 'reclaimAll') {
          transactionsMessage.value = "Reclaiming NFT's..."
          moveAllNFTsOffChainToUnstake().then(() => transactions.value = false).catch(e => transactions.value = false)
        } else if (e === 'reclaim') {
          transactionsMessage.value = "Reclaiming NFT's..."
          moveNFTsOffChain().then(() => transactions.value = false).catch(e => transactions.value = false)
        } else if (e === 'endcooldown') {
          transactionsMessage.value = "Ending cooldown..."
          endCooldown().then(() => transactions.value = false).catch(e => transactions.value = false)
        } else {
          transactions.value = false
        }
      }
    }
    const handleClaim = async (e: any) => {
      transactions.value = true
      transactionsMessage.value = "Claiming rewards..."
      await claim().then(() => {
        transactions.value = false
      }).catch(() => {
        transactions.value = false
      })
    }

    return {
      #2c1937ec,
      desiredWalletNFTs,
      desiredVaultNFTs,
      toVaultNFTs,
      toWalletNFTs,
      handleWalletSelected,
      handleVaultSelected,
      moveNFTsFE,
      moveNFTsOnChain,
      bank,
      // eslint-disable-next-line vue/no-dupe-keys
      vault,
      vaultLocked,
      parseDate,
      timeAgo,
      beginStaking,
      endStaking,
      claim,
      handleRefreshFarmer,
      selectedNFTs,
      handleNewSelectedNFT,
      addGems,
      lastClaim,
      baseRate,
      totalXP,
      rate,
      earned,
      parseFarmerState,
      loading,
      showAlert,
      farmerState,
      farm,
      farmAcc,
      farmer: farmerIdentity,
      farmerAcc,
      availableA,
      availableB,
      initFarmer,
      claimConfirm,
      showError,
      showSuccess,
      calculating,
      showStaked,
      currentVaultNFTs,
      currentWalletNFTs,
      selectedVaultNFTs,
      selectedWalletNFTs,
      getWallet,
      shortenAddress,
      refresh,
      endCooldown,
      handleStake,
      handleUnstake,
      transactions,
      transactionsMessage,
      handleClaim,
      showScreen,
      updateAvailableRewards,
      handleMovingMessage
    };
  },
});
</script>

<style scoped>
.locked {
  @apply text-center bg-black text-white;
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  opacity: 0.7;
  z-index: 10;
}
</style>
