<script>
export default {
    data() {
        return {
            slidebar: false
        }
    },
    props: {
        menuOpen: Boolean,
        user: {
            type: Object,
            required: true
        }
    },
    emits: ["menuClose", "menuOpen", 'renderProfile'],
    methods: {
        openSlidebar() {
            this.slidebar = true
            this.$emit("menuClose");
        },
        closeSlidebar() {
            this.slidebar = false
        },
        openMenu() {
            this.$emit("menuOpen");
        },
        closeMenu(event) {
            if (!event.target.closest(`.menu__avatar`)) {
                this.$emit("menuClose");
            }
        },
        goProfile() {
            this.$router.push(`/profile-` + this.user._id)
        },
        logout() {
            localStorage.clear()
            window.location.href = '/signup'
        }
    }
}
</script>

<template>
    <div class="header-body">
        <header @click="closeMenu">
            <button @click="openSlidebar" class="burger">
                <img src="@/assets/меню.svg" alt="burger" />
            </button>

            <button @click="openMenu" class="menu__avatar">
                <div class="avatar" :style="{
                    backgroundImage: 'url(' + user.avatar + ')',
                    backgroundPosition: 'center center',
                    backgroundSize: 'cover'
                }" :class="{ 'empty-avatar': !user.avatar }"></div>
                <img src="@/assets/down.svg" alt="arrow-down" />
            </button>
        </header>
    </div>

    <aside :class="{
        'open': slidebar
    }" class="slidebar">
        <nav @click="closeSlidebar">
            <a href="/">
                <p class="logotype">Nettler</p>
            </a>

            <div class="slidebar__links">
                <router-link class="slidebar__link" to="/news" active-class="slidebar__link_now">Новости</router-link>
                <router-link class="slidebar__link" to="/dialogs" active-class="slidebar__link_now">Сообщения</router-link>
                <router-link class="slidebar__link" to="/friends" active-class="slidebar__link_now">Друзья</router-link>
                <div class="slidebar__link">Музыка <small style="color: #739199b6">(скоро)</small></div>
                <div class="slidebar__link">Группы <small style="color: #739199b6">(скоро)</small></div>
                <router-link class="slidebar__link" to="/about" active-class="slidebar__link_now">О нас</router-link>
            </div>
        </nav>
    </aside>

    <aside :class="{
        'open': menuOpen
    }" class="menu" @click="closeMenu">
        <nav>
            <a @click.prevent="goProfile()">Профиль</a>
            <router-link to="/settings">Настройки</router-link>
            <a @click.prevent="logout()">Выйти</a>
        </nav>
    </aside>

    <div v-if="slidebar" @click="closeSlidebar" class="dark"></div>
</template>

<style lang="scss" scoped>
$z-index1: 1;
$z-index2: 2;
$z-index3: 3;
$z-index4: 4;
$z-index5: 5;

.header-body {
    margin: 0;
    margin-top: 60px;
    padding: 0;

    user-select: none;
}

header {
    user-select: none;

    z-index: $z-index1;

    position: fixed;
    top: 0;
    left: 0;
    right: 0;

    height: 60px;

    background-color: #98ffff;

    button {
        cursor: pointer;

        background-color: rgba($color: #000000, $alpha: 0);

        border: 1px solid #0005;
        border-radius: 0.375em;

        display: flex;
        justify-content: center;
        align-items: center;

        img {
            width: 20px;
        }
    }

    button.burger {
        position: absolute;
        top: 10px;
        left: 10px;

        width: 40px;
        height: 40px;
    }

    button.menu__avatar {
        border: none;
        display: flex;
        justify-content: center;
        align-items: center;

        width: fit-content;
        height: 40px;

        div.avatar {
            width: 30px;
            height: 30px;
            border-radius: 50%;
        }

        .empty-avatar {
            background-image: url("@/assets/account.svg") !important;
            width: 20px !important;
            height: 20px !important;
            border-radius: 0 !important;
        }

        position: absolute;
        top: 10px;
        right: 10px;
    }
}

.slidebar {
    user-select: none;

    width: 0;
    height: 100vh;

    z-index: $z-index4;

    background-color: #fff;

    position: fixed;
    left: 0;
    top: 0;
    bottom: 0;

    overflow-x: hidden;

    border-right: 0px solid #0003;

    transition: all 1s;


    &.open {
        width: 300px;
    }

    nav {
        a {
            text-decoration: none;
            color: initial;

            .logotype {
                font-family: Arial, Helvetica, sans-serif;
                font-size: 36px;

                padding: 9px;
                padding-left: 20px;
                margin: 0;
                margin-bottom: 5px;

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

                border-bottom: 1px solid #0003;
            }
        }

        .slidebar__links {
            display: flex;
            flex-direction: column;
            justify-content: start;
            align-items: center;

            .slidebar__link {
                width: 100%;

                text-align: start;
                color: black;
                text-decoration: none;
                font-size: 22px;
                white-space: nowrap;

                background-color: rgba($color: #444, $alpha: 0);

                padding: 8px 0 8px 50px;

                &.slidebar__link_now {
                    background-color: #0002;
                }
            }
        }
    }
}

.menu {
    user-select: none;

    z-index: $z-index2;

    background-color: #fff;

    border: 0px solid #0004;
    border-radius: 6px;

    position: fixed;
    right: 14px;
    top: 42px;

    overflow: hidden;

    transition: all 0.5s;

    height: 0;

    nav {
        display: flex;
        flex-direction: column;
        justify-content: start;
        align-items: start;
        gap: 14px;

        padding: 14px 10px;

        a {
            text-decoration: none;
            color: #000;

            font-size: 20px;

            padding: 0 8px;
        }
    }

    &.open {
        height: 124px;
    }
}

.dark {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;

    background: rgba(89, 97, 94, 0.749);
    z-index: $z-index3;
}
</style>