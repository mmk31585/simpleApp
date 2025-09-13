<script lang="ts" setup>
import { reactive } from 'vue';
import { UserOutlined, LockOutlined } from '@ant-design/icons-vue';
import type { UnwrapRef } from 'vue';
import type { FormProps } from 'ant-design-vue';

interface FormState {
  user: string;
  password: string;
}
const formState: UnwrapRef<FormState> = reactive({
  user: '',
  password: '',
});
const handleFinish: FormProps['onFinish'] = values => {
  console.log(values, formState);
};
const handleFinishFailed: FormProps['onFinishFailed'] = errors => {
  console.log(errors);
};
</script>
