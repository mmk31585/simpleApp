<template>
  <a-form layout="vertical" :model="formState" @finish="handleFinish" @finishFailed="handleFinishFailed">
    <a-form-item>
      <a-input v-model:value="formState.user" placeholder="Username">
        <template #prefix>
          <UserOutlined style="color: rgba(0, 0, 0, 0.25)" />
        </template>
      </a-input>
    </a-form-item>
    <a-form-item>
      <a-input v-model:value="formState.password" type="password" placeholder="Password">
        <template #prefix>
          <LockOutlined style="color: rgba(0, 0, 0, 0.25)" />
        </template>
      </a-input>
    </a-form-item>
    <a-form-item>
      <a-button type="primary" html-type="submit" :disabled="formState.user === '' || formState.password === ''">
        Log in
      </a-button>
    </a-form-item>
  </a-form>
</template>
<script lang="ts" setup>

</script>
