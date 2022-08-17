<script setup>
import WelcomeItem from './WelcomeItem.vue';
import DocumentationIcon from './icons/IconDocumentation.vue';
import ToolingIcon from './icons/IconTooling.vue';
import EcosystemIcon from './icons/IconEcosystem.vue';
import CommunityIcon from './icons/IconCommunity.vue';
import SupportIcon from './icons/IconSupport.vue';
import HelpIcon from './icons/IconHelp.vue';
import { NIcon } from 'naive-ui';
</script>

<template>
    <WelcomeItem>
        <template #icon>
            <DocumentationIcon />
        </template>
        <template #heading>Documentation</template>

       Please follow the instructions below to fully explore the features.
    </WelcomeItem>

    <WelcomeItem>
        <template #icon>
            #1
        </template>
      Install  <a target="_blank" href="https://solflare.com/download">Solflare</a> or 
     <a target="_blank" href="https://phantom.app/download">Phantom Wallet</a>.<br/>
    

    </WelcomeItem>

    <WelcomeItem>
        <template #icon>
            #2
        </template>
       Add passphrase as provided in the TypeForm "Additional Information" section. Wallets #1-3 contain NFTs and Tokens readily.
        <br/>Connect to <code>DEVNET</code>. You should find some tokens and NFTs readily available. <br/>
        Alternatively, you may mint some of your own tokens and/or NFTs to test this.<br/>
      NOTE: You will require at least 2 accounts that own the same NFTs or Tokens to test out the Group Messaging feature.

    </WelcomeItem>

    <WelcomeItem>
        <template #icon>
            #3
        </template>
        Connect your wallet, select a nickname and sign-in.<br/>
        You may optionally select an avatar after signing in.
    </WelcomeItem>

    <WelcomeItem>
        <template #icon>
           #4
        </template>
        Select NFTs or Tokens to join a channel. NFTs and/or Tokens created by the same project or creator will automatically be allocated the same channel.
     
       
    </WelcomeItem>
    <WelcomeItem>
        <template #icon >
            <n-icon color="#fefefe" size="24">
        <HelpIcon /></n-icon>
        </template>
   
Got stuck? 
     
        More instructions are available in <code>README.md</code> on our <a target="_blank" href="https://github.com/supafoundation/supacharge-solana">GitHub</a> .
    </WelcomeItem>
</template>
