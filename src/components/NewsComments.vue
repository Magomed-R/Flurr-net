<script>
import axios from 'axios'
import dayjs from 'dayjs'

export default {
    data() {
        return {
            user: null,
            news: null,
            readyToLike: true,
            comment: '',
            dataLoaded: false
        }
    },
    methods: {
        async loadNews() {
            try {
                let response = await axios.get(`/news/one`, { params: { id: this.$route.params.id } })
                this.news = response.data
            } catch (error) {
                console.log(error)
            }
        },
        async loadUser() {
            try {
                let response = await axios.get(`/find/me`)
                this.user = response.data
            } catch (error) {
                console.log(error)
            }
        },
        goProfile(user) {
            this.$router.replace(`/profile-` + user._id)
        },
        async likeNews(item) {
            if (this.readyToLike) {
                this.readyToLike = false

                let response = await axios.post(`/news/likeNews`, {
                    newsId: item._id,
                    userId: this.user._id
                })

                if (response.data == 'unlike') {
                    let i = this.user.likedNews.indexOf(item._id)
                    this.user.likedNews.splice(i, 1)
                    item.likes--
                } else {
                    this.user.likedNews.push(item._id)
                    item.likes++
                }

                this.readyToLike = true
            }
        },
        getDate(date) {
            let day = dayjs(date)
            return day.format(`HH:mm DD.MM.YY`)
        },
        async newComment() {
            try {
                let response = await axios.post(`/news/newComment`, {
                    userId: localStorage._id,
                    newsId: this.$route.params.id,
                    text: this.comment
                })

                if (response.status == 200) {
                    this.loadNews()
                    this.comment = ''
                }
            } catch (error) {
                console.log(error)
            }
        }
    },
    async created() {
        await this.loadNews()
        await this.loadUser()
        this.dataLoaded = true
    }
}
</script>

<template>
    <div v-if="user && news">
        <article class="new__body">
            <div class="new__header" @click="goProfile(news.author)">
                <div class="new__avatar" :style="{
                    backgroundImage: 'url(' + news.author.avatar + ')',
                    backgroundPosition: 'center center',
                    backgroundSize: 'cover'
                }" :class="{
    'empty-avatar': !news.author.avatar
}"></div>

                <p class="new__author" v-html="news.author.username"></p>
            </div>

            <div class="new__main" v-html="news.content"></div>

            <div class="new__footer">
                <div class="new__reactions">
                    <div class="new__likes" @click="likeNews(news)">
                        <img
                            :src="(user.likedNews.includes(news._id) ? `https://i.ibb.co/8zct618/liked.png` : `https://i.ibb.co/vd3TQ5p/unliked.png`)" />

                        <span class="new__likes-number">{{ news.likes }}</span>
                    </div>

                    <div class="new__comments">
                        <img src="@/assets/comment.png" alt="comment button" />

                        <span class="new__comments-number">{{ news.comments.length }}</span>
                    </div>
                </div>
                <div class="new__createdAt">{{ getDate(news.createdAt) }}</div>
            </div>
        </article>

        <h1>Комментарии</h1>
        <section class="comment__list">
            <div class="comment__body" v-for="(item, index) in news.comments">
                <a @click.prevent="goProfile(item.user)" class="comment__header">
                    <div class="new__avatar" :style="{
                        backgroundImage: 'url(' + item.user.avatar + ')',
                        backgroundPosition: 'center center',
                        backgroundSize: 'cover'
                    }" :class="{ 'empty-avatar': !item.user.avatar }"></div>

                    <p v-html="item.user.username"></p>

                    <span style="margin-left: auto;">{{ getDate(item.createdAt) }}</span>
                </a>

                <div class="comment__main" v-html="item.text"></div>
            </div>

            <form @submit.prevent="newComment()" class="add__form">
                <input v-model="comment" type="text" class="add__input" />

                <button type="submit">
                    <img src="@/assets/send.svg" alt="send" />
                </button>
            </form>
        </section>
    </div>
</template>

<style lang="scss" scoped>
.new__body {
    display: flex;
    flex-direction: column;
    justify-content: start;

    box-shadow: 0 0 10px #0006;

    width: 100%;

    .new__header {
        display: flex;
        align-items: center;
        gap: 14px;

        border-bottom: 1px solid #0004;

        margin: 4px 8px;
        padding: 0 6px;

        .new__avatar {
            height: 50px;
            width: 50px;

            border-radius: 50%;
        }

        p {
            font-size: 20px;
        }
    }

    .new__main {
        margin: 10px 20px;

        img {
            max-width: 100%;
        }
    }

    .new__footer {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 20px;

        padding: 6px 10px;
        margin: 0 10px;

        border-top: 1px solid #0004;

        .new__reactions {
            display: flex;
            justify-content: start;
            align-items: center;
            gap: 20px;

            .new__likes {
                display: flex;
                justify-content: center;
                align-items: center;
                gap: 6px;

                img {
                    height: 30px;

                    transition: opacity 0.2s;

                    background-color: #fff;
                }
            }

            .new__comments {
                display: flex;
                justify-content: center;
                align-items: center;
                gap: 6px;

                img {
                    height: 28px;
                }
            }
        }
    }
}

h1 {
    font-weight: normal;
    font-size: 24px;
    text-align: center;

    margin: 0;
    padding: 10px;
}

.comment__list {
    display: flex;
    flex-direction: column;
    gap: 20px;

    margin-bottom: 60px;

    .comment__body {
        display: flex;
        flex-direction: column;

        width: 100%;

        border: 0 solid #0004;
        border-width: 1px 0;

        padding: 0;

        .comment__header {
            display: flex;
            align-items: center;
            gap: 10px;


            text-decoration: none;
            color: #000;

            padding: 8px 16px;


            .new__avatar {
                height: 40px;
                width: 40px;

                border-radius: 50%;
            }

            .empty-avatar {
                background-image: url("@/assets/empty account.svg") !important;
            }

            p {
                margin: 0;

                font-size: 18px;
            }
        }

        .comment__main {
            border-top: 1px solid #0003;
            margin: 0 10px;
            padding: 6px 6px;
        }
    }
}

form {
    position: fixed;
    bottom: 0;
    right: 0;
    left: 0;

    background-color: #fff;

    width: 100%;

    display: flex;
    align-items: center;
    gap: 5px;

    border-top: 1px solid #0005;

    input {
        flex-basis: 100%;

        font-size: 20px;

        padding: 8px 12px;
        margin: 2px;

        border-radius: 0.375em;

        border: none;

        &:focus-visible {
            outline: none;
        }
    }

    button {
        border: none;
        padding: 0;

        position: sticky;
        right: 10px;

        background-color: #fff0;

        img {
            height: 20px;
        }
    }

    &:hover {
        border-top: 1px solid #0ff;
    }
}
</style>