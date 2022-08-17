<script setup>
import { watch } from 'vue';
import { useWallet, WalletMultiButton } from 'solana-wallets-vue';
import Chat from '../components/Chat.vue';
const { connected, connecting } = useWallet();

watch(connected, (val) => {
    if (!val) {
        window.location = '/';
    }
});
</script>

<template>
    <div class="btn-wallet-chat">
        <wallet-multi-button v-if="connected"></wallet-multi-button>
    </div>
    <Chat v-if="connected" />
    <div v-if="!connected" class="d-flex justify-content-center">
        <div class="spinner-border text-primary" role="status" />
    </div>
    <p class="text-center" v-if="connecting">Loading...</p>
</template>

<style lang="scss" scoped>
body {
    font-family: 'Quicksand', sans-serif;
}

.vac-box-search .vac-input {
    width: 78%;
}

.vac-name-container .vac-text-ellipsis div {
    position: none !important;
}

.display-hidden {
    display: none !important;
}
.display-show {
    display: block !important;
}

.swv-dropdown {
    position: absolute !important;
    z-index: 20;
    top: 0;
    left: 0;
    margin: 8px 0px 0px 18.3%;
}

.btn-wallet-chat .vac-room-container .vac-room-name {
    padding-top: 5%;
    padding-left: 20px !important;
}

.btn-wallet-chat .vac-room-container .vac-room-name {
    padding-top: 5%;
    padding-left: 20px !important;
}

.btn-wallet-chat .swv-button-trigger {
    background-color: transparent !important;
}

.btn-wallet-chat.swv-button-trigger {
    background-color: transparent !important;
}

.btn-wallet-chat .swv-button > p {
    display: none !important;
}

.vac-title-container {
    padding-left: 9% !important;
}

.vac-format-message-wrapper .vac-text-ellipsis {
    padding-left: 5% !important;
}

.n-button.add-room {
    position: absolute !important;
    z-index: 20;
    left: 21.9%;
    top: 15px;
}

#app {
    max-width: 0px !important;
    margin: 0 !important;
    padding: 2rem;

    font-weight: normal;
}

@media (min-width: 1024px) {
    body {
        display: inline-block !important;
    }
    #app {
        display: block !important;
        grid-template-columns: 1fr 1fr;
        padding: 0 0.5rem;
    }
}
</style>
