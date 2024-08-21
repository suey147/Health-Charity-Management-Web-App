<template>
    <h1 class="text-center">Register View</h1>

    <form @submit.prevent="submitForm">
        <div class="row mb-3">
            <div class="col-md-12 col-sm-12 col-12">
                <label for="username" class="form-label">Username</label>
                <input type="text" class="form-control" id="username" 
                    @blur="() => validateName(true)" 
                    @input="() => validateName(false)"
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
                    @input="() => validateConfirmPassword(false)"
                    v-model="formData.confirmPassword">
                <div v-if="errors.confirmPassword" class="text-danger">{{ errors.confirmPassword }}</div>
            </div>
        </div>

        <div class="col-md-12 col-sm-12 col-12 mb-3">
                <label class="form-label" for="role">Role</label>
                <select class="form-select" id="role" 
                    @blur="() => validateRole(true)" 
                    @input="() => validateRole(false)"
                    v-model="formData.role">
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                </select>
                <div v-if="errors.role" class="text-danger">{{ errors.role }}</div>
        </div>
        <div class="text-center">
            <button type="submit" class="btn btn-primary me-2">Submit</button>
            <!-- <button type="button" class="btn btn-secondary" @click="clearForm">Clear</button> -->
        </div>
    </form>
</template>

<script setup>
    import { ref } from "vue";

    const formData = ref({
        username: '',
        lname: '',
        fname: '',
        password: '',
        confirmPassword: '',
        role: '',
        email: ''
    });

    const submittedCards = ref([]);

    const submitForm = () => {
        validateName(true);
        validatePassword(true);
        validateRole(true);
        validateConfirmPassword(true);
        
        if(!errors.value.username && !errors.value.password && !validateRole && !validateConfirmPassword){
            submittedCards.value.push({
            ...formData.value
            });
            // clearForm();
        }
    };

    const errors = ref({
        username: null,
        password: null,
        role: null,
    });

    const validateName = (blur) => {
        if (formData.value.username.length <3){
            if(blur) errors.value.username = "Name must be at least 3 characters";
        } else {
            errors.value.username = null;
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

    const validateConfirmPassword = (blur) => {
        if (formData.value.password !== formData.value.confirmPassword) {
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