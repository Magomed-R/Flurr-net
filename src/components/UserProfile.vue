<script>
import axios from 'axios'

import dayjs from 'dayjs';

export default {
    data() {
        return {
            userProfile: null,
            user: null,
            localStorage: localStorage,
            readyToAdd: true
        }
    },
    methods: {
        async loadUserProfile() {
            let response = await axios.get(`/find/user`, { params: { id: this.$route.params.id } })
            this.userProfile = response.data
        },
        async loadUser() {
            let response = await axios.get(`/find/me`)
            this.user = response.data
        },
        getAge() {
            let day = dayjs()
            let fullBirthday = dayjs(this.userProfile.birthday)
            let birthday = fullBirthday.format('YYYY')
            return day.format('YYYY') - birthday
        },
        getAgeWord(number) {
            let declension = ['год', 'года', 'лет'];
            let cases = [2, 0, 1, 1, 1, 2];
            return declension[((number % 100 > 4 && number % 100 < 20) ? 2 : cases[(number % 10 < 5) ? number % 10 : 5])];
        },
        async addFriend() {
            if (this.readyToAdd) {
                this.readyToAdd = false
                let response = await axios.post(`/addFriend`, {
                    userId: this.user._id,
                    userFriendId: this.userProfile._id
                })

                if (response.status == 200) {
                    await this.loadUserProfile()
                    await this.loadUser()
                }
                this.readyToAdd = true
            }
        },
        goDialogs() {
            this.$router.push("/dialogs")
        }
    },
    async created() {
        await this.loadUserProfile()
        await this.loadUser()
    },
    watch: {
        $route() {
            if (this.$route.name == "profile") {
                this.loadUserProfile()
            }
        }
    }
}
</script>

<template>
    <section class="info__body" v-if="user && userProfile">
        <div class="info__page-cover"></div>
        <div class="info__data">
            <div class="info__avatar" :style="{
                backgroundImage: 'url(' + userProfile.avatar + ')',
                backgroundPosition: 'center center',
                backgroundSize: 'cover'
            }" :class="{ 'empty-avatar': !userProfile.avatar }"></div>
            <div class="info__username">
                <h2 v-html="userProfile.username"></h2><img v-if="userProfile.gender"
                    :src="(userProfile.gender == 'male') ? 'https://i.ibb.co/SPbnhrg/male.png' : 'https://i.ibb.co/dfd5JYp/female.png'">
            </div>
            <button v-if="!(userProfile._id == user._id) && !(user.friends.includes(userProfile._id))"
                @click="addFriend()">
                <img v-if="readyToAdd" src="@/assets/addfriend.svg" alt="add friend">
                <img v-else src="@/assets/loading.gif" alt="add friend">
            </button>
            <button v-if="!(userProfile._id == user._id) && (user.friends.includes(userProfile._id))"
                @click="goDialogs()">
                <img src="@/assets/typing.png" alt="go dialog">
            </button>
        </div>

        <div class="info__age">
            <p>Возраст:
                <span v-if="userProfile.birthday">{{ getAge() }} {{ getAgeWord(getAge()) }}</span>
                <span v-else>Не указан</span>
            </p>
        </div>
        <div class="info__about-me">
            <h5>О себе</h5>
            <p v-html="userProfile.aboutme"></p>
        </div>
    </section>
</template>

<style lang="scss" scoped>
main {
    min-width: 100%;
    min-height: 100%;

    display: block;

    .info__body {
        .info__page-cover {
            width: 100%;
            height: 100px;

            background: linear-gradient(1.1turn, #c7b1fd, #f6b8ff, #e7ffd5, #affffc, #99ffcc);
            background-size: 300% 300%;
            animation: back 14s infinite alternate;

            @keyframes back {
                25% {
                    background-position: 0 50%;
                }

                50% {
                    background-position: 100% 50%;
                }

                100% {
                    background-position: 0 50%;
                }
            }

            z-index: 0;
        }

        .info__data {
            display: flex;
            align-items: end;

            border-radius: 0 0 1rem 1rem;
            border-bottom: 1px solid #0005;

            position: relative;
            bottom: 48px;

            .info__avatar {
                padding: 3px;
                margin: 10px;

                height: 80px;
                width: 80px;

                overflow: hidden;

                border-radius: 50%;

                background-color: #fff;

                border: 4px solid #fff;
            }

            .empty-avatar {
                background-image: url("@/assets/empty account.svg") !important;
            }

            .info__username {
                display: flex;
                align-items: center;
                gap: 5px;

                img {
                    height: 2rem;
                }
            }

            button {
                background-color: #fff;

                margin: 0.83em 0.83em 0.83em auto;
                font-size: 1.5em;

                border: 1px dashed #0006;
                border-radius: 0.375rem;

                cursor: pointer;

                &:hover {
                    border-style: solid;
                }

                img {
                    height: 20px;
                }
            }
        }

        .info__age {
            padding: 14px 18px;

            border-bottom: 1px solid #0005;
            border-radius: 0 0 1rem 1rem;

            position: relative;
            bottom: 48px;

            p {
                padding: 0;
                margin: 0 0 5px 0;

                font-size: 16px;
                font-weight: 550;

                color: #0007;

                span {
                    padding: 4px 0;
                    margin: 0;

                    font-size: 18px;

                    color: #000;
                }
            }
        }

        .info__about-me {
            padding: 14px 18px;

            border-bottom: 1px solid #0005;
            border-radius: 0 0 1rem 1rem;

            position: relative;
            bottom: 48px;

            box-shadow: 0px 3px 4px #0005;

            h5 {
                padding: 0;
                margin: 0;

                font-size: 16px;
                font-weight: 550;

                color: #0007;
            }

            p {
                padding: 5px 0;
                margin: 0;

                font-size: 18px;

                word-wrap: break-word;
            }
        }
    }
}
</style>