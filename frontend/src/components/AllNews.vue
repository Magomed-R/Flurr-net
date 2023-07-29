<script>
import axios from 'axios'
import dayjs from 'dayjs'

export default {
    data() {
        return {
            news: null,
            readyToLike: true
        }
    },
    props: {
        user: {
            type: Object,
            required: true
        }
    },
    methods: {
        async loadNews() {
            try {
                let response = await axios.get(`/news/all`)
                this.news = response.data
            } catch (error) {
                console.log(error)
            }
        },
        async likeNews(item) {
            if (this.readyToLike) {
                this.readyToLike = false

                let response = await axios.post(`/news/likeNews`, {
                    newsId: item._id
                })

                if (response.data == 'unlike') {
                    let i = this.$props.user.likedNews.indexOf(item._id)
                    this.$props.user.likedNews.splice(i, 1)
                    item.likes--
                } else {
                    this.$props.user.likedNews.push(item._id)
                    item.likes++
                }

                this.readyToLike = true
            }
        },
        goComments(item) {
            this.$router.replace(`/news-` + item._id)
        },
        getDate(date) {
            let day = dayjs(date)
            return day.format(`HH:mm DD.MM.YY`)
        },
        goProfile(user) {
            this.$router.replace(`/profile-` + user._id)
        }

    },
    mounted() {
         this.loadNews()
    }
}
</script>

<template>
    <section class="new__list">
        <article v-for="(item, index) in news" class="new__body" :key="item._id">
            <div class="new__header" @click="goProfile(item.author)">                
                <div class="new__avatar" :style="{
                    backgroundImage: 'url(' + item.author.avatar + ')',
                    backgroundPosition: 'center center',
                    backgroundSize: 'cover'
                }"></div>

                <p class="new__author" v-html="item.author.username"></p>
            </div>

            <div class="new__main" v-html="item.content"></div>

            <div class="new__footer">
                <div class="new__reactions">
                    <div class="new__likes" @click="likeNews(item)">
                        <img :src="(user.likedNews.includes(item._id) ? `https://i.ibb.co/8zct618/liked.png` : `https://i.ibb.co/vd3TQ5p/unliked.png`)" />
                        <span class="new__likes-number">{{ item.likes }}</span>
                    </div>

                    <div class="new__comments" @click="goComments(item)">
                        <img src="@/assets/comment.png" alt="comment button" />
                        <span class="new__comments-number">{{ item.comments.length }}</span>
                    </div>
                </div>

                <div class="new__createdAt">{{ getDate(item.createdAt) }}</div>
            </div>
        </article>
    </section>
</template>

<style lang="scss" scoped>
.new__list {
    display: flex;
    flex-direction: column;
    align-items: start;
    gap: 26px;

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
            padding: 0 8px;

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

            padding: 6px 10px;
            margin: 0 14px;

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

                    cursor: pointer;

                    img {
                        height: 30px;

                        transition: opacity .2s;

                        background-color: #fff;
                    }
                }

                .new__comments {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    gap: 6px;

                    cursor: pointer;

                    img {
                        height: 28px;
                    }
                }
            }
        }
    }
}
</style>
