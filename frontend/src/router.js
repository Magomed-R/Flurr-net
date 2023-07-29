import { createRouter, createWebHistory } from "vue-router";
import axios from "axios";
axios.defaults.baseURL = import.meta.env.VITE_SERVER_URL || "http://localhost:3010";
axios.defaults.headers.common["Content-type"] = "application/json";

import AppHeader from "./components/AppHeader.vue";
import UserDialogs from "./components/UserDialogs.vue";
import AllNews from "./components/AllNews.vue";
import LogIn from "./components/LogIn.vue";
import SignUp from "./components/SignUp.vue";
import UserProfile from "./components/UserProfile.vue";
import NewsComments from "./components/NewsComments.vue";
import FriendsPage from "./components/FriendsPage.vue";
import RulesPage from "./components/RulesPage.vue";
import UserSettings from "./components/UserSettings.vue";
import AboutUs from "./components/AboutUs.vue";

const routes = [
    {
        path: "/login",
        name: "login",
        components: {
            auth: LogIn
        }
    },
    {
        path: "/signup",
        name: "signup",
        components: {
            auth: SignUp
        }
    },
    {
        path: "/rules",
        name: "rules",
        components: {
            auth: RulesPage
        }
    },
    {
        path: "/news",
        name: "news",
        components: {
            header: AppHeader,
            main: AllNews
        },
        meta: {
            requiresAuth: true
        }
    },
    {
        path: "/news-:id",
        name: "comments",
        components: {
            header: AppHeader,
            main: NewsComments
        },
        meta: {
            requiresAuth: true
        }
    },
    {
        path: "/dialogs",
        name: "dailogs",
        components: {
            header: AppHeader,
            main: UserDialogs
        },
        meta: {
            requiresAuth: true
        }
    },
    {
        path: "/profile-:id",
        name: "profile",
        components: {
            header: AppHeader,
            main: UserProfile
        },
        meta: {
            requiresAuth: true
        }
    },
    {
        path: "/friends",
        name: "friends",
        components: {
            header: AppHeader,
            main: FriendsPage
        },
        meta: {
            requiresAuth: true
        }
    },
    {
        path: "/settings",
        name: "settings",
        components: {
            header: AppHeader,
            main: UserSettings
        },
        meta: {
            requiresAuth: true
        }
    },
    {
        path: "/about",
        name: "about",
        components: {
            header: AppHeader,
            main: AboutUs
        },
        meta: {
            requiresAuth: true
        }
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

async function isAuthenticated() {
    try {
        let response = await axios.post(`/auth`);

        if (response.status == 200) {
            return true;
        } else {
            return false;
        }
    } catch (error) {
        return false;
    }
}

router.beforeEach(async (to, from, next) => {
    let isAuthenticate = await isAuthenticated();
    if (isAuthenticate && to.meta.requiresAuth) {
        next();
    } else if (isAuthenticate && !to.meta.requiresAuth) {
        next("/news");
    } else if (!isAuthenticate && to.meta.requiresAuth) {
        next("/login");
    } else if (to.href == "/") {
        next("/login");
    } else {
        next();
    }
});

export default router;
