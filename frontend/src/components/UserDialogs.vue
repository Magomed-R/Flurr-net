<script>
import axios from 'axios'
import dayjs from 'dayjs'

export default {
    data() {
        return {
            user: null,
            chatOpen: false,
            messages: [],
            nowOpen: 0,
            draft: ''
        }
    },
    methods: {
        async loadDialogs() {
            try {
                let response = await axios.get(`/dialog/all`)

                this.user = response.data
            } catch (error) {
                console.log(error)
            }
        },
        openChat(index) {
            this.chatOpen = true
            this.nowOpen = index
            this.messages = this.user.chats[this.nowOpen].messages
        },
        closeChat() {
            this.chatOpen = false
            this.draft = ''
        },
        async newMessage() {
            try {
                let response = await axios.post(`/dialog/newMessage`, {
                    chatId: this.user.chats[this.nowOpen]._id,
                    message: this.draft
                })

                if (response.status == 200) {
                    this.draft = ''
                    await this.loadDialogs()
                }
            } catch (error) {
                console.log(error)
            }
        },
        getFriend(item) {
            return (item.members.filter(member => { return member._id != this.user._id }))[0]
        },
        goProfile(item) {
            this.$router.push("/profile-" + item._id)
        },
        getTime(item) {
            let date = dayjs(item.createdAt)
            return date.format('HH:mm')
        }
    },
    created() {
        this.loadDialogs()

        setInterval(() => {
            this.loadDialogs()
        }, 20000)
    }
}
</script>

<template>
    <div class="main" v-if="user">
        <div class="alert" v-if="user.chats.length == 0">
            <p>Новых сообщений нет</p>
            <p>Перейдите в "Друзья", чтобы завести новых друзей и начать переписку</p>
        </div>

        <section class="main__chats" :class="{
            'chatOpen': !chatOpen
        }">
            <div v-for="(item, index) in user.chats" class="main__chat" @click="openChat(index)" :key="item._id">
                <div class="main__user">
                    <div class="chat__avatar" :style="{
                        backgroundImage: 'url(' + getFriend(item).avatar + ')',
                        backgroundPosition: 'center center',
                        backgroundSize: 'cover'
                    }" :class="{ 'empty-avatar': !getFriend(item).avatar }"></div>

                    <p>{{ getFriend(item).username }}</p>
                </div>

                <img src="@/assets/arrow-right.png" alt="стрелка" />
            </div>
        </section>

        <section v-if="user.chats.length" class="main__open" :class="{
            'chatOpen': chatOpen
        }">
            <div class="main__header">
                <img src="@/assets/arrow-right.png" alt="arrow" class="main__back" @click="closeChat" />

                <div class="main__info" @click="goProfile(getFriend(user.chats[nowOpen]))">
                    <div class="avatar" :style="{
                        backgroundImage: 'url(' + getFriend(user.chats[nowOpen]).avatar + ')',
                        backgroundPosition: 'center center',
                        backgroundSize: 'cover'
                    }" :class="{ 'empty-avatar': !getFriend(user.chats[nowOpen]).avatar }"></div>

                    <span v-html="getFriend(user.chats[nowOpen]).username"></span>
                </div>
            </div>

            <div class="main__dialog">
                <p class="main__message" v-for="(item, index) in user.chats[nowOpen].messages" :class="{
                    'main__message_fromme': user.username == item.from
                }"><span v-html="item.message"></span><span class="message__time">{{ getTime(item) }}</span></p>
            </div>

            <div class="main__footer">
                <form @submit.prevent="newMessage()">
                    <input v-model="draft" type="text" />

                    <button type="submit">
                        <img src="@/assets/send.svg" alt="arrow send" />
                    </button>
                </form>
            </div>
        </section>
    </div>
</template>

<style lang="scss" scoped>
.main {
    display: flex;
    justify-content: space-between;

    min-height: 100%;

    .alert {
        p {
            width: 100vw;
            text-align: center;
        }
    }

    .main__chats {
        transition: all 0.5s;

        white-space: nowrap;

        width: 0;
        height: calc(100vh - 60px);

        overflow-y: scroll;

        z-index: 0;

        display: flex;
        flex-direction: column;

        gap: 4px;

        .main__chat {
            z-index: 0;

            padding: 5px;
            margin: 0 7px;

            display: flex;
            justify-content: space-between;
            align-items: center;

            border-bottom: 1px solid #0004;

            .main__user {
                display: flex;
                align-items: center;
                gap: 15px;

                cursor: pointer;

                div.chat__avatar {
                    width: 50px;
                    height: 50px;

                    border-radius: 50%;
                }

                .empty-avatar {
                    background-image: url("@/assets/empty account.svg") !important;
                }

                p {
                    font-size: 18px;
                }
            }

            img:last-child {
                height: 24px;

                padding-right: 10px;
            }
        }
    }

    .main__open {
        position: relative;

        display: flex;
        flex-direction: column;

        width: 0;

        transition: all 0.5s;

        user-select: text;

        overflow: hidden;

        .main__header {
            display: flex;
            align-items: center;

            padding: 6px 0;

            border-bottom: 1px solid #0004;

            background-color: #fff;

            box-shadow: 0 3px 6px #0003;

            img.main__back {
                transform: rotate(180deg);

                height: 26px;

                padding: 5px 10px 5px 0;
            }

            .main__info {
                display: flex;
                justify-content: center;
                align-items: center;
                gap: 8px;

                .avatar {
                    width: 50px;
                    height: 50px;

                    border-radius: 50%;
                }

                span {
                    font-size: 20px;
                }

                .empty-avatar {
                    background-image: url("@/assets/empty account.svg") !important;
                }
            }
        }

        .main__dialog {
            display: flex;
            flex-direction: column;

            flex-grow: 1;

            overflow: hidden;
            overflow-y: scroll;

            width: 100vw;
            height: calc(100vh - 169px);

            margin-bottom: 46px;

            p.main__message {
                min-width: 36px;
                width: fit-content;
                max-width: 320px;

                padding: 10px;
                padding-bottom: 18px;
                margin: 10px;

                background-color: #aafd7e;

                border: 1px solid #62ff00;
                border-radius: 0.5rem 0.5rem 0.5rem 0;

                word-break: break-word;

                position: relative;

                &_fromme {
                    align-self: end;

                    background-color: #7edefe;

                    border: 1px solid #00d5ff;

                    border-radius: 0.5rem 0.5rem 0 0.5rem;
                }

                span.message__time {
                    position: absolute;
                    bottom: 0;
                    right: 0;

                    font-size: 10px;
                    white-space: nowrap;

                    padding: 4px;
                }

                img,
                iframe,
                video,
                audio {
                    max-width: 100%;
                }
            }
        }

        .main__footer {
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;

            z-index: 2;

            background-color: #fff;

            box-shadow: 0 -2px 2px #0003;

            form {
                display: flex;
                align-items: center;
                gap: 5px;

                border-top: 1px solid #0003;

                input {
                    width: 100%;

                    padding: 8px 12px;
                    margin: 3px;

                    font-size: 20px;

                    border: none;

                    flex-grow: 1;

                    &:focus {
                        outline: none;
                    }
                }

                button {
                    border: none;

                    background-color: #fff;

                    img {
                        height: 24px;
                    }
                }


                &:hover {
                    border-top: 1px solid #0ff;
                }
            }
        }
    }

    .chatOpen {
        width: 100%;
    }
}
</style>