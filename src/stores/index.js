import router from "@/router";
import { defineStore } from "pinia"
import { useAnchorWallet, useWallet } from "solana-wallets-vue"


export const useStore = defineStore('walletStore',{
  state: () => {
    return {
      wallet: null,
      disconnecting:false,
      connection:null,
      provider:null,
      signMessage:null,
      userToken:JSON.parse(localStorage.getItem('userWallet')),
      nftList:{},
      avatar:`@/assets/avatar/${Math.floor(Math.random() * 10).toString()}.png`
    }
 
  },
  getters: {
    isConnected: state => state.wallet?.publicKey.toBase58() ? true : false

    
},
  actions: {
    async initialize() {
      const { disconnecting, signMessage } = useWallet();
      this.wallet=  useAnchorWallet();
      this.signMessage=signMessage;
      this.disconnecting=disconnecting;
    },
    async storeUser(userToken,nftList){
        this.userToken=userToken
        this.nftList=nftList
        if(nftList.length>0){
           this.avatar=nftList[0].img
        }
        localStorage.setItem('user', JSON.stringify(userToken));
        router.push('/chat')
    },
    async refreshUser(userToken,nftList){
        this.userToken=userToken
        this.nftList=nftList
        localStorage.setItem('user', JSON.stringify(userToken));
    },
    async setAvatar(pos){
        this.avatar=this.nftList[pos].img
    },
    async storeUserToken(userToken){
        this.userToken=userToken
   
        localStorage.setItem('user', JSON.stringify(userToken));

    },
    async signOut(){
        this.userToken=null
        localStorage.removeItem('user');
        router.push('/')
    }
  
  },
});
