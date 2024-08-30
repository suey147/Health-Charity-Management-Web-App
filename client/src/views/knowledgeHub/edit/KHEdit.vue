<template>
    <h1 class="text-center">Knowledge Hub</h1>
    <input class="form-control mr-sm-2" type="search" placeholder="Search" aria-label="Search" v-model="filters['global'].value">

    <div class="flex flex-wrap justify-end gap-2 text-end">
        <button class="btn btn-success bi bi-plus mr-2" severity="success" @click="openNew">New</button>
    </div>
    <DataTable v-model:selection="selectedDocuments" :value="docs" :filters="filters" @rowClick="onRowClick">
        <!-- <Column selectionMode="multiple" style="width: 3rem"></Column> -->
        <Column field="id" header="Id" sortable></Column>
        <Column field="title" header="Title" sortable></Column>
        <Column field="date" header="Date" sortable></Column>
        <Column field="rating" header="Reviews"></Column>
        <Column :exportable="false" style="min-width: 12rem">
            <template #body="slotProps">
                <button class="bi bi-pencil btn btn-light mr-2" outlined rounded @click="editProduct(slotProps.data)" />
                <button class="bi bi-trash btn btn-light" outlined rounded severity="danger" @click="confirmDeleteDocs(slotProps.data)" />
            </template>
        </Column>
    </DataTable>

    <!--Took Row Expansion example from PrimeVue as example-->
    <Toast />

    <Dialog v-model:visible="addDocumentDialog"  header="Add new document" :modal="true">
        <form @submit.prevent="handleAddNew">
            <div class="flex flex-col gap-6">
                <div class="mb-3">
                    <label for="title" class="block font-bold mb-3 form-label">Title</label>
                    <input type="text" id="title" class="form-control" v-model.trim="newDocument.name" required="true" autofocus fluid>
                </div>

                <!-- Author -->
                <div>
                    <label for="author" class="block font-bold mb-3 form-label">Author:</label>
                    <input type="text" id="title" class="form-control" v-model="newDocument.author" />
                </div>

                <!-- Published Date -->
                <div>
                    <label for="publishedDate" class="block font-bold mb-3 form-label">Published Date:</label>
                    <input type="date" id="title" class="form-control" v-model="newDocument.publishedDate" />
                </div>

                <!-- Tags -->
                <!-- <div>
                    <label for="tags" class="block font-bold mb-3 form-label">Tags (comma-separated):</label>
                    <input type="text" id="title" class="form-control" v-model="tagsInput" @change="handleTagsChange" />
                </div> -->

                <div class="mb-3">
                    <label for="content" class="block font-bold mb-3 form-label">Content</label>
                    <!-- <textarea class="form-control" id="content" v-model="newDocument.content" required="true" rows="3" fluid></textarea> -->
                    <QuillEditor theme="snow" class="form-control" id="content" v-model:content="newDocument.content" content-type="html" required="true" />
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
            <div>
                <button class="bi bi-times btn btn-light" text @click="hideDialog">Cancel</button>
                <button class="bi bi-check btn btn-primary" @click="saveDocuments">Save</button>
            </div>
        </form>
    </Dialog>

    <Dialog v-model:visible="deleteDocDialog"  header="Confirm" :modal="true">
        <div class="flex items-center gap-4">
            <i class="pi pi-exclamation-triangle !text-3xl" />
            <span v-if="doc">Are you sure you want to delete <b>{{ doc.title }}</b>?</span>
        </div>
        <div class="flex flex-wrap justify-end gap-2 text-end">
            <button class="bi bi-times btn btn-light" @click="deleteDocDialog = false">No</button>
            <button class="bi bi-check btn btn-primary" @click="deleteDocuments">Yes</button>
        </div>
    </Dialog>
</template>

<script setup>
import { ref, onMounted} from 'vue';
import { knowledgeHub } from '../../../assets/knowledgeHub/documents.js';
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import router from '@/router/index.js';
import Dialog from 'primevue/dialog';
import { useToast } from 'primevue/usetoast';
import Toast from 'primevue/toast';
import { FilterMatchMode } from "@primevue/core/api"
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css';

const toast = useToast();
// all documents in the database
const docs = ref();
// selected douments with multiple selection
const selectedDocuments = ref();
// doc in the row
const doc = ref({});

// dialogs
const addDocumentDialog = ref(false);
const deleteDocDialog = ref(false);
onMounted(() => {
    docs.value = knowledgeHub.getKnowledge().flatMap((category) => category.documents);
});

const categories = ref([
    {label: 'School', value: 'school'},
    {label: 'Understanding Behavior', value: 'understanding behavior'},
    {label: 'Family Dynamics', value: 'family dynamics'},
    {label: 'Funding', value: 'funding'}
]);

const onRowClick = (event) => {
    const document = event.data;
    router.push({
        name: 'DocumentPage',
        params: {id: document.id}
    })
}

const openNew = () => {
    document.value = {};
    // submitted.value = false;
    addDocumentDialog.value = true;
};
const hideDialog = () => {
    addDocumentDialog.value = false;
    // submitted.value = false;
};

// DELETE
const confirmDeleteDocs = (prod) => {
    doc.value = prod;
    deleteDocDialog.value = true;
};
const deleteDocuments = () => {
    docs.value = docs.value.filter(document => document.id !== doc.value.id);
    deleteDocDialog.value = false;
    doc.value = {};
    toast.add({severity:'success', summary: 'Successful', detail: 'Document Deleted', life: 3000});
};

const filters = ref({
        'global': {value: null, matchMode: FilterMatchMode.CONTAINS},
});

const newDocument = ref({
    title: '',
    author: '',
    publishedDate: '',
    content: '',
    selectedCategory: ''
});
const handleAddNew = () => {
    console.log(JSON.stringify(newDocument.value.content.ops, null, 2))
    console.log(newDocument.value)
}
</script>



<style scoped>


</style>