<template>
  <div class="min-h-screen bg-white flex flex-col items-center p-6">
    <!-- HEADER -->
    <header class="bg-white shadow-sm w-full">
      <div class="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between relative">
        <img
          src="../assets/safebites_logo.png"
          alt="Logo"
          class="h-24 w-50 cursor-pointer"
          @click="navigateTo('/Home')"
        />  
        <div class="flex items-center space-x-2">
          <img
            src="../assets/user_icon.png"
            alt="User Icon"
            class="h-14 w-14 mt-4 cursor-pointer"
            @click="navigateTo('/userPage')"
          />
        </div>
      </div>
    </header>
    
    <div class="self-end mt-8"> 
      <button @click="logout" class="bg-red-500 hover:bg-red-600 text-white px-3 py-1 mr-3 rounded">
            Logout
      </button>
      <button @click="deleteProfile" class="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 mr-3 rounded">
            Delete Profile
      </button>
    </div>

    <!-- User Info Section -->
    <div class="bg-white p-6 rounded-xl shadow-lg w-96 text-center mb-8 mt-8">
      <h2 class="text-xl font-bold text-gray-800 mb-4 font-agatholight">INFO</h2>
      <p class="text-sm text-gray-600">
        <span class="font-semibold">Name:</span> {{ Name }} {{ userSurname }}
      </p>
      <p class="text-sm text-gray-600">
        <span class="font-semibold">Username:</span> {{ userName }}
      </p>
      <p class="text-sm text-gray-600 mb-4">
        <span class="font-semibold">Email:</span> {{ userEmail }}
      </p>

      <!-- Change Name/Surname -->
      <button @click="handleChangeName" class="w-full px-4 py-2 text-sm font-medium text-white bg-red-400 hover:bg-red-500 rounded-lg transition-colors mb-2">
        Change Name/Surname
      </button>
      <div v-if="showNameFields" class="mt-2">
        <input
          v-model="newName"
          type="text"
          placeholder="New Name"
          class="w-full px-3 py-2 border rounded-lg mb-2"
        />
        <input
          v-model="newSurname"
          type="text"
          placeholder="New Surname"
          class="w-full px-3 py-2 border rounded-lg mb-2"
        />
        <button @click="handleConfirmName" class="w-full px-4 py-2 text-sm font-medium text-white bg-green-400 hover:bg-green-500 rounded-lg transition-colors">
          Confirm Name
        </button>
      </div>

      <!-- Change Username -->
      <button @click="handleChangeUsername" class="w-full px-4 py-2 text-sm font-medium text-white bg-red-400 hover:bg-red-500 rounded-lg transition-colors mt-2">
        Change Username
      </button>
      <div v-if="showUsernameField" class="mt-2">
        <input
          v-model="newUsername"
          type="text"
          placeholder="New Username"
          class="w-full px-3 py-2 border rounded-lg mb-2"
        />
        <button @click="handleConfirmUsername" class="w-full px-4 py-2 text-sm font-medium text-white bg-green-400 hover:bg-green-500 rounded-lg transition-colors">
          Confirm Username
        </button>
      </div>

      <!-- Change Email -->
      <button @click="handleChangeEmail" class="w-full px-4 py-2 text-sm font-medium text-white bg-red-400 hover:bg-red-500 rounded-lg transition-colors mt-2">
        Change Email
      </button>
      <div v-if="showEmailField" class="mt-2">
        <input
          v-model="newEmail"
          type="email"
          placeholder="New Email"
          class="w-full px-3 py-2 border rounded-lg mb-2"
        />
        <button @click="handleConfirmEmail" class="w-full px-4 py-2 text-sm font-medium text-white bg-green-400 hover:bg-green-500 rounded-lg transition-colors">
          Confirm Email
        </button>
      </div>

      <!-- Change Password -->
      <button @click="handleChangePassword" class="w-full px-4 py-2 text-sm font-medium text-white bg-red-400 hover:bg-red-500 rounded-lg transition-colors mt-2">
        Change Password
      </button>
      <div v-if="showPasswordFields" class="mt-2">
        <input
          v-model="newPassword"
          type="password"
          placeholder="New Password"
          class="w-full px-3 py-2 border rounded-lg mb-2"
        />
        <input
          v-model="confirmPassword"
          type="password"
          placeholder="Confirm Password"
          class="w-full px-3 py-2 border rounded-lg mb-2"
        />
        <p v-if="passwordError" class="text-red-500 text-sm">{{ passwordError }}</p>
        <button @click="handleConfirmPassword" class="w-full px-4 py-2 text-sm font-medium text-white bg-green-400 hover:bg-green-500 rounded-lg transition-colors">
          Confirm Password
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

