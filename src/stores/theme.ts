import { ref, watch, computed } from "vue";
import { defineStore } from "pinia";
import { themeConfig as createThemeConfig } from "@/plugins/antdv.theme";

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

  const themeConfig = computed(() => createThemeConfig(isDark.value));

  return { isDark, toggleTheme, themeConfig };
});
