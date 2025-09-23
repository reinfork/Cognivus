<script setup>
import { ref, onMounted } from 'vue';
import { studentAPI } from '../../services/api';
import Modal from '../../components/ui/Modal.vue';
import BaseButton from '../../components/ui/BaseButton.vue';
import StudentForm from './StudentForm.vue';

const students = ref([]);
const isLoading = ref(true);
const showFormModal = ref(false);
const showNotificationModal = ref(false);
const notificationMessage = ref('');
const notificationType = ref('info');
const selectedStudent = ref(null);
const isEditMode = ref(false);

const fetchStudents = async () => {
  try {
    isLoading.value = true;
    const response = await studentAPI.getAllStudents();
    if (response.data.success) {
      students.value = response.data.data || [];
    } else {
      showNotification('error', response.data.message || 'Failed to load student data.');
    }
  } catch (error) {
    console.error('Failed to fetch students:', error);
    const message = error.response?.data?.message || 'Failed to load student data.';
    showNotification('error', message);
  } finally {
    isLoading.value = false;
  }
};

const showNotification = (type, message) => {
  notificationType.value = type;
  notificationMessage.value = message;
  showNotificationModal.value = true;
};

const openAddModal = () => {
  isEditMode.value = false;
  selectedStudent.value = null;
  showFormModal.value = true;
};

const openEditModal = (student) => {
  isEditMode.value = true;
  selectedStudent.value = student;
  showFormModal.value = true;
};

const resolveStudentIdentifier = (student) => {
  return student?.user_id ?? student?.student_id ?? student?.id ?? null;
};

const handleSave = async (formData) => {
  try {
    if (isEditMode.value) {
      const identifier = resolveStudentIdentifier(selectedStudent.value);
      if (!identifier) {
        showNotification('error', 'Unable to determine identifier for the selected student.');
        return;
      }
      await studentAPI.updateStudent(identifier, formData);
      showNotification('success', 'Student data has been successfully updated.');
    } else {
      await studentAPI.createStudent(formData);
      showNotification('success', 'New student has been successfully created.');
    }

    showFormModal.value = false;
    await fetchStudents();
  } catch (error) {
    console.error('Failed to save student:', error);
    const message = error.response?.data?.message || 'An error occurred while saving student data.';
    showNotification('error', message);
  }
};

const handleDelete = async (student) => {
  const identifier = resolveStudentIdentifier(student);
  if (!identifier) {
    showNotification('error', 'Unable to determine identifier for the selected student.');
    return;
  }

  const confirmation = window.confirm(`Are you sure you want to delete ${student.nama_lengkap || 'this student'}? This action cannot be undone.`);
  if (!confirmation) return;

  try {
    await studentAPI.deleteStudent(identifier);
    showNotification('success', 'Student has been deleted.');
    await fetchStudents();
  } catch (error) {
    console.error('Failed to delete student:', error);
    const message = error.response?.data?.message || 'Failed to delete student.';
    showNotification('error', message);
  }
};

onMounted(fetchStudents);
</script>

<template>
  <div>
    <h1 class="text-3xl font-bold text-white mb-6">Manage Students</h1>

    <div class="mb-6 flex justify-end">
      <BaseButton @click="openAddModal" variant="glass-primary">
        + Add New Student
      </BaseButton>
    </div>

    <div class="bg-gray-800 p-6 rounded-2xl shadow-lg">
      <div class="overflow-x-auto">
        <table class="min-w-full text-sm text-left text-gray-300">
          <thead class="text-xs text-gray-400 uppercase bg-gray-700">
            <tr>
              <th scope="col" class="px-6 py-3">Student ID</th>
              <th scope="col" class="px-6 py-3">User ID</th>
              <th scope="col" class="px-6 py-3">Full Name</th>
              <th scope="col" class="px-6 py-3">Gender</th>
              <th scope="col" class="px-6 py-3">Phone</th>
              <th scope="col" class="px-6 py-3">Class</th>
              <th scope="col" class="px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="isLoading">
              <td colspan="7" class="text-center py-4">Loading data...</td>
            </tr>
            <tr v-else-if="students.length === 0">
              <td colspan="7" class="text-center py-4">No students found.</td>
            </tr>
            <tr
              v-for="student in students"
              :key="student.student_id || student.user_id || student.id"
              class="border-b border-gray-700 hover:bg-gray-700"
            >
              <td class="px-6 py-4 font-medium text-white">{{ student.student_id || '-' }}</td>
              <td class="px-6 py-4">{{ student.user_id || '-' }}</td>
              <td class="px-6 py-4">{{ student.nama_lengkap || '-' }}</td>
              <td class="px-6 py-4">{{ student.jenis_kelamin || '-' }}</td>
              <td class="px-6 py-4">{{ student.no_hp || '-' }}</td>
              <td class="px-6 py-4">{{ student.class_id || '-' }}</td>
              <td class="px-6 py-4 flex space-x-2">
                <button @click="openEditModal(student)" class="font-medium text-blue-500 hover:underline">Edit</button>
                <button @click="handleDelete(student)" class="font-medium text-red-500 hover:underline">Delete</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <Modal :show="showFormModal" @close="showFormModal = false" :persistent="true" size="lg">
      <template #content>
        <StudentForm
          :student="selectedStudent"
          :is-edit-mode="isEditMode"
          @close="showFormModal = false"
          @save="handleSave"
        />
      </template>
    </Modal>

    <Modal
      :show="showNotificationModal"
      :type="notificationType"
      :message="notificationMessage"
      @close="showNotificationModal = false"
    />
  </div>
</template>
