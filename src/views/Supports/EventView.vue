<template>
    <h1 class="text-center">Events</h1>
    <div class="col-md-8 col-8 offset-2 offset-md-2">
        <input class="form-control mr-sm-2" type="search" placeholder="Search" aria-label="Search" v-model="filters['global'].value">

        <DataTable v-model:expandedRows="expandedRows" :value="docs" dataKey="id"
                @rowExpand="onRowExpand" @rowCollapse="onRowCollapse">
            <!-- Header -->
            <template #header>
                <div class="flex flex-wrap justify-end gap-2 text-end">
                </div>
            </template>

            <Column>
                <template #body="slotProps">
                    <img :src="`https://primefaces.org/cdn/primevue/images/product/${slotProps.data.image}`" :alt="slotProps.data.image" class="w-24 rounded" />
                </template>
            </Column>
            <Column field="details">
                <template #body="slotProps">
                    <div>
                        <strong>{{ slotProps.data.details.title }}</strong>
                        <span>{{ slotProps.data.details.time }}</span>
                        <span>{{ slotProps.data.details.address }}</span>
                    </div>
                </template>
            </Column>


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
        const dataString = localStorage.getItem('events');
        const alldocs = JSON.parse(dataString);   
        docs.value = alldocs;
    }

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