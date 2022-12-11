<template>
  <section class="login-wrapper">
    <img alt="42 logo" style="width: 200px; height: 200px" src="@/assets/logo.png">
    <form>
      <label for="uname"><b>Username</b></label>
      <input type="text" placeholder="Enter Username" name="uname" required>
      <label for="psw"><b>Password</b></label>
      <input type="password" placeholder="Enter Password" name="psw" required>
      <router-link to="/index">
        <button type="submit">Login</button>
      </router-link>
    </form>
  </section>
</template>

<script setup lang="ts">
</script>

<style scoped lang="scss">
.login-wrapper {
  grid-area: $main;

  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;

  form {
    display: flex;
    justify-content: center;
    flex-direction: column;
  }
}

</style>