<template>
        <Dialog v-model:visible="addDocumentDialog"  header="Add new document" :modal="true">
            <div class="flex flex-col gap-6">
                <div class="mb-3">
                    <label for="title" class="block font-bold mb-3 form-label">Title</label>
                    <input type="text" id="title" class="form-control" v-model.trim="newDocument.name" required="true" autofocus fluid>
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

                <!-- Tags -->
                <div>
                    <label for="tags">Tags (comma-separated):</label>
                    <input type="text" v-model="tagsInput" @change="handleTagsChange" />
                </div>

                <!-- Sections -->
                <div v-for="(section, index) in article.sections" :key="index">
                    <label>Section Heading:</label>
                    <input type="text" v-model="section.heading" />

                    <label>Section Content:</label>
                    <!-- Quill Rich Text Editor -->
                    <quill-editor v-model="section.content" />
                    <QuillEditor theme="snow" v-model="section.content" required="true" />
                </div>

                <!-- Add Section Button -->
                <button type="button" @click="addSection">Add Section</button>

                <!-- <div class="mb-3">
                    <label for="content" class="block font-bold mb-3 form-label">Content</label>
                    <textarea class="form-control" id="content" v-model="newDocument.content" required="true" rows="3" fluid></textarea>
                    <QuillEditor theme="snow" class="form-control" id="content" v-model="newDocument.content" required="true" />
                </div> -->
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
import { ref, onMounted} from 'vue';
import Dialog from 'primevue/dialog';
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css';


const newDocument = ref({});

const addDocumentDialog = ref(false);

const categories = ref([
    {label: 'School', value: 'school'},
    {label: 'Understanding Behavior', value: 'understanding behavior'},
    {label: 'Family Dynamics', value: 'family dynamics'},
    {label: 'Funding', value: 'funding'}
]);
</script>