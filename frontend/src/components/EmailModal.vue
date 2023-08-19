<script>
import axios from "axios";

export default {
    data() {
        return {
            mail: "",
            error: false
        };
    },
    methods: {
        async saveEmail() {
            try {
                let {status} = await axios.post("/addEmail", {
                    email: this.mail,
                });

                if (status == 200) {
                    this.$emit('close')
                }
            } catch (error) {
                let status = error.response.status

                if (status == 405) {
                    this.error = true
                }
            }
        },
    },
    props: {
        show: Boolean
    }
};
</script>

<template>
    <div>
        <div class="dark"></div>
        <div class="modal">
            <button class="modal-close-button" @click="$emit('close')">
                <img src="/src/assets/close.svg" alt="close button" class="close" />
            </button>
            <p class="text">Введите почту для получения уведомлений</p>
            <form @submit.prevent="saveEmail">
                <input type="text" placeholder="example@mail.ru" v-model="mail" :class="{
                    'error': error
                }" />
                <button type="submit">Сохранить</button>
            </form>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.dark {
    background-color: #0009;

    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;

    width: 100vw;
    height: 100vh;
}

.modal {
    width: 320px;
    height: 150px;

    position: fixed;
    top: 40%;
    left: calc(50% - 160px);

    background-color: #fff;

    border-radius: 0.4em;
    .modal-close-button {
        position: absolute;
        top: 10px;
        right: 10px;

        .close {
            width: 20px;
        }
    }

    .text {
        margin: 14px;
    }

    form {

        input {
            position: absolute;
            top: 50px;

            width: 280px;

            margin: 12px;
            padding: 8px;

            border: 1px solid #000;
            border-radius: 0.375em;
        }

        .error {
            outline: 2px dashed red;
            outline-offset: 2px;
        }

        button {
            background-color: lightgreen;
            
            border: none;
            border-radius: 0.375em 0 0.375em 0;

            position: absolute;
            right: 0;
            bottom: 0;

            font-size: 18px;
            padding: 10px;
        }
    }
}
</style>
