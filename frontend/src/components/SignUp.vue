<script>
import axios from 'axios'

export default {
    data() {
        return {
            username: "",
            password: "",
            email: "",
            rulesChecked: false,
            error: null,
            userCount: 0
        }
    },
    methods: {
        async loadUsersCount() {
            let response = await axios.get(`/find/user/length`)
            this.userCount = response.data.length
        },
        async newUser() {
            if (this.rulesChecked) {
                try {
                    let response = await axios.post(`/signup`, {
                        username: this.username,
                        password: this.password,
                        email: this.email
                    })
                    
                    localStorage.token = response.data.accessToken
                    
                    this.$router.go()
                } catch (error) {
                    console.log(error)
                    let status = error.response.status
                    if (status == 403) {
                        this.error = "Пароль должен быть больше 4 символов"
                    } else if (status == 405) {
                        this.error = "Вы не ввели никнейм или почту"
                    } else if (status == 409) {
                        this.error = "Никнейм занят"
                    } else if (status == 410) {
                        this.error = "Ошибка. Повторите попытку"
                    } 
                }

            } else {
                this.error = "Необходимо принять условия"
            }
        }
    },
    mounted() {
        this.loadUsersCount()
    }
}
</script>

<template>
    <div class="wrapper">
        <form @submit.prevent="newUser">
            <h2>Регистрация в <span class="logotype">Nettler</span></h2>
            <p>На Nettler уже {{ userCount }} пользователей </p>
            <p>Почему вы ещё не с нами?</p>

            <input type="text" v-model="email" class="input username" placeholder="Эл. почта" />
            <input type="text" v-model="username" class="input username" placeholder="Никнейм" />
            <input type="text" v-model="password" class="input password" placeholder="Пароль" />

            <div class="terms">
                <div class="cntr">
                    <input type="checkbox" id="cbx" class="hidden-xs-up" v-model="rulesChecked" />
                    <label for="cbx" class="cbx"></label>
                </div>
                <small>Принимаю <router-link to="/rules">условия использования</router-link></small>
            </div>

            <button type="submit">
                <span class="text">Зарегистрироваться</span>
            </button>

            <small class="no-account">Есть аккаунт? <router-link to="/login">Войти</router-link></small>

            <small v-if="error" class="error">{{ error }}</small>
        </form>
    </div>
</template>


