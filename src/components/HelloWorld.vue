<script setup>
import { useRouter } from 'vue-router';
const router = useRouter();
import { onMounted, onUpdated, watch, onBeforeMount,ref } from 'vue';
import { useWallet, WalletMultiButton } from 'solana-wallets-vue';

const connected=ref(false)
onBeforeMount(() => {});

onMounted(() => {});

onUpdated(() => {});

watch(connected, (val) => {
    if (val) {
        router.push({ name: 'chat' });
    }
});
</script>

<template>
    <div class="greetings">
        <h1 class="my-2"><span style="color: #2169fb">SUPA</span>Charge</h1>
        <h3>Solana Hackathon Web Demo</h3>
    </div>
</template>

<style scoped>
h1 {
    font-weight: 500;
    font-size: 2.6rem;
    top: -10px;
    font-family: 'Audiowide', cursive;
}
.appbutton {
    margin-top: 5px;
}
h3 {
    font-size: 1.2rem;
    top: -15px;

    /* color: #fefefe */
}

.greetings h1,
.greetings h3 {
    text-align: center;
}

@media (min-width: 1024px) {
    .greetings h1,
    .greetings h3 {
        text-align: left;
    }
}
</style>
