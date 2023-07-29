<script>
import axios from 'axios'
import dayjs from 'dayjs'

export default {
    data() {
        return {
            user: null,
            posFriends: null,
            readyToAdd: true,
            readyToDelete: true
        }
    },
    methods: {
        async loadUser() {
            try {
                let response = await axios.get(`/friends/my`)
                this.user = response.data
            } catch (error) {
                console.log(error)
            }
        },
        async loadPosFriends() {
            try {
                let response = await axios.get('/friends/possible')
                this.posFriends = response.data
            } catch (error) {
                console.log(error)
            }
        },
        async addFriend(item) {
            if (this.readyToAdd) {
                this.readyToAdd = false
                let response = await axios.post(`/addFriend`, {
                    userFriendId: item._id
                })

                if (response.status == 200) {
                    await this.loadPosFriends()
                    await this.loadUser()
                }
                this.readyToAdd = true
            }
        },
        async deleteFriend(item) {
            if (this.readyToDelete) {
                this.readyToDelete = false
                let response = await axios.post(`/deleteFriend`, {
                    userFriendId: item._id
                })

                if (response.status == 200) {
                    await this.loadPosFriends()
                    await this.loadUser()
                }
                this.readyToDelete = true
            }
        },
        goProfile(item) {
            this.$router.push("/profile-"+item._id)
        }
    },
    async created() {
        await this.loadUser()
        await this.loadPosFriends()
    }
}
</script>

<template>
    <div v-if="user && posFriends">
        <section class="friends__body">
            <h2>Друзья</h2>

            <div class="friends__list">
                <div class="friends__friend" v-for="(item, index) in user.friends">
                    <div class="friend__info" @click="goProfile(item)">
                        <div class="chat__avatar" :style="{
                            backgroundImage: 'url(' + item.avatar + ')',
                            backgroundPosition: 'center center',
                            backgroundSize: 'cover'
                        }" :class="{ 'empty-avatar': !item.avatar }"></div>

                        <p v-html="item.username"></p>
                    </div>

                    <div class="friend__buttons">
                        <button>
                            <img src="@/assets/cross.svg" v-if="readyToDelete" @click="deleteFriend(item)" alt="delete friend" />
                            <img src="@/assets/loading.gif" v-else>
                        </button>
                        <button><router-link to="/dialogs"><img src="@/assets/typing.png" alt="add friend" /></router-link></button>
                    </div>
                </div>
            </div>
        </section>

        <section class="possible-friends__body">
            <h2>Возможные друзья</h2>

            <div class="friends__list">
                <div class="friends__friend" v-for="(item, index) in posFriends">
                    <div class="friend__info" @click="goProfile(item)">
                        <div class="chat__avatar" :style="{
                            backgroundImage: 'url(' + item.avatar + ')',
                            backgroundPosition: 'center center',
                            backgroundSize: 'cover'
                        }" :class="{ 'empty-avatar': !item.avatar }"></div>

                        <p v-html="item.username"></p>
                    </div>

                    <div class="friend__buttons">
                        <button>
                            <img @click="addFriend(item)" v-if="readyToAdd" src="@/assets/addfriend.svg" alt="add friend" />
                            <img src="@/assets/loading.gif" v-else>
                        </button>
                    </div>
                </div>
            </div>
        </section>
    </div>
</template>

<style lang="scss" scoped>
.friends__body {
    h2 {
        font-weight: normal;
        text-align: center;

        padding: 10px;
        margin: 0;

        border-bottom: 1px solid #000;
    }
}

.possible-friends__body {
    margin-top: 50px;

    h2 {
        font-weight: normal;
        text-align: center;

        padding: 10px;
        margin: 0;

        border-bottom: 1px solid #000;
    }
}

.friends__friend {
    cursor: pointer;

    transition: all 0.5s;

    z-index: 0;

    padding: 5px;
    margin: 0 7px;

    display: flex;
    justify-content: space-between;
    align-items: center;

    border-bottom: 1px solid #0004;

    overflow: hidden;

    .friend__info {
        display: flex;
        align-items: center;
        gap: 15px;

        div {
            width: 50px;
            height: 50px;

            border-radius: 50%;
        }

        p {
            font-size: 18px;
        }

        
        .empty-avatar {
            background-image: url("@/assets/empty account.svg") !important;
        }
    }

    button {
        margin-right: 10px;

        border-radius: 0.375rem;
        border: 1px dashed #0003;

        cursor: pointer;

        background-color: #fff;

        &:hover {
            border: 1px solid #000;
        }

        img {
            height: 24px;
        }
    }
}
</style>