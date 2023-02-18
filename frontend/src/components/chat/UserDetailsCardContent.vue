<template>
  <div class="user-details-card-wrapper">
    <UserAvatar type="small"></UserAvatar>
    <div class="user-details-card-header">
    </div>
    <div class="user-details-card-content">
      <CustomButton styles="fat">Add friend</CustomButton>
      <CustomButton styles="fat">Send a private message</CustomButton>
      <CustomButton styles="fat">...</CustomButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import {defineProps} from 'vue'
import UserAvatar from '@/components/UserAvatar.vue'
import CustomButton from "@/components/CustomButton.vue";

const props = defineProps<{}>()
</script>

<style scoped lang="scss">
.user-details-card-wrapper {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;

  .avatar-container {
    position: absolute;
    top: 7%;
    left: 5%;
  }

  .user-details-card-content {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: space-around;
    align-items: flex-end;
    padding: 10px;
  }
  .user-details-card-header {
    width: 100%;
    height: 30%;
    background-image: url('../../assets/img/wave.svg');
    background-repeat: no-repeat;
    background-position: center center;
    background-size: cover;
  }
}

</style>