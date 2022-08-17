import { defineStore } from 'pinia';
import { useWallet } from 'solana-wallets-vue';
// const { connected } = useWallet();

export const userStore = defineStore({
    id: 'user',
    state: () => ({
        loading: false,
        username: null
    }),
    getters: {
        getLogin() {}
    },
    actions: {
        async connect() {},
        async register(username) {},
        async update(walletAddress) {},
        async delete(walletAddress) {},
        async disconnect() {
            // const { disconnect } = useWallet();
            // await disconnect();
            // this.username = null;
            // this.$router.push('/');
        }
    }
});