const router = useRouter();

const userName = ref('');
const Name = ref('');
const userSurname = ref('');
const userEmail = ref('');

const showNameFields = ref(false);
const newName = ref('');
const newSurname = ref('');

const showUsernameField = ref(false);
const newUsername = ref('');

const showEmailField = ref(false);
const newEmail = ref('');

const showPasswordFields = ref(false);
const newPassword = ref('');
const confirmPassword = ref('');
const passwordError = ref('');

const fetchUserData = async () => {
  try {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (!storedUser || !storedUser.id) {
      throw new Error("User data not found in localStorage");
    }

    const response = await axios.get(`https://safebites.onrender.com/api/v1/users/${storedUser.id}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });

    const userData = response.data;
    userName.value = userData.user_name;
    Name.value = userData.name;
    userSurname.value = userData.family_name;
    userEmail.value = userData.email;

  } catch (error) {
    console.error("Error fetching user data:", error);
    alert("Error fetching user data.");
  }
};

const navigateTo = (routePath) => {
  router.push(routePath);
};

onMounted(async () => {
  await fetchUserData();
});

// Name/Surname Handlers
const handleChangeName = () => {
  showNameFields.value = !showNameFields.value;
};

const handleConfirmName = async () => {
  try {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    const response = await axios.put(
      `https://safebites.onrender.com/api/v1/users/${storedUser.id}`,
      {
        name: newName.value,
        family_name: newSurname.value,
        token: localStorage.getItem('token')  // Add token to body
      }
    );
    console.log(response);
    Name.value = newName.value;
    userSurname.value = newSurname.value;
    alert('Name updated successfully!');
    showNameFields.value = false;
  } catch (error) {
    console.error('Error updating name:', error);
    alert('Error updating name.');
  }
};

// Username Handlers
const handleChangeUsername = () => {
  showUsernameField.value = !showUsernameField.value;
};

const handleConfirmUsername = async () => {
  try {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    const response = await axios.put(
      `https://safebites.onrender.com/api/v1/users/${storedUser.id}`,
      {
        user_name: newUsername.value,
        token: localStorage.getItem('token')  // Add token to body
      }
    );
    console.log(response);
    userName.value = newUsername.value;
    alert('Username updated successfully!');
    showUsernameField.value = false;
  } catch (error) {
    console.error('Error updating username:', error);
    alert('Error updating username.');
  }
};

const handleChangeEmail = () => {
  showEmailField.value = !showEmailField.value;
};

const handleConfirmEmail = async () => {
  try {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    const response = await axios.put(
      `https://safebites.onrender.com/api/v1/users/${storedUser.id}`,
      {
        email: newEmail.value,
        token: localStorage.getItem('token')  // Add token to body
      }
    );
    console.log(response);
    userEmail.value = newEmail.value;
    alert('Email updated successfully!');
    showEmailField.value = false;
  } catch (error) {
    console.error('Error updating email:', error);
    alert('Error updating email.');
  }
};

const handleChangePassword = () => {
  showPasswordFields.value = !showPasswordFields.value;
};

const handleConfirmPassword = async () => {
  if (newPassword.value !== confirmPassword.value) {
    // ... password check remains the same
  }
  try {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    const response = await axios.put(
      `https://safebites.onrender.com/api/v1/users/${storedUser.id}`,
      {
        password: newPassword.value,
        token: localStorage.getItem('token')  // Add token to body
      }
    );
    console.log(response);
    alert('Password updated successfully!');
    showPasswordFields.value = false;
  } catch (error) {
    console.error('Error updating password:', error);
    alert('Error updating password.');
  }
};

const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  router.push('/Home');
};

const deleteProfile = async () => {
  if (!confirm('Are you sure you want to delete your profile?')) return;
  try {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    await axios.delete(`https://safebites.onrender.com/api/v1/users/${storedUser.id}`, {
      data: {  // Send token in request body for DELETE
        token: localStorage.getItem('token')
      }
    });
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/Home');
  } catch (error) {
    console.error('Error deleting profile:', error);
    alert('Error deleting profile.');
  }
};
</script>
