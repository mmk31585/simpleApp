import { theme } from "ant-design-vue";

export const lightTokens = {
  colorPrimary: "#6366f1",
  colorInfo: "#0891b2",
  colorSuccess: "#22c55e",
  colorWarning: "#f59e0b",
  colorError: "#ef4444",
  colorBgBase: "#f7f8fb",
  colorBgLayout: "#bdd2a9",
  colorTextBase: "#111827",
  borderRadius: 12,
  fontFamily: '"Peyda","Vazirmatn", ui-sans-serif, system-ui',
};

export const darkTokens = {
  colorPrimary: "#507b8d",
  colorInfo: "#38bdf8",
  colorSuccess: "#22c55e",
  colorWarning: "#f59e0b",
  colorError: "#ef4444",
  colorBgBase: "#0b1f2a",
  colorBgLayout: "#0b1f2a",
  colorTextBase: "#f3f4f6",
  borderRadius: 12,
  fontFamily: '"Peyda","Vazirmatn", ui-sans-serif, system-ui',
};

export const themeConfig = (isDark: boolean) => ({
  algorithm: isDark ? theme.darkAlgorithm : theme.defaultAlgorithm,
  token: isDark ? darkTokens : lightTokens,
});
