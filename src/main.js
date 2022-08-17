import { createApp } from 'vue';
import { createPinia } from 'pinia';

import App from './App.vue';
import router from './router';

// import SolanaWallets from 'solana-wallets-vue';

import 'solana-wallets-vue/styles.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap';

// import {
//     PhantomWalletAdapter,
//     SlopeWalletAdapter,
//     SolflareWalletAdapter,
//   } from '@solana/wallet-adapter-wallets';

//   const walletOptions = {
//     wallets: [
//       new PhantomWalletAdapter(),
//       new SlopeWalletAdapter(),
//       new SolflareWalletAdapter({ network: 'devnet'}),
//     ],
//     autoConnect: true,
//   }
import { initWallet } from 'solana-wallets-vue';
import {
    PhantomWalletAdapter,
    SlopeWalletAdapter,
    SolflareWalletAdapter
} from '@solana/wallet-adapter-wallets';

const wallets = [
    new PhantomWalletAdapter(),
    new SlopeWalletAdapter(),
    new SolflareWalletAdapter({ network: 'devnet' })
];

initWallet({ wallets, autoConnect: true });

const app = createApp(App);
// app.use(SolanaWallets, walletOptions)
app.use(createPinia());
app.use(router);

app.mount('#app');