<style lang="scss" scoped>
div.wrapper {
    width: 100vw;
    height: 100vh;

    margin: 0;
    padding: 0;

    display: flex;
    justify-content: center;

    color: black;

    background: round url("src/assets/background.jfif");
    background-color: #fff;

    display: flex;
    justify-content: center;
    align-items: center;

    form {
        font-family: "Montserrat";

        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;

        background-color: #fff;
        box-shadow: 0 0 10px #000;

        border-radius: 0.5rem;

        width: 320px;
        height: fit-content;

        padding-bottom: 10px;

        h2 {
            margin-bottom: 4px;
        }

        p {
            font-size: 14px;
            margin: 0;
        }

        span.logotype {
            margin: 0;

            animation-name: page-cover;
            animation-duration: 10s;
            animation-timing-function: linear;
            animation-iteration-count: 999;
            animation-direction: alternate;

            @keyframes page-cover {
                0% {
                    color: rgb(255, 0, 0);
                }

                25% {
                    color: rgb(188, 255, 2);
                }

                50% {
                    color: rgb(187, 255, 0);
                }

                75% {
                    color: rgb(0, 221, 255);
                }

                100% {
                    color: rgb(244, 33, 255);
                }
            }
        }

        .terms {
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 6px;

            margin: 20px 0 0 0;
        }

        a {
            text-decoration: none;
            color: blue;
        }

        small {
            padding: 0;
            margin: 0;

            &:nth-child(2) {
                font-size: 12px;
            }
        }

        .error {
            text-align: center;
            color: red;

            margin-top: 20px;

            border-radius: 0.25em;
            border: 1px solid red;
            width: 300px;
            padding: 10px 0;
            background-color: rgba($color: #ff0000, $alpha: 0.15);
        }

        .no-account {
            margin: 20px 0;
        }
    }

    .cbx {
        position: relative;
        top: 1px;
        width: 17px;
        height: 17px;
        border: 1px solid #c8ccd4;
        border-radius: 3px;
        -webkit-transition: background 0.1s ease;
        transition: background 0.1s ease;
        cursor: pointer;
        display: block;
    }

    .cbx:after {
        content: "";
        position: absolute;
        top: 2px;
        left: 6px;
        width: 4px;
        height: 8px;
        opacity: 0;
        -webkit-transform: rotate(45deg) scale(0);
        -ms-transform: rotate(45deg) scale(0);
        transform: rotate(45deg) scale(0);
        border-right: 2px solid #fff;
        border-bottom: 2px solid #fff;
        -webkit-transition: all 0.3s ease;
        transition: all 0.3s ease;
        -webkit-transition-delay: 0.15s;
        transition-delay: 0.15s;
    }

    .lbl {
        margin-left: 5px;
        vertical-align: middle;
        cursor: pointer;
    }

    #cbx:checked~.cbx {
        border-color: transparent;
        background: #6871f1;
        -webkit-animation: jelly 0.6s ease;
        animation: jelly 0.6s ease;
    }

    #cbx:checked~.cbx:after {
        opacity: 1;
        -webkit-transform: rotate(45deg) scale(1);
        -ms-transform: rotate(45deg) scale(1);
        transform: rotate(45deg) scale(1);
    }

    .cntr {
        position: relative;
    }

    @-webkit-keyframes jelly {
        from {
            -webkit-transform: scale(1, 1);
            transform: scale(1, 1);
        }

        30% {
            -webkit-transform: scale(1.25, 0.75);
            transform: scale(1.25, 0.75);
        }

        40% {
            -webkit-transform: scale(0.75, 1.25);
            transform: scale(0.75, 1.25);
        }

        50% {
            -webkit-transform: scale(1.15, 0.85);
            transform: scale(1.15, 0.85);
        }

        65% {
            -webkit-transform: scale(0.95, 1.05);
            transform: scale(0.95, 1.05);
        }

        75% {
            -webkit-transform: scale(1.05, 0.95);
            transform: scale(1.05, 0.95);
        }

        to {
            -webkit-transform: scale(1, 1);
            transform: scale(1, 1);
        }
    }

    @keyframes jelly {
        from {
            -webkit-transform: scale(1, 1);
            transform: scale(1, 1);
        }

        30% {
            -webkit-transform: scale(1.25, 0.75);
            transform: scale(1.25, 0.75);
        }

        40% {
            -webkit-transform: scale(0.75, 1.25);
            transform: scale(0.75, 1.25);
        }

        50% {
            -webkit-transform: scale(1.15, 0.85);
            transform: scale(1.15, 0.85);
        }

        65% {
            -webkit-transform: scale(0.95, 1.05);
            transform: scale(0.95, 1.05);
        }

        75% {
            -webkit-transform: scale(1.05, 0.95);
            transform: scale(1.05, 0.95);
        }

        to {
            -webkit-transform: scale(1, 1);
            transform: scale(1, 1);
        }
    }

    .hidden-xs-up {
        display: none !important;
    }

    .input {
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif;
        font-weight: 500;
        font-size: 16px;
        color: #000;
        background-color: #fff;
        box-shadow: 0 0 0.4vw rgba(0, 0, 0, 0.5), 0 0 0 0.15vw transparent;
        border-radius: 0.4vw;
        border: none;
        outline: none;
        padding: 8px;
        min-width: 250px;
        max-width: 350px;
        transition: 0.4s;

        margin-top: 10px;
    }

    .input:hover {
        box-shadow: 0 0 0 0.15vw rgba(135, 207, 235, 0.186);
    }

    .input:focus {
        box-shadow: 0 0 0 0.15vw skyblue;
    }

    button {
        margin-top: 40px;
        align-items: center;
        background-image: linear-gradient(144deg, #af40ff, #5b42f3 50%, #00ddeb);
        border: 0;
        border-radius: 8px;
        box-shadow: rgba(151, 65, 252, 0.2) 0 15px 30px -5px;
        box-sizing: border-box;
        color: #000;
        display: flex;
        font-family: Phantomsans, sans-serif;
        font-size: 16px;
        justify-content: center;
        line-height: 1em;
        max-width: 100%;
        min-width: 140px;
        padding: 3px;
        text-decoration: none;
        user-select: none;
        -webkit-user-select: none;
        touch-action: manipulation;
        white-space: nowrap;
        cursor: pointer;
        transition: all 0.3s;
        box-sizing: border-box;

        span {
            background-color: #bbf;
            border-radius: 6px;
            padding: 8px 18px;
            box-sizing: border-box;
            width: 100%;
            height: 100%;
            transition: 300ms;
        }
    }

    button:hover span {
        background: none;
        color: #fff;
    }

    button:active {
        transform: scale(0.9);
    }
}
</style>