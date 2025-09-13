<template>
  <a-form
    layout="basic"
    name="login"
    :rules="rules"
    :model="formState"
    @finish="handleFinish"
    class="tw:w-sm tw:max-sm:w-[240px] tw:!pt-10 tw:md:!px-4"
    @finishFailed="handleFinishFailed"
  >
    <a-form-item name="email">
      <a-input v-model:value="formState.email" placeholder="ایمیل" class="tw:!bg-white/20 tw:h-10">
        <template #prefix>
          <UserOutlined
            :style="{ color: themeStore.themeConfig.token.colorText }"
            class="tw:ml-2"
          />
        </template>
      </a-input>
    </a-form-item>
    <a-form-item name="password" class="tw:!mb-10">
      <a-input
        v-model:value="formState.password"
        type="password"
        placeholder="رمز عبور"
        class="tw:!bg-white/20 tw:h-10"
      >
        <template #prefix>
          <LockOutlined
            :style="{ color: themeStore.themeConfig.token.colorText }"
            class="tw:ml-2"
          />
        </template>
      </a-input>
    </a-form-item>
    <a-form-item class="tw:!mb-1">
      <a-button
        type="primary"
        html-type="submit"
        :loading="loading"
        size="large"
        class="tw:w-full tw:!text-white dark:tw:!text-gray-900"
      >
        ورود
        <template #icon>
          <LoginOutlined />
        </template>
      </a-button>
    </a-form-item>
  </a-form>
</template>
<script lang="ts" setup>
import type { Rule } from "ant-design-vue/es/form";
import { reactive, ref } from "vue";
import { UserOutlined, LockOutlined, LoginOutlined } from "@ant-design/icons-vue";
import type { UnwrapRef } from "vue";
import type { FormProps } from "ant-design-vue";
import { useAuthStore } from "@/stores/auth";
import { useThemeStore } from "@/stores/theme";
import { useRouter } from "vue-router";
import { message } from "ant-design-vue";
const authStore = useAuthStore();
const themeStore = useThemeStore();
const error = ref<string | null>(null);
const router = useRouter();

const loading = ref(false);

interface FormState {
  email: string;
  password: string;
}
const formState: UnwrapRef<FormState> = reactive({
  email: "",
  password: "",
});
const validatePass: Rule["validator"] = async (_rule, value: string) => {
  if (!value) return Promise.reject("لطفا پسورد خود را وارد کنید!");
  return Promise.resolve();
};

const checkEmail: Rule["validator"] = async (_rule, value: string) => {
  if (!value) return Promise.reject("لطفا ایمیل خود را وارد کنید!");
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(value)) return Promise.reject("ایمیل وارد شده معتبر نیست!");
  return Promise.resolve();
};
const rules: Record<keyof FormState, Rule[]> = {
  email: [{ required: true, validator: checkEmail, trigger: "change" }],
  password: [{ required: true, validator: validatePass, trigger: "change" }],
};
const handleFinish: FormProps["onFinish"] = async (values) => {
  loading.value = true;
  const key = "login-msg";
  message.loading({ content: "در حال ورود...", key, duration: 0.5 });
  try {
    await authStore.login(values.email, values.password, router);
    message.success({ content: "ورود موفق بود ✅", key, duration: 2 });
    error.value = null;
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "خطای ناشناخته";
    message.error({ content: msg, key, duration: 3.5 });
  } finally {
    loading.value = false;
  }
};
const handleFinishFailed: FormProps["onFinishFailed"] = (errors) => {
  console.log(errors);
};
</script>
<style>
.ant-input {
  background-color: transparent !important;
}
</style>
