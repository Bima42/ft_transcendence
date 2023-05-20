<template>
    <section class="index_wrapper">
        <div class="main_text">
            <img src="@/assets/img/logo_name.svg" alt="logo" class="logo slide_down">
        </div>
        <router-link to="/main/joinGame" class="slide_down">
            Play
        </router-link>
        <router-link to="/main/community" class="slide_down">
            Chat
        </router-link>
        <router-link to="/main/profile" class="slide_down">
            Profile
        </router-link>
        <router-link to="/main/friends" class="slide_down">
            Friends
        </router-link>
        <router-link to="/main/leaderboard" class="slide_down">
            Leaderboard
        </router-link>
    </section>
</template>

<script setup lang="ts">
</script>

<style scoped lang="scss">
a {
    color: $quaternary;
    text-decoration: none;
    font-size: 1.5em;
    transition: scale 0.2s ease-in-out, color 0.2s ease-in-out;

    &:hover {
        text-decoration: none;
        scale: 120%;
        color: $tertiary;
        -webkit-text-stroke-width: 0.5px;
        -webkit-text-stroke-color: black;
    }
}

.index_wrapper {
    grid-area: $gigamain;
    display: flex;
    gap: $medium_gap * 1.5;
    flex-direction: column;
    width: 100%;
    height: 100%;
    text-align: center;

    .slide_down {
        -webkit-animation: slide_down 0.3s cubic-bezier(0.250, 0.460, 0.450, 0.940) forwards;
        animation: slide_down 0.3s cubic-bezier(0.250, 0.460, 0.450, 0.940) forwards;
    }

    .main_text {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 25vh;

        .logo {
            width: 100vw;
            max-width: 1080px;
        }
    }
}


@-webkit-keyframes slide_down {
    0% {
        -webkit-transform: translateY(-100px);
        transform: translateY(-100px);
        opacity: 0;
    }
    50% {
        opacity: 0;
    }
    100% {
        -webkit-transform: translateY(0);
        transform: translateY(0);
        opacity: 100;
    }
}

@keyframes slide_down {
    0% {
        -webkit-transform: translateY(-100px);
        transform: translateY(-100px);
        opacity: 0;
    }
    50% {
        opacity: 0;
    }
    100% {
        -webkit-transform: translateY(0);
        transform: translateY(0);
        opacity: 100;
    }
}
</style>
