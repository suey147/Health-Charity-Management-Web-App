<template>
  <Toast />
  <div class="container mt-5">
    <div class="col-md-8 offset-md-2">
      <div
        class="card mx-4 mx-md-5 shadow-5-strong bg-success-subtle"
        style="backdrop-filter: blur(30px)"
      >
        <div class="card-body py-5 px-md-5">
          <form @submit.prevent="handleSubmit">
            <!-- Username -->
            <div class="row mb-3">
              <!-- <div class="col-md-12 col-sm-12 col-12">
                <label for="username" class="form-label">Username</label>
                <input
                  type="text"
                  id="username"
                  class="form-control"
                  placeholder="Email address"
                  required=""
                  autofocus=""
                  autocomplete="off"
                  v-model="formData.username"
                />
              </div> -->
              <div class="col-md-12 col-sm-12 col-12">
                <label for="email" class="form-label">Email</label>
                <input
                  type="text"
                  id="email"
                  class="form-control"
                  placeholder="Email address"
                  required=""
                  autofocus=""
                  autocomplete="off"
                  v-model="formData.email"
                />
              </div>
            </div>
            <!-- password -->
            <div class="row mb-3">
              <div class="col-md-12 col-sm-12 col-12">
                <label for="password" class="form-label">password</label>
                <input
                  type="password"
                  class="form-control"
                  id="Password"
                  v-model="formData.password"
                  required
                />
              </div>
            </div>

            <!-- submit -->
            <div class="text-center">
              <button type="submit" class="btn btn-primary me-2">Submit</button>
              <div>
                <p class="mb-0">
                  Don't have an account?
                  <router-link
                    :to="{ path: '/register', query: { redirect: '/login' } }"
                    class="text-black me-2"
                    active-class="active"
                    >Register</router-link
                  >
                </p>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { db } from '../../firebase.js'
import { collection, getDoc, doc } from 'firebase/firestore'
import { useToast } from 'primevue/usetoast'
import { getAuth, signInWithEmailAndPassword  } from 'firebase/auth'
import Toast from 'primevue/toast'
/**
 * Router instance for navigation.
 */
const router = useRouter()

/**
 * Vuex store instance for state management.
 */
const store = useStore()

/**
 * Reactive form data for user credentials.
 */
const formData = ref({
//   username: '',
    email: '',
    password: ''
})

/**
 * Toast instance for displaying notifications.
 */
const toast = useToast()

/**
 * firebase authentication instance.
 */
const auth = getAuth();

/**
 * Handles form submission for user authentication.
 * @async
 * @function handleSubmit
 */
const handleSubmit = () => {
    const { email, password } = formData.value
    signInWithEmailAndPassword(getAuth(), email, password)
    .then(async (data) => {
        console.log("Firebase Login Successful!");
        const roleDoc = await getDoc(doc(db, 'Users', auth.currentUser.uid));
        store.commit('setAuthenticated', {isAuthenticated: true, userDetails: roleDoc.data(), currentUser: auth.currentUser.uid})
        const redirect = router.currentRoute.value.query.redirect || { name: 'Home' };
        router.push(redirect).then(() => {
            window.location.reload();
        });
    }).catch ((error) => {
        console.log(error.code);
    })
}
</script>

<style></style>
