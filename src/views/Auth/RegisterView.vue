<template>
  
  <div class="container mt-5">
    <div class="col-md-8 offset-md-2">
      <div
        class="card mx-4 mx-md-5 shadow-5-strong bg-success-subtle"
        style="backdrop-filter: blur(30px)"
      >
        <div class="card-body py-5 px-md-5">
          <h1 class="text-center">Register View</h1>
          <form @submit.prevent="addUser">
            <div class="row mb-3">
              <div class="col-md-12 col-sm-12 col-12">
                <label for="username" class="form-label">Username</label>
                <input
                  type="text"
                  class="form-control"
                  id="username"
                  @blur="() => validateUserName(true)"
                  @input="() => validateUserName(false)"
                  v-model="formData.username"
                />
                <div v-if="errors.username" class="text-danger">{{ errors.username }}</div>
              </div>
            </div>
            <div class="row mb-3">
              <div class="col-md-6 col-sm-6 col-6">
                <label for="fname" class="form-label">First Nname</label>
                <input
                  type="text"
                  class="form-control"
                  id="fname"
                  @blur="() => validateFName(true)"
                  @input="() => validateFName(false)"
                  v-model="formData.fname"
                />
                <div v-if="errors.fname" class="text-danger">{{ errors.fname }}</div>
              </div>

              <div class="col-md-6 col-sm-6 col-6">
                <label for="lname" class="form-label">Last Nname</label>
                <input
                  type="text"
                  class="form-control"
                  id="lname"
                  @blur="() => validateLName(true)"
                  @input="() => validateLName(false)"
                  v-model="formData.lname"
                />
                <div v-if="errors.lname" class="text-danger">{{ errors.lname }}</div>
              </div>
            </div>

            <div class="row mb-3">
              <div class="col-md-12 col-sm-12 col-12">
                <label for="email" class="form-label">Email</label>
                <input
                  type="email"
                  class="form-control"
                  id="email"
                  @blur="() => validateEmail(true)"
                  @input="() => validateEmail(false)"
                  v-model="formData.email"
                />
                <div v-if="errors.email" class="text-danger">{{ errors.email }}</div>
              </div>
            </div>
            <!-- password and confirm password -->
            <div class="row mb-3">
              <div class="col-md-12 col-sm-12 col-12">
                <label for="password" class="form-label">Password</label>
                <input
                  type="password"
                  class="form-control"
                  id="password"
                  @blur="() => validatePassword(true)"
                  @input="() => validatePassword(false)"
                  v-model="formData.password"
                />
                <div v-if="errors.password" class="text-danger">{{ errors.password }}</div>
              </div>
            </div>

            <div class="row mb-3">
              <div class="col-md-12 col-sm-12 col-12">
                <label for="confirm-password" class="form-label">Confirm Password</label>
                <input
                  type="password"
                  class="form-control"
                  id="confirm-password"
                  @blur="() => validateConfirmPassword(true)"
                  @input="() => validateConfirmPassword(false)"
                  v-model="confirmPassword"
                />
                <div v-if="errors.confirmPassword" class="text-danger">
                  {{ errors.confirmPassword }}
                </div>
              </div>
            </div>

            <div class="col-md-12 col-sm-12 col-12 mb-3">
              <label class="form-label" for="role">Role</label>
              <select
                class="form-select"
                id="role"
                @blur="() => validateRole(true)"
                @input="() => validateRole(false)"
                v-model="formData.role"
              >
                <option value="participant">Participant</option>
                <option value="volunteer">Volunteer</option>
                <!-- <option value="admin">Admin</option> -->
              </select>
              <div v-if="errors.role" class="text-danger">{{ errors.role }}</div>
            </div>
            <div class="text-center">
              <button type="submit" class="btn btn-primary me-2">Submit</button>
              <!-- <button type="button" class="btn btn-secondary" @click="clearForm">Clear</button> -->
            </div>
          </form>
        </div>
      </div>
    </div>
    <Toast />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { collection, doc, setDoc } from 'firebase/firestore'
import { db } from '../../firebase.js'
import { useToast } from 'primevue/usetoast'
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth'
import Toast from 'primevue/toast'
import axios from 'axios';

/**
 * Router instance for navigation.
 */
const router = useRouter()
const toast = useToast()

const auth = getAuth()
/**
 * Reactive array to store users.
 * @type {Array<Object>}
 */
const users = ref([])
/**
 * Reactive value for confirming the password.
 * @type {string}
 */
const confirmPassword = ref('')

/**
 * Reactive form data for user registration.
 * @type {Object}
 */
const formData = ref({
  username: '',
  lname: '',
  fname: '',
  password: '',
  role: '',
  email: ''
})

/**
 * Reactive object to store validation errors.
 * @type {Object}
 */
const errors = ref({
  username: null,
  password: null,
  role: null,
  confirmPassword: null,
  lname: null,
  fname: null
})

