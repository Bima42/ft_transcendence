<template>
    <div class="menu-btn" @click="toggleMenu">
      <div class="menu-btn_burger">
      </div>
    </div>
</template>

<script setup lang="ts">
const props = defineProps<{}>()

let menuOpen = false;

function toggleMenu(e: Event) {
  let menuBtn = document.querySelector('.menu-btn');
  if (!menuOpen) {
    menuBtn.classList.add("open")
    menuOpen = true;
  } else {
    menuBtn.classList.remove("open")
    menuOpen = false;
  }
}

</script>

<style scoped lang="scss">
.menu-btn {
  overflow: hidden;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 80px;
  height: 80px;
  cursor: pointer;
  transition: all .5s ease-in-out;
}

.menu-btn_burger {
  width: 30px;
  height: 4px;
  background: $yellow;
  border-radius: 5px;
  box-shadow: 0 2px 5px rgba(255, 101, 47, .2);
  transition: all .5s ease-in-out;
}

.menu-btn_burger::before,
.menu-btn_burger::after {
  content: '';
  position: absolute;
  width: 30px;
  height: 4px;
  background: $yellow;
  border-radius: 5px;
  box-shadow: 0 2px 5px rgba(255, 101, 47, .2);
  transition: all .5s ease-in-out;
}

.menu-btn_burger::before {
  transform: translateY(10px);
}

.menu-btn_burger::after {
  transform: translateY(-10px);
}

/* ANIMATION */
.menu-btn.open {
  .menu-btn_burger {
    transform: translateX(35px);
    background: transparent;
    box-shadow: none;
  }
  .menu-btn_burger::before {
    transform: rotate(-45deg) translate(-30px, -30px);
  }
  .menu-btn_burger::after {
    transform: rotate(45deg) translate(-30px, 30px);
  }
}
</style>