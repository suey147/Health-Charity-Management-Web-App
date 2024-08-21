<template>
    <form @submit.prevent="submitForm">
        <!-- Username -->
        <div class="row mb-3">
            <div class="col-md-12 col-sm-12 col-12">
                <label for="username" class="form-label">Username</label>
                <input type="text" class="form-control" id="username" 
                    v-model="formData.username">
                <!-- <div v-if="errors.username" class="text-danger">{{ errors.username }}</div> -->
            </div>
        </div>
        <!-- password -->
        <div class="row mb-3">
            <div class="col-md-12 col-sm-12 col-12">
                <label for="password" class="form-label">password</label>
                <input type="text" class="form-control" id="password" 
                    v-model="formData.password">
                <!-- <div v-if="errors.password" class="text-danger">{{ errors.password }}</div> -->
            </div>
        </div>

        <!-- submit -->
        <div class="text-center">
            <button type="submit" class="btn btn-primary me-2">Submit</button>
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