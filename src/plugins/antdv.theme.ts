import { theme } from "ant-design-vue";

export const lightTokens = {
  colorPrimary: "#3B82F6",
  colorInfo: "#0EA5E9",
  colorSuccess: "#10B981",
  colorWarning: "#F59E0B",
  colorError: "#EF4444",
  colorBgBase: "#F9FAFB",
  colorBgLayout: "#FFFFFF",
  colorTextBase: "#111827",
  colorText: "#374151",
  borderRadius: 12,
  fontFamily: '"Inter","Peyda","Vazirmatn", ui-sans-serif, system-ui',
};

export const darkTokens = {
  colorPrimary: "#60A5FA",
  colorInfo: "#38BDF8",
  colorSuccess: "#34D399",
  colorWarning: "#FBBF24",
  colorError: "#F87171",
  colorBgBase: "#0F172A",
  colorBgLayout: "#1E293B",
  colorTextBase: "#F9FAFB",
  colorText: "#E5E7EB",
  borderRadius: 12,
  fontFamily: '"Inter","Peyda","Vazirmatn", ui-sans-serif, system-ui',
};

export const themeConfig = (isDark: boolean) => ({
  algorithm: isDark ? theme.darkAlgorithm : theme.defaultAlgorithm,
  token: isDark ? darkTokens : lightTokens,
});
