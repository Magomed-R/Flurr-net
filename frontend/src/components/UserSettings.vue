<script>
import axios from 'axios'
import dayjs from 'dayjs'

export default {
    data() {
        return {
            user: null,
            error: false
        }
    },
    methods: {
        async loadUser() {
            let response = await axios.get(`/find/me`)
            this.user = response.data
            this.user.birthday = dayjs(this.user.birthday).format('YYYY-MM-DD')
        },
        async saveSettings () {
            try {
                this.error = false

                let response = await axios.post(`/settings/new`, {user: this.user})

                if (response.status == 200) {
                    this.$router.replace("/profile-"+this.user._id)
                }
            } catch (error) {
                let status = error.response.status

                if (status == 403) {
                    this.error = true
                }
            }
        }
    },
    created() {
        this.loadUser()
    }
}
</script>

<template>
    <div class="main" v-if="user">
        <div class="main__info">
            <div class="info__avatar">
                <div class="avatar__image" :style="{
                    backgroundImage: 'url(' + user.avatar + ')',
                    backgroundPosition: 'center center',
                    backgroundSize: 'cover'
                }" :class="{ 'empty-avatar': !user.avatar }"></div>
            </div>
            <div class="user__info">
                <input v-model="user.username" type="text" class="username" :class="{'error': error}">
                <input v-model="user.avatar" type="text" class="avatar__input">
            </div>
        </div>
        <div class="basic-input">
            <p>Дата рождения</p>
            <input type="date" v-model="user.birthday">
        </div>
        <div class="basic-input">
            <p>Email</p>
            <input type="text" placeholder="example@mail.ru" v-model="user.email">
        </div>
        <div class="gender__info">
            <p>Пол</p>
            <div class="gender">
                <label>Не указывать<input type="radio" value="" v-model="user.gender"></label>
                <label>Мужской<input type="radio" value="male" v-model="user.gender"></label>
                <label>Женский<input type="radio" value="female" v-model="user.gender"></label>
            </div>
        </div>
        <div class="aboutme">
            <p>О себе</p>
            <textarea v-model="user.aboutme"></textarea>
        </div>
        <button @click="saveSettings()">Сохранить</button>
    </div>
</template>

<style lang="scss" scoped>
.main {
    margin: 20px;

    .main__info {
        display: flex;
        align-items: center;
        gap: 20px;

        .info__avatar {
            flex-grow: 1;

            background-color: #fff;

            border: 4px solid #fff;

            margin: 16px 0;
            padding: 0;

            .avatar__image {
                height: 80px;
                width: 80px;

                border-radius: 50%;
            }
        }

        .user__info {
            display: flex;
            flex-direction: column;
            gap: 10px;

            text-align: center;

            width: 100%;

            margin: 16px 0;

            flex-grow: 2;

            input {
                padding: 8px;

                border: 1px solid #0004;
                border-radius: .5rem;

            }

            input:focus-visible {
                border: 1px solid #00a6ff;
                outline: none;
            }

            .error {
                border: 1px solid #ff0000;
            }
        }

        .empty-avatar {
            background-image: url("@/assets/empty account.svg") !important;
        }
    }

    .basic-input {
        margin: 20px 0;

        input {
            width: calc(100% - 16px);
            padding: 8px;

            border: 1px solid #0004;
            border-radius: .5rem;

        }

        input:focus-visible {
            border: 1px solid #00a6ff;
            outline: none;
        }
    }

    .gender__info {
        margin: 20px 0;

        .gender {
            width: 100%;

            display: flex;
            flex-wrap: nowrap;

            label {
                display: flex;
                align-items: center;
                justify-content: center;

                border: 1px solid #0004;

                font-size: 12px;
                white-space: nowrap;

                padding: 6px;
                flex-grow: 1;

                &:first-child {
                    border-radius: .5rem 0 0 .5rem;
                }

                &:last-child {
                    border-radius: 0 .5rem .5rem 0;
                }

                &:hover {
                    border: 1px solid #00a6ff;
                }
            }
        }

    }

    .aboutme {
        margin: 20px 0;

        textarea {
            width: calc(100% - 16px);
            min-height: 70px;

            padding: 8px;

            border: 1px solid #0004;
            border-radius: .5rem;

        }

        textarea:focus-visible {
            border: 1px solid #00a6ff;
            outline: none;
        }
    }

    button {
        width: 100%;

        padding: 8px;

        background-color: #00a6ffa3;

        border: none;
        border-radius: .5rem;

        cursor: pointer;

        &:active {
            background-color: #00a6ff;

        }
    }
}
</style>