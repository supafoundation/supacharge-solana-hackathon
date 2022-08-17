

<template>
    <div id="apps">
        <header>
            <img
                alt="Vue logo"
                class="logo"
                src="@/assets/logo.gif"
                height="250"
            />

            <div class="wrapper">
                <nav>
                          <RouterLink to="/" @click="showPage('features')">Home</RouterLink>
                        <RouterLink to="/" @click="showPage('readme')">Readme</RouterLink>
                     <RouterLink to="/" @click="showPage('about')">About</RouterLink>

                </nav>
                
                <HelloWorld />
                <!-- <a href="/chat" class="btn btn-primary" v-if="connected"
                    >Open</a
                > -->
   <wallet-multi-button v-if="!store.isConnected"></wallet-multi-button>
           <n-button v-if="store.isConnected" @click="showModal = true" text-color="#fefefe">
                Sign In
            </n-button>
            </div>
        </header>

        <main>
               
             <n-modal v-model:show="showModal">
    <n-card
      style="width: 600px"
      title="Select a Nickname"
      :bordered="false"
      size="huge"
      role="dialog"
      aria-modal="true"
    >
      <template #header-extra>
        <wallet-multi-button ></wallet-multi-button>
      </template>
  <n-space vertical>
    
    <n-input :status="inputStatus"  :on-update:value="inputChange" show-count clearable placeholder="Example: Degen_Ape" />
  </n-space>
    <n-text v-if="inputStatus=='warning'" type="info">
       Enter a nickname between 3-15 alphanumeric characters.
  </n-text>
  <n-text type="success" v-if="inputStatus=='success'">
    Success! You will be asked to sign with your wallet for authentication.
  </n-text>
  <n-text type="error"  v-if="inputStatus=='error'" >
       Enter a nickname between 3-15 alphanumeric characters.

  </n-text>
  <div></div>
      <template #footer>
      <n-button @click="showModal=false">Close</n-button>

  <n-button @click="signIn" :disabled="isSignInButtonDisabled">Sign In</n-button>
      </template>
    </n-card>
  </n-modal>
              <TheWelcome v-if="toShow=='readme'" />

            <Features v-if="toShow=='features'" />
                        <AboutView v-if="toShow=='about'" />

        </main>
    </div>
</template>
<script setup>
import TheWelcome from '@/components/TheWelcome.vue';

import HelloWorld from '../components/HelloWorld.vue';
import { useWallet } from 'solana-wallets-vue';
import '../assets/main.css';
import { RouterLink, RouterView } from "vue-router";
  import { defineComponent,ref, watch, computed } from 'vue'
  import { NButton, NModal, NCard, NSpace, NInput, NText } from 'naive-ui'
import { WalletMultiButton } from 'solana-wallets-vue'
import { AnchorProvider, Program } from '@project-serum/anchor'
import { Connection, PublicKey, Keypair, clusterApiUrl, SystemProgram } from '@solana/web3.js'
import bs58 from 'bs58'


// import { Provider, Program } from '@project-serum/anchor'

import { dataTableLight } from 'naive-ui/es/data-table/styles';
import { useStore } from '../stores';
import Features from './FeaturesView.vue';

import AboutView from './AboutView.vue';
const store = useStore();
store.initialize();

  defineComponent({ 
    components: {
      NButton,
      NModal,
      NCard,
      NSpace,
      NInput,
      NText
    }
  
  })
  const preflightCommitment = 'processed'
  const showPage=(val)=>{
toShow.value=val
  }
  const toShow=ref("features")
const commitment = 'confirmed'
    const inputValue=ref("")
    const inputStatus=ref("warning")
    const  isSignInButtonDisabled=ref(true)
     const showModal= ref(false)
     const connection = new Connection(clusterApiUrl('devnet'),commitment);
  const provider = computed(() => new AnchorProvider(connection, store?.wallet, { preflightCommitment, commitment })) 
   function inputChange(v) {
     inputStatus.value= /^[a-zA-Z0-9_]{3,15}$/.test(v) ? "success" : (v.length==0?  "warning" : "error")
    inputValue.value=v
    isSignInButtonDisabled.value=/^[a-zA-Z0-9_]{3,15}$/.test(v) ? false : true;
      }
  const computedDisconnecting = computed(() => {
  return !store.disconnecting
  })
    watch(computedDisconnecting, async (isDisconnected) => {
     showModal.value=!isDisconnected
    })

    async function signIn(){
console.log((/^[a-zA-Z0-9_]{3,15}$/.test(inputValue.value) && !store.disconnecting)?store.wallet?.publicKey.toBase58():"error") 
let timestampNow=Math.floor(Date.now() / 1000);
const message = `I am signing in as ${inputValue.value} and providing a signature to allow solana-hackathon.supacharge.io to validate my wallet ${store.wallet?.publicKey.toBase58()} at timestamp: ${timestampNow}`
const encodedMessage = new TextEncoder().encode(message);
const signedMessage = await store.signMessage(encodedMessage, "utf8"); 
let payload = {walletAddress: store.wallet?.publicKey.toBase58(), timestamp: timestampNow, walletSignature: bs58.encode(signedMessage), domain:'solana-hackathon.supacharge.io', nickname: inputValue.value};

    console.log(payload)  


fetch("http://solana-hackathon-api.supacharge.io:3000/signin",
{
    method: "POST",
    body: JSON.stringify(payload),
   headers: {'Content-Type': 'application/json'},

})
.then(function(res){ return res.json(); })
.then(function(data){ 
    for(let j=0; j<data.nftList.length; j++){
        fetch(data.nftList[j].uri).then(res => {
  res.json().then((res) => {
   data.nftList[j].img=res.image
   if(j+1==data.nftList.length){
        store.storeUser(data.token, data.nftList)
   } // this should print the url to console
  });
});
    }
 })

    }


</script>
<style scoped>
header {
    line-height: 1.5;
    max-height: 100vh;
}

.logo {
    display: block;
    margin: 0 auto 2rem;
}

nav {
    width: 100%;
    font-size: 1rem;
    text-align: center;
    margin-top: 2rem;
}

nav a.router-link-exact-active {
    color: var(--color-text);
}

nav a.router-link-exact-active:hover {
    background-color: transparent;
}

nav a {
    display: inline-block;
    padding: 0 1rem;
    border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
    border: 0;
}

@media (min-width: 1024px) {
    header {
        display: flex;
        place-items: center;
        padding-right: calc(var(--section-gap) / 2);
    }

    .logo {
        margin: 0 0.5rem 0 0;
    }

    header .wrapper {
        display: flex;
        place-items: flex-start;
        flex-wrap: wrap;
    }

    nav {
        text-align: left;
        margin-left: -1rem;
        font-size: 1rem;

        padding: 1rem 0;
        margin-top: 1rem;
    }
}
</style>
