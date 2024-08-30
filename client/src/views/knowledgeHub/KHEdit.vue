<template>
    <div class="flex flex-wrap justify-end gap-2 text-end">
        <button class="btn btn-success bi bi-plus mr-2" severity="success" @click="openNew">New</button>
    </div>
    <DataTable v-model:selection="selectedDocuments" :value="docs" @rowClick="onRowClick">
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
            <div class="flex flex-col gap-6">
                <div class="mb-3">
                    <label for="title" class="block font-bold mb-3 form-label">Title</label>
                    <input type="text" id="title" class="form-control" v-model.trim="newDocument.name" required="true" autofocus fluid>
                    <!-- <small v-if="submitted && !product.name" class="text-red-500">Name is required.</small> -->
                </div>
                <div class="mb-3">
                    <label for="content" class="block font-bold mb-3 form-label">Content</label>
                    <textarea class="form-control" id="content" v-model="newDocument.content" required="true" rows="3" fluid></textarea>
                </div>
                <div class="mb-3">
                    <label for="formFile" class="form-label">or Upload a document</label>
                    <input class="form-control" type="file" id="formFile">
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
                <button class="bi bi-check btn btn-primary" @click="saveProduct">Save</button>
            </template>
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
import { knowledgeHub } from '../../assets/knowledgeHub/documents.js';
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import router from '@/router/index.js';
import Dialog from 'primevue/dialog';
import { useToast } from 'primevue/usetoast';
import Toast from 'primevue/toast';
const toast = useToast();
// all documents in the database
const docs = ref();
const newDocument = ref({});
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
</script>

<style scoped>


</style>