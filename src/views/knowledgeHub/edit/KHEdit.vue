<template>
    <div class="col-8 offset-2 col-sm-8 offset-2">
        <h1 class="text-center">Knowledge Hub</h1>
        <input class="form-control mr-2 mr-sm-2" type="search" placeholder="Search" aria-label="Search" v-model="filters['global'].value">

        <div class="flex flex-wrap justify-end gap-2 text-end">
            <button class="btn btn-success bi bi-plus mr-2" severity="success" @click="openNew">New</button>
        </div>
        <DataTable :value="docs" :filters="filters" @rowClick="onRowClick">
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
            <form @submit.prevent="saveDocuments">
                <div class="flex flex-col gap-6">
                    <div class="mb-3">
                        <label for="title" class="block font-bold mb-3 form-label">Title</label>
                        <input type="text" id="title" class="form-control" v-model.trim="newDocument.title" required="true" autofocus fluid>
                    </div>

                    <!-- Author -->
                    <div>
                        <label for="author" class="block font-bold mb-3 form-label">Author:</label>
                        <input type="text" id="title" class="form-control" v-model="newDocument.author" />
                    </div>

                    <!-- Published Date -->
                    <div>
                        <label for="publishedDate" class="block font-bold mb-3 form-label">Published Date:</label>
                        <input type="date" id="title" class="form-control" v-model="newDocument.date" />
                    </div>

                    <div class="mb-3">
                        <label for="content" class="block font-bold mb-3 form-label">Content</label>
                        <!-- <textarea class="form-control" id="content" v-model="newDocument.content" required="true" rows="3" fluid></textarea> -->
                        <QuillEditor theme="snow" class="form-control" id="content" v-model:content="newDocument.content" content-type="html" required="true" />
                    </div>
                    <div class="mb-3">
                        <label for="category" class="block font-bold mb-3 form-label">Category</label>
                        <select v-model="newDocument.category" class="form-control">
                            <option v-for="category in categories" :key="category.value" :value="category.value">
                                {{ category.label }}
                            </option>
                        </select>
                    </div>
                </div>
                <div>
                    <button class="bi bi-times btn btn-light" text @click="hideDialog">Cancel</button>
                    <button class="bi bi-check btn btn-primary">Save</button>
                </div>
            </form>
        </Dialog>

        <Dialog v-model:visible="deleteDocDialog"  header="Confirm" :modal="true">
            <div class="flex items-center gap-4">
                <i class="pi pi-exclamation-triangle !text-3xl" />
                <span v-if="doc">Are you sure you want to delete <b>{{ row.title }}</b>?</span>
            </div>
            <div class="flex flex-wrap justify-end gap-2 text-end">
                <button class="bi bi-times btn btn-light" @click="deleteDocDialog = false">No</button>
                <button class="bi bi-check btn btn-primary" @click="deleteDocuments">Yes</button>
            </div>
        </Dialog>
    </div>
</template>

<script setup>
    import { ref, onMounted, computed, watch} from 'vue';
    import DataTable from "primevue/datatable";
    import Column from "primevue/column";
    import router from '@/router/index.js';
    import Dialog from 'primevue/dialog';
    import { useToast } from 'primevue/usetoast';
    import Toast from 'primevue/toast';
    import { FilterMatchMode } from "@primevue/core/api"
    import { QuillEditor } from '@vueup/vue-quill'
    import '@vueup/vue-quill/dist/vue-quill.snow.css';
    import DOMPurify from 'dompurify';
    import { collection, doc, setDoc, deleteDoc } from 'firebase/firestore';
    import { db } from '../../../firebase.js'
    /**
     * Toast instance for displaying notifications.
     */
    const toast = useToast();
    /**
     * Reactive reference to store all documents in the database.
     */
    const docs = ref([]);
    /**
     * Reactive reference to the document that store in the row.
     */
    const row = ref();
    /**
     * Reactive reference to control the visibility of the add document dialog.
     */
    const addDocumentDialog = ref(false);
    /**
     * Reactive reference to control the visibility of the delete document dialog.
     */
    const deleteDocDialog = ref(false);

    /**
     * Reactive reference for a new document.
     */
    const newDocument = ref({
        title: '',
        author: '',
        date: '',
        content: '',
        category: '',
        rating: [0,0]
    });

    /**
     * Reactive reference for document categories.
     */
    const categories = ref([
        {label: 'School', value: 'school'},
        {label: 'Understanding Behavior', value: 'understanding behavior'},
        {label: 'Family Dynamics', value: 'family dynamics'},
        {label: 'Funding', value: 'funding'}
    ]);

    /**
     * Lifecycle hook that runs when the component is mounted.
     */
    onMounted(() => {
        updateFromLocalStorage()
    });

    /**
     * Updates the documents from localStorage.
     */
    const updateFromLocalStorage = () => {
        const fromLocal = JSON.parse(localStorage.getItem('documents'));
        const all = fromLocal.flatMap((category) => category.documents);
        docs.value = all;
    }

    /**
     * Handles the row click event and navigates to the document page.
     * @param {Object} event - The event object containing row data.
     */
    const onRowClick = (event) => {
        const document = event.data;
        router.push({
            name: 'DocumentPage',
            params: {id: document.id}
        })
    }

    /**
     * Opens the add document dialog.
     */
    const openNew = () => {
        document.value = {};
        addDocumentDialog.value = true;
    };

    /**
     * Hides the add document dialog.
     */
    const hideDialog = () => {
        addDocumentDialog.value = false;
    };

    /**
     * Confirms the deletion of a document.
     * @param {Object} prod - The document to be deleted.
     */
    const confirmDeleteDocs = (prod) => {
        row.value = prod;
        deleteDocDialog.value = true;
    };

    /**
     * Reactive reference to store filter settings.
     * @type {Object}
     */
     const filters = ref({
            'global': {value: null, matchMode: FilterMatchMode.CONTAINS},
    });
    /**
     * Deletes the selected document from Firestore.
     */ 
    const deleteDocuments = async() => {
        const response = await deleteDoc(doc(collection(db, 'knowledgeHub'), row.value.id));
        deleteDocDialog.value = false;
        row.value = {};
        updateFromLocalStorage();
        toast.add({severity:'success', summary: 'Successful', detail: 'Document Deleted', life: 3000});
    };

    /**
     * Saves a new document to Firestore.
     */
    const saveDocuments = async () => {
        newDocument.value.content = DOMPurify.sanitize(newDocument.value.content);
        try {
            const response = await setDoc(doc(collection(db, 'knowledgeHub')), newDocument.value);
            toast.add({severity:'success', summary: 'Successful', detail: 'Document Added', life: 3000});
            hideDialog();
            updateFromLocalStorage();
        } catch (error) {
            toast.add({severity:'success', summary: 'Successful', detail: error.message, life: 3000});
        }
    }
</script>



<style scoped>


</style>