/**
 * Adds a new user after validating the form data.
 * @async
 * @function addUser
 */
const addUser = async () => {
  validateUserName(true)
  validatePassword(true)
  validateRole(true)
  validateConfirmPassword(true)
  validateFName(true)
  validateLName(true)
  validateEmail(true)
  if (Object.values(errors.value).some((error) => error !== null)) {
    try {
      const userData = { ...formData.value }
      handleRegister(userData)
    } catch (error) {
      console.error('Registration error:', error.response ? error.response.data : error.message)
    }
  }
}

/**
 * Registers a new user in the Firestore database.
 * @async
 * @function handleRegister
 * @param {Object} userData - The user data to register.
 */
const handleRegister = async (userData) => {
  try {
    createUserWithEmailAndPassword(auth, userData.email, userData.password)
      .then(async (data) => {
        console.log("Firebase Register Successful!")
        delete userData.password;
        userData.uid = data.user.uid;
        await setDoc(doc(db, 'Users', data.user.uid), userData);
        toast.add({ severity: 'success', summary: 'Register successfully' })
        const redirect = router.currentRoute.value.query.redirect || { name: 'Login' }
        router.push(redirect)
      })
      .catch((error) => {
        toast.add({ severity: 'danger', summary: 'Register failed', detail: error, life: 3000 })
      })

  } catch (error) {
    toast.add({ severity: 'danger', summary: 'Register failed' })
  }
}
/**
 * Validates the username field.
 * @function validateUserName
 * @param {boolean} blur - Indicates if the validation is triggered by a blur event.
 */
const validateUserName = (blur) => {
  if (formData.value.username.length < 3) {
    if (blur) errors.value.username = 'Name must be at least 3 characters'
  } else {
    errors.value.username = null
  }
}

/**
 * Validates the first name field.
 * @function validateFName
 * @param {boolean} blur - Indicates if the validation is triggered by a blur event.
 */
const validateFName = (blur) => {
  if (!formData.value.fname) {
    if (blur) errors.value.fname = 'Name is required.'
  } else if (!/^[A-Za-z]+$/.test(formData.value.fname)) {
    if (blur) errors.value.fname = 'Name should only contain letters.'
  } else {
    errors.value.fname = null
  }
}

/**
 * Validates the last name field.
 * @function validateLName
 * @param {boolean} blur - Indicates if the validation is triggered by a blur event.
 */
const validateLName = (blur) => {
  if (!formData.value.lname) {
    if (blur) errors.value.lname = 'Last Name is required.'
  } else if (!/^[A-Za-z]+$/.test(formData.value.lname)) {
    if (blur) errors.value.lname = 'Last name should only contain letters.'
  } else {
    errors.value.lname = null
  }
}

/**
 * Validates the password field.
 * @function validatePassword
 * @param {boolean} blur - Indicates if the validation is triggered by a blur event.
 */
const validatePassword = (blur) => {
  const password = formData.value.password
  const minLength = 8
  const hasUppercase = /[A-Z]/.test(password)
  const hasLowercase = /[a-z]/.test(password)
  const hasNumber = /\d/.test(password)
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password)

  if (password.length < minLength) {
    if (blur) errors.value.password = `Password must be at least ${minLength} characters long.`
  } else if (!hasUppercase) {
    if (blur) errors.value.password = 'Password must contain at least one uppercase letter.'
  } else if (!hasLowercase) {
    if (blur) errors.value.password = 'Password must contain at least one lowercase letter.'
  } else if (!hasNumber) {
    if (blur) errors.value.password = 'Password must contain at least one number.'
  } else if (!hasSpecialChar) {
    if (blur) errors.value.password = 'Password must contain at least one special character.'
  } else {
    errors.value.password = null
  }
}

/**
 * Validates the role field.
 * @function validateRole
 * @param {boolean} blur - Indicates if the validation is triggered by a blur event.
 */
const validateRole = (blur) => {
  if (!formData.value.gender) {
    if (blur) errors.value.gender = 'Please select an option.'
  } else {
    errors.value.gender = null
  }
}

/**
 * Validates the confirm password field.
 * @function validateConfirmPassword
 * @param {boolean} blur - Indicates if the validation is triggered by a blur event.
 */
const validateConfirmPassword = (blur) => {
  if (formData.value.password !== confirmPassword.value) {
    if (blur) errors.value.confirmPassword = 'Passwords do not match.'
  } else {
    errors.value.confirmPassword = null
  }
}

/**
 * Validates the email field.
 * @function validateEmail
 * @param {boolean} blur - Indicates if the validation is triggered by a blur event.
 */
const validateEmail = (blur) => {
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  if (!re.test(formData.value.email)) {
    if (blur) errors.value.email = 'Please enter a valid email address'
  } else {
    errors.value.email = null
  }
}
</script>

<style scoped></style>
