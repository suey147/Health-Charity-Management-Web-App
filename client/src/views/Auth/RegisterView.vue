<template>
    <div class="card mx-4 mx-md-5 shadow-5-strong bg-success-subtle" style="backdrop-filter: blur(30px);">
        <div class="card-body py-5 px-md-5">
            <h1 class="text-center">Register View</h1>
            <form @submit.prevent="addUser">
                <div class="row mb-3">
                    <div class="col-md-12 col-sm-12 col-12">
                        <label for="username" class="form-label">Username</label>
                        <input type="text" class="form-control" id="username" 
                            @blur="() => validateUserName(true)" 
                            @input="() => validateUserName(false)"
                            v-model="formData.username">
                        <div v-if="errors.username" class="text-danger">{{ errors.username }}</div>
                    </div>
                </div>
                <div class="row mb-3">
                    <div class="col-md-6 col-sm-6 col-6">
                        <label for="fname" class="form-label">First Nname</label>
                        <input type="text" class="form-control" id="fname" 
                            @blur="() => validateFName(true)" 
                            @input="() => validateFName(false)"
                            v-model="formData.fname">
                        <div v-if="errors.fname" class="text-danger">{{ errors.fname }}</div>
                    </div>

                    <div class="col-md-6 col-sm-6 col-6">
                        <label for="lname" class="form-label">Last Nname</label>
                        <input type="text" class="form-control" id="lname" 
                            @blur="() => validateLName(true)" 
                            @input="() => validateLName(false)"
                            v-model="formData.lname">
                        <div v-if="errors.lname" class="text-danger">{{ errors.lname }}</div>
                    </div>
                </div>

                <div class="row mb-3">
                    <div class="col-md-12 col-sm-12 col-12">
                        <label for="email" class="form-label">Email</label>
                        <input type="email" class="form-control" id="email" 
                            @blur="() => validateEmail(true)" 
                            @input="() => validateEmail(false)"
                            v-model="formData.email">
                        <div v-if="errors.email" class="text-danger">{{ errors.email }}</div>
                    </div>
                </div>
                <!-- password and confirm password -->
                <div class="row mb-3">
                    <div class="col-md-12 col-sm-12 col-12">
                        <label for="password" class="form-label">Password</label>
                        <input type="password" class="form-control" id="password" 
                            @blur="() => validatePassword(true)" 
                            @input="() => validatePassword(false)"
                            v-model="formData.password">
                        <div v-if="errors.password" class="text-danger">{{ errors.password }}</div>
                    </div>
                </div>

                <div class="row mb-3">
                    <div class="col-md-12 col-sm-12 col-12">
                        <label for="confirm-password" class="form-label">Confirm Password</label>
                        <input type="password" class="form-control" id="confirm-password" 
                            @blur="() => validateConfirmPassword(true)" 
                            @input="() => validateConfirmPassword(false)" v-model="confirmPassword">
                        <div v-if="errors.confirmPassword" class="text-danger">{{ errors.confirmPassword }}</div>
                    </div>
                </div>

                <div class="col-md-12 col-sm-12 col-12 mb-3">
                        <label class="form-label" for="role">Role</label>
                        <select class="form-select" id="role" 
                            @blur="() => validateRole(true)" 
                            @input="() => validateRole(false)"
                            v-model="formData.role">
                            <option value="user">Participant</option>
                            <option value="user">Volunteer</option>
                            <option value="admin">Admin</option>
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
</template>

<script setup>
    import { ref } from "vue";
    import { useRouter } from 'vue-router';
    const router = useRouter();
    
    const formData = ref({
        username: '',
        lname: '',
        fname: '',
        password: '', 
        role: '',
        email: ''
    });

    const users = ref([]);

    const addUser = async () => {
        validateUserName(true);
        validatePassword(true);
        validateRole(true);
        validateConfirmPassword(true);
        validateFName(true);
        validateLName(true);
        if(Object.values(errors.value).some(error => error !== null)){
            try {
                const userData = {...formData.value};

                const registeredUser = await register(userData);

                const redirect = router.currentRoute.value.query.redirect || { name: 'Home' };
                router.push(redirect);
            }
             catch (error) {
                console.error("Registration error:", error.response ? error.response.data : error.message);
            }
        }
    };

    const errors = ref({
        username: null,
        password: null,
        role: null,
        confirmPassword: null,
        lname: null,
        fname: null
    });

    const validateUserName = (blur) => {
        if (formData.value.username.length <3){
            if(blur) errors.value.username = "Name must be at least 3 characters";
        } else {
            errors.value.username = null;
        }
    }
    const validateFName = (blur) => {
        if (!formData.value.fname) {
            if(blur) errors.value.fname = 'Name is required.';
        } else if (!/^[A-Za-z]+$/.test(formData.value.fname)) {
            if(blur) errors.value.fname = 'Name should only contain letters.';
        } else {
            errors.value.fname = null;
        }
    }

    const validateLName = (blur) => {
        if (!formData.value.lname) {
            if(blur) errors.value.lname = 'Last Name is required.';
        } else if (!/^[A-Za-z]+$/.test(formData.value.lname)) {
            if(blur) errors.value.lname = 'Last name should only contain letters.';
        } else {
            errors.value.lname = null;
        }
    }

    const validatePassword = (blur) => {
        const password = formData.value.password;
        const minLength = 8;
        const hasUppercase = /[A-Z]/.test(password);
        const hasLowercase = /[a-z]/.test(password);
        const hasNumber = /\d/.test(password);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

        if (password.length < minLength){
            if (blur) errors.value.password = `Password must be at least ${minLength} characters long.`;
        } else if (!hasUppercase) {
            if (blur) errors.value.password = "Password must contain at least one uppercase letter.";
        } else if (!hasLowercase) {
            if (blur) errors.value.password = "Password must contain at least one lowercase letter.";
        } else if (!hasNumber) {
            if (blur) errors.value.password = "Password must contain at least one number.";
        } else if (!hasSpecialChar) {
            if (blur) errors.value.password = "Password must contain at least one special character.";
        } else {
            errors.value.password = null;
        }
    }

    const validateRole = (blur) => {
        if (!formData.value.gender) {
            if (blur) errors.value.gender = 'Please select an option.';
        } else {
            errors.value.gender = null;
        }
    }
    const confirmPassword = ref("");
    const validateConfirmPassword = (blur) => {   
        if (formData.value.password !== confirmPassword.value) {
            if (blur) errors.value.confirmPassword = 'Passwords do not match.'
        } else {
            errors.value.confirmPassword = null
        }
    }

    const validateEmail = (blur) => {
        if (formData.value.email.length <3){
            if(blur) errors.value.email = "Name must be at least 3 characters";
        } else {
            errors.value.email = null;
        }
    }
</script>

<style scoped>


</style>