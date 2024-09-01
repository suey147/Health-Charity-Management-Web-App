<template>
    <div class="container mt-5">
        <div class="col-md-8 offset-md-2">
            <div class="card mx-4 mx-md-5 shadow-5-strong bg-success-subtle" style="
                
                backdrop-filter: blur(30px);
                ">
                <div class="card-body py-5 px-md-5">
                    <form @submit.prevent="handleSubmit">
                        <!-- Username -->
                        <div class="row mb-3">
                            <div class="col-md-12 col-sm-12 col-12">
                                <label for="username" class="form-label">Username</label>
                                <input type="text" id="username" class="form-control" placeholder="Email address" required="" autofocus="" autocomplete="off"  v-model="formData.username">
                            </div>
                        </div>
                        <!-- password -->
                        <div class="row mb-3">
                            <div class="col-md-12 col-sm-12 col-12">
                                <label for="password" class="form-label">password</label>
                                <input type="password" class="form-control" id="Password" v-model="formData.password" required>
                            </div>
                        </div>

                        <!-- submit -->
                        <div class="text-center">
                            <button type="submit" class="btn btn-primary me-2">Submit</button>
                            <div>
                                <p class="mb-0">Don't have an account? <router-link :to="{ path: '/register', query: { redirect: '/login'} }" class="text-black me-2" active-class="active">Register</router-link>
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
import { ref } from "vue";
import { useStore} from 'vuex'
import { useRouter } from 'vue-router';
import { db } from '../../firebase.js'
import { collection, getDocs } from 'firebase/firestore';

const router = useRouter();
const store = useStore();

const formData = ref({
    username: '',
    password: ''
});

const handleSubmit = async () => {
    const {username, password} = formData.value;
    try {
        const doc = await getDocs(collection(db, 'Users'));
        const users = doc.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        users.forEach((user) => {
            if (user.username == username && user.password == password)
            {
                store.commit('setAuthenticated', { isAuthenticated: true, user: user });
                const redirect = router.currentRoute.value.query.redirect || { name: 'Home' };
                router.push(redirect);
            }
        });
      } catch (error) {
        console.log(error)
      }
};

</script>

<style>
</style>