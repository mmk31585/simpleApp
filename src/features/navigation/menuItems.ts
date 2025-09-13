import { h } from 'vue';
import type { MenuProps } from 'ant-design-vue';
import { PieChartOutlined, MailOutlined, DesktopOutlined, InboxOutlined, AppstoreOutlined } from '@ant-design/icons-vue';

export const menuItems: NonNullable<MenuProps['items']> = [
  { key: '1', icon: () => h(PieChartOutlined), label: 'داشبورد', title: 'داشبورد' },
  { key: '2', icon: () => h(DesktopOutlined), label: 'تحلیل‌ها', title: 'تحلیل‌ها' },
  { key: '3', icon: () => h(InboxOutlined), label: 'پیام‌ها', title: 'پیام‌ها' },
  {
    key: 'sub1', icon: () => h(MailOutlined), label: 'ناوبری یک', title: 'ناوبری یک',
    children: [
      { key: '5', label: 'گزینه ۵', title: 'گزینه ۵' },
      { key: '6', label: 'گزینه ۶', title: 'گزینه ۶' },
      { key: '7', label: 'گزینه ۷', title: 'گزینه ۷' },
      { key: '8', label: 'گزینه ۸', title: 'گزینه ۸' },
    ],
  },
  {
    key: 'sub2', icon: () => h(AppstoreOutlined), label: 'ناوبری دو', title: 'ناوبری دو',
    children: [
      { key: '9', label: 'گزینه ۹', title: 'گزینه ۹' },
      { key: '10', label: 'گزینه ۱۰', title: 'گزینه ۱۰' },
      { key: '11', label: 'گزینه ۱۱', title: 'گزینه ۱۱' },
      { key: '12', label: 'گزینه ۱۲', title: 'گزینه ۱۲' },
    ],
  },
];

export const menuRouteMap: Record<string, string> = {
  '1': '/dashboard/home',
  '2': '/dashboard/analytics',
  '3': '/dashboard/messages',
  '5': '/dashboard/nav/5',
  '6': '/dashboard/nav/6',
  '7': '/dashboard/nav/7',
  '8': '/dashboard/nav/8',
  '9': '/dashboard/nav2/9',
  '10': '/dashboard/nav2/10',
  '11': '/dashboard/nav2/11',
  '12': '/dashboard/nav2/12',
};
