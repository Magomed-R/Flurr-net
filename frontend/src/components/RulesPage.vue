<script>
export default {
    methods: {
        back() {
            this.$router.back()
        }
    }
}
</script>

<template>
    <div class="body">
        <div class="content">
            <h3>Правила поведения</h3>
            <p>Запрещено пытаться сломать или взломать сайт</p>
            <p>О любых багах необходимо сообщать админам</p>
            <p>Запрещается публиковать непристойный или оскорбительный контент на общедоступных страницах</p>
            <p>Аккаунты пользователей, чей никнейм или аватар содержат ненормативную лексику будут удалены</p>
            <p>Админ имеет право заблокировать ваш аккаунт, если посчитает это нужным</p>
        </div>
        <img src="@/assets/close.svg" alt="close" @click="back()" />
    </div>
</template>

<style lang="scss" scoped>
.body {
    font-family: Montserrat;
    background: #fff;
    color: black;

    display: flex;
    justify-content: center;
    align-items: start;

    margin: 24px;

    .content {
        width: 500px;

        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: start;

        h3 {
            margin-bottom: 6px;
            align-self: center;
            text-align: center;
        }
    }

    img {
        height: 40px;
        position: fixed;
        top: 10px;
        right: 10px;

        cursor: pointer;
    }
}
</style>