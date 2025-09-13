<template>
  <a-form layout="vertical" name="login" :rules="rules" :model="formState" @finish="handleFinish"
    @finishFailed="handleFinishFailed">
    <a-form-item name="email">
      <a-input v-model:value="formState.email" placeholder="ایمیل">
        <template #prefix>
          <UserOutlined style="color: rgba(0, 0, 0, 0.25)" />
        </template>
      </a-input>
    </a-form-item>
    <a-form-item name="password">
      <a-input v-model:value="formState.password" type="password" placeholder="رمز عبور">
        <template #prefix>
          <LockOutlined style="color: rgba(0, 0, 0, 0.25)" />
        </template>
      </a-input>
    </a-form-item>
    <a-form-item>
      <a-button type="primary" html-type="submit" :loading="loading">
        Log in
      </a-button>
    </a-form-item>
  </a-form>
</template>
<script lang="ts" setup>
import type { Rule } from 'ant-design-vue/es/form';
import { reactive, ref } from "vue";
import { UserOutlined, LockOutlined } from "@ant-design/icons-vue";
import type { UnwrapRef } from "vue";
import type { FormProps } from "ant-design-vue";
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
const authStore = useAuthStore()
const error = ref<string | null>(null)
const router = useRouter()

const loading = ref(false)

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
  email: [
    { required: true, validator: checkEmail, trigger: "change" },
  ],
  password: [

    { required: true, validator: validatePass, trigger: "change" },
  ],
};
const handleFinish: FormProps["onFinish"] = async (values) => {
  loading.value = true
  try {
    await authStore.login(values.email, values.password, router)
    error.value = null
  } catch (err: unknown) {
    const msg =
      typeof err === "object" && err && "message" in err
        ? String((err as any).message)
        : "خطا در ورود";
    error.value = msg;
  } finally {
    loading.value = false
  }
};
const handleFinishFailed: FormProps["onFinishFailed"] = (errors) => {
  console.log(errors);
};
</script>
