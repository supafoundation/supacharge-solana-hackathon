<template>
    <div>
        <n-button
            class="add-room"
            text
            style="font-size: 28px"
            @click="showModalStart = true"
            circle
        >
            <n-icon><add-icon /></n-icon>
        </n-button>
        <chat-window
            height="calc(100vh - 20px)"
            :current-user-id="currentUserId"
            :room-actions="roomActions"
            :rooms="rooms"
            :rooms-loaded="true"
            :messages="messages"
            :messages-loaded="messagesLoaded"
            @send-message="sendMessage"
            @fetch-messages="fetchMessages"
            :username-options="usernameOptions"
            :message-actions="[
                {
                    name: 'replyMessage',
                    title: 'Reply'
                }
            ]"
        />
        <!-- info start -->

        <n-modal
            v-model:show="showModalStart"
            preset="card"
            style="width: 500px"
            title="Channel Selection"
            class="selection-card"
        >
            <template #header-extra
                ><n-button @click="refreshList" class="selection-card-btn-text" 
                    >Refresh List</n-button
                ></template
            >
            <template #header>
                <div style="color: #fff">Selection:</div>
            </template>
            <n-tabs
                default-value="channel"
                justify-content="space-evenly"
                type="line"
                class="selection-card-tabs"
            >
                <n-tab-pane name="channel" tab="Channels">
                    <n-scrollbar style="max-height: 300px">
                        <div>
                            <n-checkbox-group
                                v-model:value="collectionsSelect"
                                @update:value="handleUpdateValue"
                            >
                                <div
                                    class="card my-2"
                                    v-for="item in collectionList"
                                >
                                    <div class="card-body">
                                        <div class="row">
                                            <div
                                                class="col-1 align-self-center"
                                            >
                                                <n-checkbox
                                                    size="large"
                                                    :value="
                                                        item.updateAuthorityAddress
                                                    "
                                                />
                                            </div>
                                            <div class="col-2">
                                                <img
                                                    alt="logo"
                                                    class="rounded-circle mx-auto d-block"
                                                    :src="item.img"
                                                    width="65"
                                                    height="65"
                                                    style="object-fit: cover"
                                                />
                                            </div>
                                            <div class="col align-self-center">
                                                <span style="font-weight: bold">
                                                    {{ item.name }}
                                                </span>
                                                <span style="font-size: 12px">
                                                    #{{
                                                        item.updateAuthorityAddress
                                                    }}
                                                </span>
                                            </div>
                                            <!-- <div
                                                class="col-3 align-self-center"
                                            >
                                                {{ item.name }}
                                            </div> -->
                                        </div>
                                    </div>
                                </div>
                            </n-checkbox-group>
                        </div>
                    </n-scrollbar>
                    <n-button
                        @click="saveGroups"
                        v-if="disabledUsername"
                        :disabled="!username"
                        >Proceed</n-button
                    >
                </n-tab-pane>
                <n-tab-pane name="dm" tab="Direct Message">
                    <n-text code> Enter a Solana Wallet Address: </n-text>
                    <n-input-group>
                        <n-input
                            :style="{ width: '75%' }"
                            :status="inputStatus"
                            :on-update:value="addressInputChange"
                            placeholder=""
                        />

                        <n-text type="error" v-if="inputStatus == 'error'">
                            Please enter a valid Solana Address
                        </n-text>
                        <n-button
                            type="primary"
                            ghost
                            @click="tempAddressInput"
                            :disabled="isSignInButtonDisabled"
                        >
                            Add
                        </n-button>
                    </n-input-group>

                    <div v-if="tempAddress != ''">
                        <n-tag
                            closable
                            @close="handleRemoveTempAddress()"
                            size="small"
                        >
                            {{ tempAddress }}
                        </n-tag>
                    </div>
                    <n-input
                        v-if="tempAddress != ''"
                        v-model:value="msgToAddress"
                        type="textarea"
                        placeholder="Basic Textarea"
                    />
                    <n-button
                        type="primary"
                        @click="
                            sendMessage({
                                content: msgToAddress,
                                roomId: 'dm:' + tempAddress
                            })
                        "
                        v-if="tempAddress != ''"
                        :disabled="msgToAddress.length == 0"
                    >
                        Send Message
                    </n-button>
                    <div v-for="(item, index) in DMRooms">
                        <n-tag
                            closable
                            @close="handleRemoveAddress(item)"
                            size="small"
                        >
                            {{ item }}
                        </n-tag>
                    </div>
                </n-tab-pane>

                <n-tab-pane name="avatar" tab="Avatar">
                    <n-scrollbar style="max-height: 300px">
                        <div v-for="(item, index) in collectionList">
                            <div class="row">
                                <div class="col-1 align-self-center">
                                    <n-radio
                                        :checked="checkedValue === index"
                                        :value="index"
                                        :key="index"
                                        :name="index"
                                        @change="handleChange"
                                    >
                                    </n-radio>
                                </div>
                                <div class="col-2">
                                    <img
                                        alt="logo"
                                        class="rounded-circle mx-auto d-block"
                                        :src="item.img"
                                        width="65"
                                        height="65"
                                        style="object-fit: cover"
                                    />
                                </div>
                            </div>
                        </div>
                    </n-scrollbar>
                </n-tab-pane>
            </n-tabs>
        </n-modal>
    </div>
