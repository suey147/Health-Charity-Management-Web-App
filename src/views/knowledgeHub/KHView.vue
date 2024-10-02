<template>
    <h1 class="text-center">Knowledge Hub</h1>
    <div class="col-md-8 col-8 offset-2 offset-md-2">
        <div class="input-group mb-3">
            <span class="input-group-text pi pi-search" id="basic-addon1"></span>
            <input class="form-control mr-sm-2" type="search" placeholder="Search" aria-label="pi-search" v-model="filters['global'].value">
        </div>

        <DataTable v-model:expandedRows="expandedRows" :value="docs" dataKey="id"
                @rowExpand="onRowExpand" @rowCollapse="onRowCollapse" v-if="!isSearching" filterDisplay="menu">
            <template #header>
                <div class="d-flex justify-content-end">
                    <button class="btn-light btn bi bi-plus" @click="expandAll">Expand All</button>
                    <button class="btn-light btn bi bi-dash" @click="collapseAll">Collapse All</button>
                    <RouterLink class="btn-light btn bi bi-gear" v-if="$store.getters.isAdmin" to="/knowledge-hub/edit"> Edit</RouterLink>
                    <button class="btn-light btn pi pi-filter" @click="toggle"></button>
                    <Popover ref="ratingFilter" class="p-datatable-filter p-datatable-filter-overlay">
                            <div class="d-flex flex-column p-4" style="width: 300px;">
                                <h5 class="mb-3">Filter by Rating</h5>
                                <Slider v-model="filters['rating'].value" :min="0" :max="5" range class="mb-3 p-datatable-filter-operator" ></Slider>
                                <div class="d-flex justify-content-between">
                                    <span>{{ filters['rating'].value ? filters['rating'].value[0] : 0 }}</span>
                                    <span>{{ filters['rating'].value ? filters['rating'].value[1] : 5 }}</span>
                                </div>
                            </div>
                            <div class="d-flex flex-column p-4" style="width: 300px;">
                                <h5 class="mb-3">Filter by Date</h5>
                                <IconField class="d-flex align-items-center p-datatable-filter-operator">
                                    <InputIcon class="p-2">
                                        <i class="pi pi-calendar"/>
                                    </InputIcon>
                                    <DatePicker v-model="filters['date'].value" dateFormat="mm/dd/yy" placeholder="mm/dd/yy"/>
                                </IconField>
                            </div>
                    </Popover>
                </div>
            </template>

            <template>
                <Column field="category" header="Category" class="bg-info" ></Column>
                <Column expander style="width: 3rem" class="bg-info"/>
            </template>
            <template #expansion="slotProps" >
                <div class="p-4">
                    <DataTable :value="slotProps.data.documents" :filters="filters" @rowClick="onRowClick" paginator :rows="10">
                        <Column field="title" header="Title" sortable></Column>
                        <Column field="date" header="Date" sortable>
                            <template #body="{ data }">
                                {{ formatDate(data.date) }}
                            </template>
                        </Column>
                        <Column field="rating" header="Reviews" sortable>
                            <template #body="rating">
                                <Rating :modelValue="rating.data.rating[0]"/>
                                {{ rating.data.rating[0] }}
                            </template>
                        </Column>
                    </DataTable>
                </div>
            </template>
        </DataTable>

        <DataTable v-model:selection="docs" :filters="filters" :value="combinedDocuments" @rowClick="onRowClick" v-if="isSearching">
            <!-- <Column field="id" header="Id" sortable></Column> -->
            <Column field="title" header="Title" sortable></Column>
            <Column field="date" header="Date" sortable></Column>
            <Column field="rating" header="Reviews" sortable></Column>
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
    import Rating from 'primevue/rating';
    import axios from 'axios';
    import categorizedDocuments from '../../utils/helper'
    import DatePicker from 'primevue/datepicker'
    import InputIcon from 'primevue/inputicon'
    import IconField from 'primevue/iconfield'
    import Slider from 'primevue/slider'
    import Popover from 'primevue/popover';
    import Menu from 'primevue/menu';

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
    const ratingFilter = ref();

    /**
     * Lifecycle hook that runs when the component is mounted.
     * @function onMounted
     */
    onMounted(() => {
        // getDocumentsData();
        getDocumentCount();
    });

    /**
     * Fetches document data from localStorage and updates the docs reference.
     * @function getDocumentsData
     */
    const getDocumentCount = async() => {
        try {
            const response = await axios.get('http://127.0.0.1:5001/fit5032-assignment-ce36f/us-central1/getKnowledgeHubDoc');
            const documents = response.data;
            const categorized = categorizedDocuments(documents);
            docs.value = categorized;
        } catch (error) {
            console.error('Error fetching book count: ', error);
            this.error = error;
        }
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
        global: {value: null, matchMode: FilterMatchMode.CONTAINS},
        date: { value: null, matchMode: FilterMatchMode.DATE_IS },
        rating: { value: [0, 5], matchMode: FilterMatchMode.BETWEEN },
    });
    
    /**
     * Computes whether the search input is not empty.
     * @function isSearching
     * @returns {boolean} True if the search input is not empty, false otherwise.
     */
    const isSearching = computed(() => {
        return filters.value['global'].value !== null && filters.value['global'].value !== ""
    });
    
    const formatDate = (value) => {
        return value.toLocaleDateString('en-AU', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };
    const toggle = (event) => {
        ratingFilter.value.toggle(event);
    }
</script>

<style scoped>


</style>