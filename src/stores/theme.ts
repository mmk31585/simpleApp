import { ref, computed, watch } from "vue";
import { theme } from "ant-design-vue";
import { defineStore } from "pinia";

export const isDark = ref(false);
export const useThemeStore = defineStore("theme", () => {

  const lightTokens = {
    colorPrimary: "#d7cefd",
    colorText: "#111827",
  };

  const darkTokens = {
    colorPrimary: "#507b8d",
    colorText: "#f3f4f6",
  };

  const themeConfig = computed(() => ({
    algorithm: isDark.value ? theme.darkAlgorithm : theme.defaultAlgorithm,
    token: isDark.value ? darkTokens : lightTokens,
  }));

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

  return { isDark, toggleTheme, themeConfig };
});
