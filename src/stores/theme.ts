import { ref, watch } from "vue";
import { defineStore } from "pinia";

export const isDark = ref(false);
export const useThemeStore = defineStore("theme", () => {
  function toggleTheme() {
    isDark.value = !isDark.value;
  }

  watch(
    isDark,
    (val) => {
      const html = document.documentElement;
      if (val) html.classList.add("dark");
      else html.classList.remove("dark");
    },
    { immediate: true },
  );

  return { isDark, toggleTheme };
});
