<script setup>
import { watch } from 'vue';
import { useForm } from '../../composables/useForm';
import BaseInput from '../../components/form/BaseInput.vue';
import BaseTextarea from '../../components/form/BaseTextarea.vue';
import BaseButton from '../../components/ui/BaseButton.vue';

const props = defineProps({
  student: {
    type: Object,
    default: null
  },
  isEditMode: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['close', 'save']);

const initialData = {
  student_id: '',
  user_id: '',
  nama_lengkap: '',
  jenis_kelamin: '',
  alamat: '',
  no_hp: '',
  nama_ortu: '',
  no_hp_ortu: '',
  class_id: ''
};

const {
  formData,
  errors,
  isSubmitting,
  submit,
  getFieldProps,
  reset,
  validateSingleField,
  updateField,
  clearErrors
} = useForm(initialData, {
  nama_lengkap: ['required'],
  jenis_kelamin: ['required'],
  alamat: ['required'],
  no_hp: ['required', 'phone'],
  nama_ortu: [],
  no_hp_ortu: ['phone'],
  class_id: ['required']
});

const populateForm = (student) => {
  updateField('student_id', student?.student_id ?? '');
  updateField('user_id', student?.user_id ?? student?.id ?? '');
  updateField('nama_lengkap', student?.nama_lengkap ?? '');
  updateField('jenis_kelamin', student?.jenis_kelamin ?? '');
  updateField('alamat', student?.alamat ?? '');
  updateField('no_hp', student?.no_hp ?? '');
  updateField('nama_ortu', student?.nama_ortu ?? '');
  updateField('no_hp_ortu', student?.no_hp_ortu ?? '');
  updateField('class_id', student?.class_id ?? '');
  clearErrors();
};

watch(() => props.student, (newVal) => {
  if (newVal) {
    populateForm(newVal);
  } else {
    reset();
  }
}, { immediate: true });

watch(() => props.isEditMode, (isEdit) => {
  if (!isEdit) {
    reset();
  }
});

const handleSave = async () => {
  await submit(async () => {
    const payload = { ...formData };
    emit('save', payload);
  });
};
</script>

<template>
  <form @submit.prevent="handleSave" class="space-y-4">
    <h2 class="text-xl font-bold text-white mb-4">
      {{ isEditMode ? 'Edit Student' : 'Add New Student' }}
    </h2>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <BaseInput
        v-bind="getFieldProps('student_id')"
        label="Student ID"
        :disabled="isEditMode"
        placeholder="Auto generated"
      />
      <BaseInput
        v-bind="getFieldProps('user_id')"
        label="User ID"
        :disabled="isEditMode"
        placeholder="Linked user identifier"
      />
    </div>

    <BaseInput v-bind="getFieldProps('nama_lengkap')" label="Full Name" required />

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label class="block mb-2 text-sm font-medium" :class="errors.jenis_kelamin ? 'text-red-600' : 'text-gray-200'">
          Gender<span class="text-red-500 ml-1">*</span>
        </label>
        <select
          class="block w-full rounded-lg border bg-gray-50 border-gray-300 text-gray-900 text-sm p-2.5 focus:ring-blue-500 focus:border-blue-500"
          :class="errors.jenis_kelamin ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''"
          :value="formData.jenis_kelamin"
          @change="updateField('jenis_kelamin', $event.target.value)"
          @blur="validateSingleField('jenis_kelamin')"
        >
          <option disabled value="">Select gender</option>
          <option value="Laki-laki">Laki-laki</option>
          <option value="Perempuan">Perempuan</option>
        </select>
        <p v-if="errors.jenis_kelamin" class="mt-2 text-sm text-red-500">{{ errors.jenis_kelamin }}</p>
      </div>
      <BaseInput v-bind="getFieldProps('class_id')" label="Class ID" required />
    </div>

    <BaseTextarea v-bind="getFieldProps('alamat')" label="Address" :rows="3" required />

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <BaseInput v-bind="getFieldProps('no_hp')" type="tel" label="Phone Number" required />
      <BaseInput v-bind="getFieldProps('nama_ortu')" label="Parent/Guardian Name" />
    </div>
    <BaseInput v-bind="getFieldProps('no_hp_ortu')" type="tel" label="Parent/Guardian Phone" />

    <div class="flex justify-end space-x-3 pt-4">
      <BaseButton type="button" variant="glass-secondary" @click="$emit('close')">
        Cancel
      </BaseButton>
      <BaseButton type="submit" variant="glass-primary" :loading="isSubmitting">
        Save
      </BaseButton>
    </div>
  </form>
</template>
