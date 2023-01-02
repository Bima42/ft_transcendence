<template>
  <section class="chat-wrapper">
    <ChatUserList></ChatUserList>
    <div class="main-box">
      <div class="tab-selector"></div>
      <div class="chat-display"></div>
      <div class="message-input"></div>
    </div>

<!--    <div id="chat">-->
<!--        <ChatHeader></ChatHeader>-->
<!--      <div class="chat-container">-->
<!--        <ChatUserList></ChatUserList>-->
<!--        <ChatMessageDisplay></ChatMessageDisplay>-->
<!--        &lt;!&ndash; <ButtonDisplay></ButtonDisplay> &ndash;&gt;-->
<!--      </div>-->
<!--      <ChatTypeBox></ChatTypeBox>-->
<!--    </div>-->
  </section>
</template>

<script setup lang="ts">
import ChatTypeBox from './TypeBox.vue';
import ChatMessageDisplay from './ChatMessageDisplay.vue';
import ChatUserList from './LeftChatList.vue';
import ChatHeader from './ChatHeader.vue';
import ButtonDisplay from './ButtonDisplay.vue';
</script>

<style scoped lang="scss">
.chat-wrapper {
  grid-area: $main;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;

  .left-menu {

  }

  .main-box {
    flex-grow: 1;
    display: flex;
    flex-direction: column;

    .tab-selector {
      background: pink;
      flex-grow: 1;
      width: 100%;
    }
    .chat-display {
      flex-grow: 1;
      width: 100%;
      background: yellow;
      min-height: 80%;
    }
    .message-input {
      flex-grow: 1;
      width: 100%;
      background: green;
    }
  }
}







//#chat {
//  background-color: rgb(22, 20, 20);
//  border: 1px solid rgb(255, 225, 0);
//  border-radius: 5px;
//  box-shadow: 5px 5px 30px rgba(255, 0, 128, 0.5); /* Pink shadow */
//  // overflow-y: scroll;
//}
//
//#chat .chat-container {
//  display: flex;
//  height: 407px;
//}
</style>
