<template>
    <form @submit.prevent="submitForm">
        <!-- Username -->
        <div class="row mb-3">
            <div class="col-md-12 col-sm-12 col-12">
                <label for="username" class="form-label">Username</label>
                <input type="email" id="username" class="form-control" placeholder="Email address" required="" autofocus="" autocomplete="off"  v-model="formData.username">
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
            <router-link to="/register" class="btn btn-secondary text-white me-2" active-class="active">Register</router-link>
        </div>
    </form>

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
    if(formData.value.username == "admin" && formData.value.password == "pass"){
        store.commit('setAuthenticated', true);
        const redirect = router.currentRoute.value.query.redirect || { name: 'Home' };
        router.push(redirect);
    } else {
        console.log("incorrect");
    }
};
</script>

<style>
</style>