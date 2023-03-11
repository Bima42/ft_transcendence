<template>
    <p class="join-text">
        You have successfully joined the queue. Please wait for a few seconds while we find you a match.
    </p>
    <div class="box">
        <div class="ball"></div>
    </div>
</template>

<script setup lang="ts">
</script>

<style scoped lang="scss">
.box {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 20px;
    height: 30px;
    position: relative;
    border-left: 3px solid $yellow;
    border-right: 3px solid $yellow;
}

.box .ball {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background-color: $yellow;
    position: absolute;
    -webkit-animation: moveX 2.00s linear 0s infinite alternate;
}

.join-text {
    color: $yellow;
    text-align: center;
    margin: 10px 0 30px;
}

@-webkit-keyframes moveX {
    from { left: 0; } to { left: 98%; }
}
</style>