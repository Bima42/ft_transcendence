<template>
  <section class="login-wrapper">
    <img alt="42 logo" style="width: 200px; height: 200px" src="@/assets/logo.png">
    <form>
      <label for="uname"><b>Username</b></label>
      <input type="text" placeholder="Enter Username" name="uname" required>
      <label for="psw"><b>Password</b></label>
      <input type="password" placeholder="Enter Password" name="psw" required>
	  <span>
      <router-link to="/index">
        <ButtonVue type="submit" label="Login"/>
      </router-link>
      <router-link to="/signup">
        <ButtonVue type="submit" label="Register"/>
      </router-link>
		</span>
		<router-link to="/signup42">
		<ButtonVue type="submit" label="Login with 42"/>
		</router-link>
		<!-- TODO: TYR justify center for last button -->
    </form>
  </section>
</template>

<script setup lang="ts">
	import ButtonVue from '@/components/ButtonVue.vue';
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
