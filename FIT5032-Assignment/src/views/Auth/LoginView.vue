<template>
    <div class="card mx-4 mx-md-5 shadow-5-strong bg-success-subtle" style="
        
        backdrop-filter: blur(30px);
        ">
        <div class="card-body py-5 px-md-5">
            <form @submit.prevent="submitForm">
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
                        <p class="mb-0">Don't have an account? <router-link to="/register" class="text-black me-2" active-class="active">Register</router-link>
                        </p>
                    </div>
                </div>
            </form>
        </div>
    </div>
</template>

<script setup>
import { ref } from "vue";
import { useStore} from 'vuex'
import { useRouter } from 'vue-router';
const router = useRouter();
const store = useStore();

const formData = ref({
    username: '',
    password: ''
});

const submitForm = () => {
    // WHERE SHOULD WE STORE THE USER DATA AS LOCAL STORAGE IS NOT A GOOD APPROACH
    const allUsers = JSON.parse(localStorage.getItem('Users'));

    let user = null;
    user = allUsers._value.find(user => (user.username === formData.value.username && user.password === formData.value.password));

    if(user){
        store.commit('setAuthenticated', {isAuthenticated: true, user: user});
        const redirect = router.currentRoute.value.query.redirect || { name: 'Home' };
        console.log(store.state.isAuthenticated)
        console.log(store.state.details)
        router.push(redirect);
    } else {
        console.log("incorrect");
    }
};
</script>

<style>
</style>