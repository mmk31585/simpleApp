
const themeConfig = computed(() => ({
  algorithm: isDark.value ? theme.darkAlgorithm : theme.defaultAlgorithm,
  token: isDark.value ? darkTokens : lightTokens,
}))

function toggleTheme() {
  isDark.value = !isDark.value
}

watch(isDark, (val) => {
  const html = document.documentElement
  if (val) html.classList.add('dark')
  else html.classList.remove('dark')
})