</template>

<script>
import ChatWindow from 'vue-advanced-chat';
import {
    NModal,
    NButton,
    NInput,
    NInputGroup,
    NTag,
    NIcon,
    NCheckbox,
    NCheckboxGroup,
    NSpin,
    NTabs,
    NTabPane,
    NScrollbar,
    NAvatar,
    NRadio,
    NGrid,
    NCol,
    NGridItem
} from 'naive-ui';
import 'vue-advanced-chat/dist/vue-advanced-chat.css';
import { defineComponent, ref, computed, watch, onMounted } from 'vue';
import { AddCircle as AddIcon } from '@vicons/ionicons5';
import { useStore } from '../stores';
import { PublicKey } from '@solana/web3.js';
import _ from 'underscore';



import { parseTimestamp, formatTimestamp } from '@/utils/dates';
import { useWallet } from 'solana-wallets-vue';
import jwt_decode from 'jwt-decode';
import { Centrifuge } from 'centrifuge';
import dayjs from 'dayjs';

export default defineComponent({
    name: 'ChatS',
    components: {
        ChatWindow,
        NModal,
        NButton,
        NInput,
        NIcon,
        AddIcon,
        NCheckbox,
        NCheckboxGroup,
        NSpin,
        NTabs,
        NTabPane,
        NScrollbar,
        NAvatar,
        NRadio,
        NGrid,
        NCol,
        NGridItem,
        NInputGroup,
        NTag
    },
    data() {
        return {
            currentUserId: '',
            messages: [],
            messagesLoaded: false,
            roomActions: [
                { name: 'inviteUser', title: 'Invite User' },
                { name: 'removeUser', title: 'Remove User' },
                { name: 'deleteRoom', title: 'Delete Room' },
                { name: 'info', title: 'Info' }
            ],
            messageSelectionActions: [
                { name: 'deleteMessages', title: 'Delete' }
            ],

            addShowRoom: ref(false),
            infoRoom: ref(false),
            detailsMembers: ref(false),
            detailsUsers: ref(false),
            loadingRooms: true,
            loadingLastMessageByRoom: 0,
            roomsLoadedCount: false,
            rooms: [],
            roomsLoaded: false,
            startRooms: null,
            endRooms: null,
            roomsListeners: [],
            roomsPerPage: 15,
            allUsers: [],

            addNewRoom: null,
            addRoomUsername: null,
            name_room: null,
            addShowInviteUser: ref(false),
            inviteRoomId: null,
            inviteUserWallet: null,
            listeners: [],
            addShowRemoveUser: ref(false),
            listUserRoom: [],
            isConnect: false,
            collectionError: ref(false),
            usernameOptions: { minUsers: 1 }
        };
    },
    setup() {
        const checkedValue = ref(0);
        const rooms = ref([]);
        const currentRoom = ref(null);
        const loadingRooms = ref(true);
        const currentUserId = ref('');
        const msgToAddress = ref('');
        const showSpin = ref(false);
        const addressInput = ref('');

        const isSignInButtonDisabled = ref(true);
        const showModalStart = ref(true);
        const collectionsRef = ref(null);
        const store = useStore();
        store.initialize();
        const username = ref(store.wallet?.publicKey.toBase58());
        const disabledUsername = ref(true);
        const addShowRoom = ref(false);
        const infoRoom = ref(false);
        const detailsMembers = ref(false);
        const detailsUsers = ref(false);
        const loadingLastMessageByRoom = ref(0);
        const roomsLoadedCount = ref(false);
        const roomsLoaded = ref(false);
        const startRooms = ref(null);
        const endRooms = ref(null);
        const roomsListeners = ref([]);
        const roomsPerPage = ref(15);
        const allUsers = ref([]);
        const messages = ref([]);
        const addNewRoom = ref(null);
        const addRoomUsername = ref(null);
        const name_room = ref(null);
        const addShowInviteUser = ref(false);
        const inviteRoomId = ref(null);
        const inviteUserWallet = ref(null);
        const listeners = ref([]);
        const addShowRemoveUser = ref(false);
        const listUserRoom = ref([]);
        const isConnect = ref(false);
        const collectionError = ref(false);
        const lastLoadedMessage = ref(null);
        const messagesLoaded = ref(false);
        const previousLastLoadedMessage = ref(null);
        const usernameOptions = ref({ minUsers: 1 });
        const DMRooms = ref([]);
        const inputStatus = ref('warning');
        const tempAddress = ref('');

     const fetchRooms = () => {
            resetRooms();
            fetchMoreRooms();
            // remove
            const deleteAttach = document.querySelector(
                '.vac-icon-textarea > div.vac-svg-button'
            );
            if (deleteAttach) {
                deleteAttach.remove();
            }
        };
        const addressInputChange = (v) => {
            inputStatus.value = PublicKey.isOnCurve(v)
                ? 'success'
                : v.length == 0
                ? 'warning'
                : 'error';
            isSignInButtonDisabled.value = PublicKey.isOnCurve(v)
                ? false
                : true;
            addressInput.value = v;
        };
        const tempAddressInput = () => {
            if (PublicKey.isOnCurve(addressInput.value)) {
                tempAddress.value = addressInput.value;
            }
        };
        const processAddressInput = () => {
            if (PublicKey.isOnCurve(addressInput.value)) {
                if (addressInput.value != username.value) {
                    DMRooms.value.push(addressInput.value);
                    DMRooms.value = _.uniq(DMRooms.value);
                }
            }
        };
        const handleRemoveTempAddress = () => {
            tempAddress.value = '';
        };
        const handleRemoveAddress = (v) => {
            DMRooms.value = _.without(DMRooms.value, v);
        };
        const resetRooms = () => {
            loadingRooms.value = true;
            loadingLastMessageByRoom.value = 0;
            roomsLoadedCount.value = 0;
            rooms.value = [];
            roomsLoaded.value = true;
            startRooms.value = null;
            endRooms.value = null;
            roomsListeners.value.forEach((listener) => listener());
            roomsListeners.value = [];
            resetMessages();
        };
        const resetMessages = () => {
            messages.value = [];
            messagesLoaded.value = false;
            lastLoadedMessage.value = null;
            previousLastLoadedMessage.value = null;
            listeners.value.forEach((listener) => listener());
            listeners.value = [];
        };
        const fetchMessages = async ({ room, options = {} }) => {
            currentRoom.value = room;
            messages.value = [];
            if (!room.name.includes('DM#')) {
                centrifugo.history(room.roomId, { limit: 30 }).then(
                    function (resp) {
                        resp.publications.forEach((message) => {
                            const formattedMessage = formatMessage(
                                room,
                                message.data.text
                            );
                            messages.value.push(formattedMessage);
                        });

                        messagesLoaded.value = true;
                    },
                    function (err) {
                        console.log('history error', err);
                    }
                );
            } else {
                centrifugo.history('dm:' + username.value, { limit: 100 }).then(
                    function (resp) {
                        resp.publications.forEach((message) => {
                            if (
                                message.data.text.room_id.split(':')[1] ==
                                room.name.split(':')[1]
                            ) {
                                console.log(message);
                                const formattedMessage = formatMessage(
                                    room,
                                    message.data.text
                                );
                                messages.value.push(formattedMessage);
                            }
                        });

                        messagesLoaded.value = true;
                    },
                    function (err) {
                        console.log('history error', err);
                    }
                );
            }
        };
        const formatMessage = (room, message) => {
            console.log(message.timestamp);
            const formattedMessage = {
                ...message,
                ...{
                    senderId: message.sender_id,
                    _id: message.msgId || Date.now(),
                    seconds: message.timestamp.seconds,
                    timestamp: dayjs(message.timestamp).format('HH:mm'),
                    date: dayjs(message.timestamp).format('DD MMMM YYYY'),
                    username: 'message.sender_id',
                    avatar:
                        message.sender_id == username.value
                            ? store.avatar
                            : message.avatar
                            ? message.avatar
                            : null,
                    distributed: true,
                    lastMessage: {
                        ...message.lastMessage,
                        senderId: message.sender_id
                    }
                }
            };
            if (message.replyMessage) {
                formattedMessage.replyMessage = {
                    ...message.replyMessage,
                    ...{
                        senderId: message.replyMessage.sender_id
                    }
                };
            }

            return formattedMessage;
        };
        const fetchMoreRooms = async () => {
            if (endRooms.value && !startRooms.value) {
                roomsLoaded.value = true;
                return;
            }
            rooms.value = [];
            let roomAvatar = 'https://picsum.photos/seed/picsum/200/300';

            currentUserId.value = username.value;

            // console.log('cek queryUserId : ', queryUserId.data[0]._id);

            const formattedRooms = [];
            const tempRooms = [];
            let channelsList = jwt_decode(store.userToken).channels;
            let searchLimit = 50;
            for (let i = 0; i < channelsList.length; i++) {
                if (channelsList[i].includes('dm:') == false) {
                    searchLimit = 1;
                } else {
                    searchLimit = 50;
                }
                
                centrifugo
                    .history(channelsList[i], { limit: searchLimit })
                    .then(
                        function (resp) {
                            if (channelsList[i].includes('dm:') == false) {
                                let room = {
                                    name: 'CH#' + channelsList[i],
                                    roomName: 'CH#' + channelsList[i],
                                    users: [],
                                    id: channelsList[i]
                                };
                                console.log(Array.isArray(roomAvatar)?roomAvatar[0]:roomAvatar)

                                formattedRooms.push({
                                    ...room,
                                    roomId: channelsList[i],
                                    avatar: Array.isArray(store.nftList
  .filter(channel => channel.updateAuthorityAddress === channelsList[i])           // first filter (us any criteria here to select only the books you want)
  .map(channel=> channel.img))?store.nftList
  .filter(channel => channel.updateAuthorityAddress === channelsList[i])           // first filter (us any criteria here to select only the books you want)
  .map(channel=> channel.img)[0]:store.nftList
  .filter(channel => channel.updateAuthorityAddress === channelsList[i])           // first filter (us any criteria here to select only the books you want)
  .map(channel=> channel.img),
                                    index:
                                        resp.publications.length > 0
                                            ? Math.floor(
                                                  resp.publications[0].data
                                                      .timestamp / 1000
                                              )
                                            : Math.floor(Date.now() / 1000),
                                    lastMessage: {
                                        content:
                                            resp.publications.length > 0
                                                ? resp.publications[0].data.text
                                                      .content
                                                : 'No messages yet',
                                        timestamp: formatTimestamp(
                                            new Date(
                                                resp.publications.length > 0
                                                    ? Math.floor(
                                                          resp.publications[0]
                                                              .data.timestamp /
                                                              1000
                                                      )
                                                    : Math.floor(
                                                          Date.now() / 1000
                                                      )
                                            ),
                                            resp.publications.length > 0
                                                ? resp.publications[0].data
                                                      .timestamp
                                                : Date.now()
                                        )
                                    }
                                });
                            } else {
                                for (
                                    let j = 0;
                                    j < resp.publications.length;
                                    j++
                                ) {
                                    let room = {
                                        name:
                                            'DM#' +
                                            resp.publications[j].data.text
                                                .room_id,
                                        roomName:
                                            'DM#' +
                                            resp.publications[j].data.text
                                                .room_id,
                                        users: [],
                                        id: resp.publications[j].data.text
                                            .room_id
                                    };

                                    if (
                                        tempRooms.indexOf(
                                            resp.publications[j].data.text
                                                .room_id == -1
                                        )
                                    ) {
                                        formattedRooms.push({
                                            ...room,
                                            roomId: resp.publications[j].data
                                                .text.room_id,
                                            avatar: 'https://nftstorage.link/ipfs/bafkreifxsugv5u2zb3rg33xy3qqgwi2pl3abcfiorulctlut7jgjokctuu',
                                            index: Math.floor(
                                                Date.now() / 1000
                                            ),
                                            lastMessage: {
                                                content: 'Direct Message',
                                                timestamp: formatTimestamp(
                                                    new Date(
                                                        Math.floor(
                                                            Date.now() / 1000
                                                        )
                                                    ),
                                                    resp.publications.length > 0
                                                        ? resp.publications[0]
                                                              .data.timestamp
                                                        : Date.now()
                                                )
                                            }
                                        });
                                        tempRooms.push(
                                            resp.publications[j].data.text
                                                .room_id
                                        );
                                    }
                                }
                            }

                            if (channelsList.length == i + 1) {
                                rooms.value =
                                    rooms.value.concat(formattedRooms);
                                rooms.value = _.uniq(
                                    rooms.value,
                                    (x) => x.roomId
                                );

                                if (!rooms.value.length) {
                                    loadingRooms.value = false;
                                    roomsLoadedCount.value = 0;
                                }
                            }
                        },
                        function (err) {
                            console.log('history error', err);
                        }
                    );
            }
        };
        // const listenLastMessage = (room) => {};
        const saveGroups = () => {
            centrifugo.disconnect();

            let payload = { contractAddress: collectionsRef.value };
            fetch('https://solana-hackathon-api.supacharge.io:3000/addchannels', {
                method: 'POST',
                body: JSON.stringify(payload),
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + store.userToken
                }
            })
                .then(function (res) {
                    return res.json();
                })
                .then(function (data) {
                    store.storeUserToken(data);
                    centrifugo.disconnect();
                    showModalStart.value = false;
                });
        };
        const handleChange = (e) => {
            checkedValue.value = e.target.value;
            console.log(checkedValue.value);
            store.setAvatar(checkedValue.value);
        };
        const userToken = computed(() => {
            return store.userToken;
        });

        let centrifugo = new Centrifuge(
            'wss://ws.supacharge.io/connection/websocket',
            {
                token: store.userToken
            }
        );
        centrifugo.on('subscribed', function (ctx) {
            // Called when subscribed to a server-side channel upon Client moving to
            // connected state or during connection lifetime if server sends Subscribe
            // push message.
            console.log('subscribed to server-side channel', ctx.channel);
        });

        centrifugo.on('subscribing', function (ctx) {
            // Called when existing connection lost (Client reconnects) or Client
            // explicitly disconnected. Client continue keeping server-side subscription
            // registry with stream position information where applicable.
            console.log('subscribing to server-side channel', ctx.channel);
        });

        centrifugo.on('unsubscribed', function (ctx) {
            // Called when server sent unsubscribe push or server-side subscription
            // previously existed in SDK registry disappeared upon Client reconnect.
            console.log('unsubscribed from server-side channel', ctx.channel);
        });

        centrifugo.on('connected', function (ctx) {});
        centrifugo.on('disconnected', function (ctx) {
            console.log('disconnected', ctx);
        });
        centrifugo.on('publication', function (ctx) {
            //     if(ctx.channel.includes('dm:') == false){
            // let objIndex = rooms.value.findIndex((room => room.roomId == ctx.channel));
            //     rooms.value[objIndex].lastMessage={
            //                     content: ctx.data.text.content,
            //                     timestamp: formatTimestamp(
            //                         new Date(Math.floor(Date.now() / 1000)),
            //                         ctx.data.timestamp
            //                             ? ctx.data.timestamp
            //                             : Date.now()
            //                     )

            //     }
            //     }
               
            //     // Called when server sends Publication over server-side subscription.
            //     if (
            //         ctx.channel == currentRoom.value?.roomId &&
            //         ctx.channel.includes('dm:') == false
            //     ) {
            //         const formattedMessage = formatMessage(
            //             currentRoom.value,
            //             ctx.data.text
            //         );
            //         messages.value.push(formattedMessage);


            //     } else if (ctx.channel == 'dm:' + username.value) {
                 
            //      let objIndex = rooms.value.findIndex((room => room.roomId ==  ctx.data.text.room_id));
            //             if(objIndex==-1){
            //                 let formattedRooms=[]
            //                   let room = {
            //                 name: 'DM#' + ctx.data.text.room_id,
            //                 roomName: 'DM#' + ctx.data.text.room_id,
            //                 users: [],
            //                 id: ctx.data.text.room_id
            //             };
            //                       formattedRooms.push({
            //                 ...room,
            //                 roomId: ctx.data.text.room_id,
            //                 avatar: 'https://nftstorage.link/ipfs/bafkreifxsugv5u2zb3rg33xy3qqgwi2pl3abcfiorulctlut7jgjokctuu',
            //                 index: Math.floor(Date.now() / 1000),
            //                 lastMessage: {
            //                     content: ctx.data.text.content,
            //                     timestamp: formatTimestamp(
            //                         new Date(Math.floor(Date.now() / 1000)),
            //                         ctx.data.timestamp
            //                             ? ctx.data.timestamp
            //                             : Date.now()
            //                     )
            //                 }
            //             });
            //             rooms.value = rooms.value.concat(formattedRooms);
            //             rooms.value = _.uniq(rooms.value, (x) => x.roomId);
            //             }else{
            //                  rooms.value[objIndex].lastMessage={
            //                     content: ctx.data.text.content,
            //                     timestamp: formatTimestamp(
            //                         new Date(Math.floor(Date.now() / 1000)),
            //                         ctx.data.timestamp
            //                             ? ctx.data.timestamp
            //                             : Date.now()
            //                     )

            //             }
            //             }
                        
            //             const formattedMessage = formatMessage(
            //                 currentRoom.value,
            //                 ctx.data.text
            //             );
            //             messages.value.push(formattedMessage);
            //           messagesLoaded.value=true;
                
                    
            //     } else {
            //         console.log('..');
            //     }
            //     console.log(
            //         'publication receive from server-side channel',
            //         ctx.channel,
            //         ctx.data
            //     );
            });
        centrifugo.connect();

        watch(showModalStart, (val) => {
            if (val == false) {
                saveGroups();
            }
        });
        watch(userToken, (newToken) => {
            centrifugo = new Centrifuge(
                'wss://ws.supacharge.io/connection/websocket',
                {
                    token: newToken
                }
            );
            centrifugo.on('subscribed', function (ctx) {
                // Called when subscribed to a server-side channel upon Client moving to
                // connected state or during connection lifetime if server sends Subscribe
                // push message.
                console.log('subscribed to server-side channel', ctx.channel);
            });

            centrifugo.on('subscribing', function (ctx) {
                // Called when existing connection lost (Client reconnects) or Client
                // explicitly disconnected. Client continue keeping server-side subscription
                // registry with stream position information where applicable.
                console.log('subscribing to server-side channel', ctx.channel);
            });

            centrifugo.on('unsubscribed', function (ctx) {
                // Called when server sent unsubscribe push or server-side subscription
                // previously existed in SDK registry disappeared upon Client reconnect.
                console.log(
                    'unsubscribed from server-side channel',
                    ctx.channel
                );
            });

            centrifugo.on('connected', function (ctx) {
                fetchRooms();
            });
            centrifugo.on('disconnected', function (ctx) {
                console.log('disconnected', ctx);
            });
            centrifugo.on('publication', function (ctx) {
                if(ctx.channel.includes('dm:') == false){
            let objIndex = rooms.value.findIndex((room => room.roomId == ctx.channel));
                rooms.value[objIndex].lastMessage={
                                content: ctx.data.text.content,
                                timestamp: formatTimestamp(
                                    new Date(Math.floor(Date.now() / 1000)),
                                    ctx.data.timestamp
                                        ? ctx.data.timestamp
                                        : Date.now()
                                )

                }
                }
               
                // Called when server sends Publication over server-side subscription.
                if (
                    ctx.channel == currentRoom.value?.roomId &&
                    ctx.channel.includes('dm:') == false
                ) {
                    const formattedMessage = formatMessage(
                        currentRoom.value,
                        ctx.data.text
                    );
                    messages.value.push(formattedMessage);
                    messages.value = [...new Map(messages.value.map( o => [JSON.stringify(o), o])).values()];
               
                } else if (ctx.channel == 'dm:' + username.value) {
                 
                 let objIndex = rooms.value.findIndex((room => room.roomId ==  ctx.data.text.room_id));
                        if(objIndex==-1){
                            let formattedRooms=[]
                              let room = {
                            name: 'DM#' + ctx.data.text.room_id,
                            roomName: 'DM#' + ctx.data.text.room_id,
                            users: [],
                            id: ctx.data.text.room_id
                        };
                                  formattedRooms.push({
                            ...room,
                            roomId:  ctx.data.text.room_id,
                            avatar: 'https://nftstorage.link/ipfs/bafkreifxsugv5u2zb3rg33xy3qqgwi2pl3abcfiorulctlut7jgjokctuu',
                            index: Math.floor(Date.now() / 1000),
                            lastMessage: {
                                content: ctx.data.text.content,
                                timestamp: formatTimestamp(
                                    new Date(Math.floor(Date.now() / 1000)),
                                    ctx.data.timestamp
                                        ? ctx.data.timestamp
                                        : Date.now()
                                )
                            }
                        });
                        rooms.value = rooms.value.concat(formattedRooms);
                        rooms.value = _.uniq(rooms.value, (x) => x.roomId);
                        }else{
                             rooms.value[objIndex].lastMessage={
                                content: ctx.data.text.content,
                                timestamp: formatTimestamp(
                                    new Date(Math.floor(Date.now() / 1000)),
                                    ctx.data.timestamp
                                        ? ctx.data.timestamp
                                        : Date.now()
                                )

                        }
                        }
                        
                        const formattedMessage = formatMessage(
                            currentRoom.value,
                            ctx.data.text
                        );
                        messages.value.push(formattedMessage);
                        messages.value = [...new Map(messages.value.map( o => [JSON.stringify(o), o])).values()];

                         messagesLoaded.value=true;

                
                    
                } else {
                    console.log('..');
                }
                console.log(
                    'publication receive from server-side channel',
                    ctx.channel,
                    ctx.data
                );
            });
            centrifugo.connect();
        });
        const collectionList = computed(() => {
            const filterDuplicate = store.nftList.filter(
                (v, i, a) =>
                    a.findIndex((v2) =>
                        ['updateAuthorityAddress'].every((k) => v2[k] === v[k])
                    ) === i
            );
            // return store.nftList;
            return filterDuplicate;
        });
        const channelsList = computed(() => {
            return jwt_decode(store.userToken).channels;
        });

        // const customFrontend = () => {
        //     const getToggle = document.querySelector('.vac-toggle-button');
        //     console.log('cek : getToggle: ', getToggle);
        //     if (getToggle) {
        //         getToggle.onclick = function () {
        //             const getDisplayHidden = document.querySelectorAll(
        //                 '.vac-rooms-container[style*="display: none"]'
        //             );
        //             if (getDisplayHidden.length) {
        //                 const getBtnWallet =
        //                     document.querySelectorAll('.btn-wallet-chat');
        //                 getBtnWallet[0].style.display = 'none';
        //                 const getBtnAdd =
        //                     document.querySelectorAll('.add-room');
        //                 getBtnAdd[0].style.display = 'none';
        //             } else {
        //                 const getBtnWallet =
        //                     document.querySelectorAll('.btn-wallet-chat');
        //                 getBtnWallet[0].style.display = 'block';
        //                 const getBtnAdd =
        //                     document.querySelectorAll('.add-room');
        //                 getBtnAdd[0].style.display = 'block';
        //             }
        //         };
        //     }
        // };

        return {
            collectionList,
            channelsList,
            collectionsSelect: collectionsRef,
            handleUpdateValue(checked) {
                collectionsRef.value = checked;
            },

            refreshList() {
                showSpin.value = true;
                showModalStart.value = false;
                let payload = {};

                fetch('https://solana-hackathon-api.supacharge.io:3000/refreshlist', {
                    method: 'POST',
                    body: JSON.stringify(payload),
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: 'Bearer ' + store.userToken
                    }
                })
                    .then(function (res) {
                        return res.json();
                    })
                    .then(function (data) {
                        for (let j = 0; j < data.nftList.length; j++) {
                            fetch(data.nftList[j].uri).then((res) => {
                                res.json().then((res) => {
                                    data.nftList[j].img = res.image;
                                    if (j + 1 == data.nftList.length) {
                                        store.refreshUser(
                                            data.token,
                                            data.nftList
                                        );
                                        showSpin.value = false;
                                        showModalStart.value = true;
                                    } // this should print the url to console
                                });
                            });
                        }
                    });
            },
            async sendMessage({ content, roomId, files, replyMessage }) {
                currentUserId.value = store.wallet?.publicKey.toBase58();

                const message = {
                    sender_id: currentUserId.value,
                    content,
                    timestamp: new Date(),
                    avatar: store.avatar,
                    room_id: roomId
                };

                if (files) {
                    message.files = this.formattedFiles(files);
                }

                if (replyMessage) {
                    message.replyMessage = {
                        _id: replyMessage._id,
                        content: replyMessage.content,
                        sender_id: replyMessage.senderId
                    };

                    if (replyMessage.files) {
                        message.replyMessage.files = replyMessage.files;
                    }
                }

                let payload = {
                    token: store.userToken,
                    message: message,
                    channelAddress: roomId
                };
                fetch('https://solana-hackathon-api.supacharge.io:3000/sendmessage', {
                    method: 'POST',
                    body: JSON.stringify(payload),
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: 'Bearer ' + store.userToken
                    }
                })
                    .then(function (res) {
                        showModalStart.value=false
                        return res.json();
                    })
                    .then(function (data) {
                        console.log(data);
                    });
            },

            saveGroups,
            collectionsRef,
            showModalStart,
            showSpin,
            username,
            disabledUsername,
            rooms,
            fetchRooms,
            resetRooms,
            resetMessages,
            fetchMoreRooms,
            fetchMessages,
            messages,
            formatMessage,
            messagesLoaded,
            currentUserId,
            currentRoom,
            usernameOptions,
            handleChange,
            checkedValue,
            addressInput,
            processAddressInput,
            inputStatus,
            isSignInButtonDisabled,
            addressInputChange,
            DMRooms,
            handleRemoveAddress,
            tempAddressInput,
            handleRemoveTempAddress,
            tempAddress,
            msgToAddress
        };
    }
});
</script>
<style lang="css">
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

.selection-card .n-card-header {
    border-top-right-radius: 12px;
    border-top-left-radius: 12px;
    background-color: #2169fb;
}

.selection-card-btn-text .n-buttoncontent,
.n-base-icon {
    color: #fff;
}

.selection-card-btn-text:hover {
    color: #fff;
}

.n-tabs.n-tabs--line-type .n-tabs-tab.n-tabs-tab--active {
    color: #2169fb !important;
}

.n-tabs.n-tabs--line-type .n-tabs-tab:hover {
    color: #2169fb !important;
}

.n-tabs .n-tabs-bar {
    background-color: #2169fb;
}
input[type='radio' i] {
    color: #2169fb !important;
}

.n-card {
    border-radius: 12px;
}

div.n-cardcontent {
    border-radius: 12px;
}

.n-button {
    color: #2169fb !important;
}
.selection-card-btn-text .n-button__content,
.n-base-icon {
    color: #fff;
}
</style>