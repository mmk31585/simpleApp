import { h } from "vue";
import type { MenuProps } from "ant-design-vue";
import {
  PieChartOutlined,
  MailOutlined,
  DesktopOutlined,
  InboxOutlined,
  AppstoreOutlined,
} from "@ant-design/icons-vue";

export const menuItems: NonNullable<MenuProps["items"]> = [
  { key: "1", icon: () => h(PieChartOutlined), label: "داشبورد", title: "داشبورد" },
  { key: "2", icon: () => h(DesktopOutlined), label: "تحلیل‌ها", title: "تحلیل‌ها" },
  { key: "3", icon: () => h(InboxOutlined), label: "پیام‌ها", title: "پیام‌ها" },
  {
    key: "sub1",
    icon: () => h(MailOutlined),
    label: "ناوبری یک",
    title: "ناوبری یک",
    children: [
      { key: "5", label: "گزینه ۵", title: "گزینه ۵" },
      { key: "6", label: "گزینه ۶", title: "گزینه ۶" },
      { key: "7", label: "گزینه ۷", title: "گزینه ۷" },
      { key: "8", label: "گزینه ۸", title: "گزینه ۸" },
    ],
  },
  {
    key: "sub2",
    icon: () => h(AppstoreOutlined),
    label: "ناوبری دو",
    title: "ناوبری دو",
    children: [
      { key: "9", label: "گزینه ۹", title: "گزینه ۹" },
      { key: "10", label: "گزینه ۱۰", title: "گزینه ۱۰" },
      {
        key: "sub3",
        label: "زیرمنو",
        title: "زیرمنو",
        children: [
          { key: "11", label: "گزینه ۱۱", title: "گزینه ۱۱" },
          { key: "12", label: "گزینه ۱۲", title: "گزینه ۱۲" },
        ],
      },
    ],
  },
];
