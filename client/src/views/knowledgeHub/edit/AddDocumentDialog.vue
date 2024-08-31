<template>
        <Dialog v-model:visible="addDocumentDialog"  header="Add new document" :modal="true">
            <div class="flex flex-col gap-6">
                <div class="mb-3">
                    <label for="title" class="block font-bold mb-3 form-label">Title</label>
                    <input type="text" id="title" class="form-control" v-model.trim="newDocument.title" required="true" autofocus fluid>
                </div>

                <!-- Author -->
                <div>
                    <label for="author">Author:</label>
                    <input type="text" v-model="newDocument.author" />
                </div>

                <!-- Published Date -->
                <div>
                    <label for="publishedDate">Published Date:</label>
                    <input type="date" v-model="newDocument.publishedDate" />
                </div>

                <div class="mb-3">
                    <label for="content" class="block font-bold mb-3 form-label">Content</label>
                    <QuillEditor theme="snow" class="form-control" id="content" v-model:content="newDocument.content" content-type="HTML" required="true" />
                </div> 
                <div class="mb-3">
                    <label for="category" class="block font-bold mb-3 form-label">Category</label>
                    <select v-model="newDocument.selectedCategory" class="form-control">
                        <option v-for="category in categories" :key="category.value" :value="category.value">
                            {{ category.label }}
                        </option>
                    </select>
                </div>
            </div>
            <template #footer>
                <button class="bi bi-times btn btn-light" text @click="hideDialog">Cancel</button>
                <button class="bi bi-check btn btn-primary" @click="saveDocuments">Save</button>
            </template>
    </Dialog>

</template>


<script setup>
import { ref } from 'vue';
import Dialog from 'primevue/dialog';
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css';
import DOMPurify from 'dompurify';
import axios from 'axios'

const newDocument = ref({
    title: '',
    author: '',
    publishedDate: '',
    content: '',
    selectedCategory: ''
});
const addDocumentDialog = ref(false);

const categories = ref([
    {label: 'School', value: 'school'},
    {label: 'Understanding Behavior', value: 'understanding behavior'},
    {label: 'Family Dynamics', value: 'family dynamics'},
    {label: 'Funding', value: 'funding'}
]);

const saveDocuments = async () => {
    newDocument.value.content = DOMPurify.sanitize(newDocument.value.content);

    try {
            const response = await axios.post('http://localhost:5000/addDocument', newDocument);
            const message = response.data.message;
            console.log(message);
        } catch (error) {
            console.log('Error' + error.message);
        }
}
</script>