<template>
    <h1 class="text-center">Knowledge Hub</h1>
    <div class="col-md-8 col-8 offset-2 offset-md-2">
        <input class="form-control mr-sm-2" type="search" placeholder="Search" aria-label="Search" v-model="filters['global'].value">

        <DataTable v-model:expandedRows="expandedRows" :value="docs" dataKey="id"
                @rowExpand="onRowExpand" @rowCollapse="onRowCollapse" v-if="!isSearching">
            <template #header>
                <div class="flex flex-wrap justify-end gap-2 text-end">
                    <button class="btn-light btn bi bi-plus" @click="expandAll">Expand All</button>
                    <button class="btn-light btn bi bi-dash" @click="collapseAll">Collapse All</button>
                    <RouterLink class="btn-light btn bi bi-gear" v-if="$store.getters.isAdmin" to="/knowledge-hub/edit"> Edit</RouterLink>
                </div>
            </template>

            <template>
                <Column field="category" header="Category" class="bg-info" ></Column>
                <Column expander style="width: 3rem" class="bg-info"/>
            </template>
            <template #expansion="slotProps" >
                <div class="p-4">
                    <DataTable :value="slotProps.data.documents" @rowClick="onRowClick">
                        <Column field="title" header="Title" sortable></Column>
                        <Column field="date" header="Date" sortable></Column>
                        <Column header="Reviews">
                            <template #body="rating">
                                {{ rating.data.rating[0] }}
                            </template>
                        </Column>
                    </DataTable>
                </div>
            </template>
        </DataTable>

        <DataTable v-model:selection="docs" :filters="filters" :value="combinedDocuments" @rowClick="onRowClick" v-if="isSearching">
            <Column field="id" header="Id" sortable></Column>
            <Column field="title" header="Title" sortable></Column>
            <Column field="date" header="Date" sortable></Column>
            <Column field="rating" header="Reviews"></Column>
        </DataTable>
    </div>
</template>

<script setup>
    import { ref, onMounted, computed} from 'vue';
    import { useToast } from 'primevue/usetoast';
    import DataTable from "primevue/datatable";
    import Column from "primevue/column";
    import router from '@/router/index.js';
    import { FilterMatchMode } from "@primevue/core/api"

    /**
     * Reactive reference to store documents.
     */
    const docs = ref();
    /**
     * Reactive reference to store expanded rows.
     */
    const expandedRows = ref({});
    /**
     * Toast instance for displaying notifications.
     */
    const toast = useToast();

    /**
     * Lifecycle hook that runs when the component is mounted.
     * @function onMounted
     */
    onMounted(() => {
        getDocumentsData();
    });

    /**
     * Fetches document data from localStorage and updates the docs reference.
     * @function getDocumentsData
     */
    const getDocumentsData= () => {
        const dataString = localStorage.getItem('documents');
        const alldocs = JSON.parse(dataString);   
        docs.value = alldocs;
    }

    /**
     * Handles the row expand event and displays a toast notification.
     * @function onRowExpand
     * @param {Object} event - The event object containing row data.
     */
    const onRowExpand = (event) => {
        toast.add({ severity: 'info', summary: 'Row Expanded', detail: event.data.name, life: 3000 });
    };

    /**
     * Handles the row collapse event and displays a toast notification.
     * @function onRowCollapse
     * @param {Object} event - The event object containing row data.
     */
    const onRowCollapse = (event) => {
        toast.add({ severity: 'success', summary: 'Row Collapsed', detail: event.data.name, life: 3000 });
    };

    /**
     * Expands all rows in the document table.
     * @function expandAll
     */
    const expandAll = () => {
        expandedRows.value = docs.value.reduce((acc, p) => (acc[p.id] = true) && acc, {});
    };

    /**
     * Collapses all rows in the document table.
     * @function collapseAll
     */
    const collapseAll = () => {
        expandedRows.value = null;
    };

    /**
     * Handles the row click event and navigates to the document page.
     * @function onRowClick
     * @param {Object} event - The event object containing row data.
     */
    const onRowClick = (event) => {
        const documentId = event.data;
        console.log(documentId.id)
        router.push({
            name: 'DocumentPage',
            params: {id: documentId.id}
        })
    }

    /**
     * Computes a flat array of all documents from the categorized documents.
     * @function combinedDocuments
     * @returns {Array<Object>} The combined array of documents.
     */
    const combinedDocuments = computed(() => {
            return docs.value.flatMap(category => category.documents);
    });

    /**
     * Reactive reference to store filter settings.
     * @type {Object}
     */
    const filters = ref({
        'global': {value: null, matchMode: FilterMatchMode.CONTAINS},
    });
    
    /**
     * Computes whether the search input is not empty.
     * @function isSearching
     * @returns {boolean} True if the search input is not empty, false otherwise.
     */
    const isSearching = computed(() => {
        return filters.value['global'].value !== null && filters.value['global'].value !== ""
    });
    
</script>

<style scoped>


</style>