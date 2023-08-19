<script>
import axios from "axios";
import dayjs from "dayjs";
let day = dayjs();

import EmailModal from "./components/EmailModal.vue";

export default {
    data() {
        return {
            user: null,
            menuOpen: false,
            dataLoaded: false,
            showModal: true,
        };
    },
    methods: {
        async loadUser() {
            try {
                let response = await axios.get(`/find/me`);
                this.user = response.data;
            } catch (error) {
                console.log(error);
            }
        },
        closeMenu() {
            this.menuOpen = false;
        },
        openMenu() {
            this.menuOpen = true;
        },
        closeModal() {
            this.showModal = false
        }
    },
    async created() {
        if (localStorage.token) {
            await this.loadUser();
            this.dataLoaded = true;
        }
    },
    components: {
        EmailModal,
    },
};
</script>

<template>
    <p class="loading" v-if="!dataLoaded &&
        $route.name != 'login' &&
        $route.name != 'signup' &&
        $route.name != 'rules'
        ">
        <img src="@/assets/loading.gif" />
    </p>

    <Teleport to="body" v-if="dataLoaded">
        <email-modal v-if="!user.email && showModal" @close="closeModal" :show="showModal" />
    </Teleport>

    <router-view name="auth" />
    <header v-if="dataLoaded">
        <router-view name="header" :user="user" :menuOpen="menuOpen" @menuOpen="openMenu"
            @menuClose="closeMenu"></router-view>
    </header>

    <main @click="closeMenu" v-if="dataLoaded">
        <router-view name="main" :user="user" />
    </main>
</template>

<style lang="scss">
html {
    font-family: "Montserrat";
    overflow-x: hidden;

    body {
        margin: 0;
        padding: 0;

        .loading {
            display: flex;
            justify-content: center;
            align-items: center;

            height: 100vh;
        }
    }

    img {
        user-zoom: none;
        -webkit-user-drag: none;
        user-select: none;
        -moz-user-select: none;
        -webkit-user-select: none;
        -ms-user-select: none;
    }
}
</style>
