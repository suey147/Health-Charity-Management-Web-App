<template>
    <h1 class="text-center">Knowledge Hub</h1>
    <div class="col-md-8 col-8 offset-2 offset-md-2">
        <div class="input-group mb-3">
            <span class="input-group-text pi pi-search" id="basic-addon1"></span>
            <input class="form-control mr-sm-2" type="search" placeholder="Search" aria-label="pi-search" v-model="filters['global'].value">
        </div>

        <DataTable v-model:expandedRows="expandedRows" :value="docs" dataKey="id"
                @rowExpand="onRowExpand" @rowCollapse="onRowCollapse" v-if="!isSearching">
            <template #header>
                <div class="d-flex justify-content-end">
                    <button class="btn-light btn bi bi-plus" @click="expandAll">Expand All</button>
                    <button class="btn-light btn bi bi-dash" @click="collapseAll">Collapse All</button>
                    <RouterLink class="btn-light btn bi bi-gear" v-if="$store.getters.isAdmin" to="/knowledge-hub/edit"> Edit</RouterLink>
                    <button class="btn-light btn pi pi-filter" @click="toggle"></button>
                </div>
            </template>

            <template>
                <Column field="category" header="Category" class="bg-info" ></Column>
                <Column expander style="width: 3rem" class="bg-info"/>
            </template>
            <template #expansion="slotProps" >
                <div class="p-4">
                    <DataTable v-if="slotProps.data.documents" v-model:filters="filters" :value="slotProps.data.documents" @rowClick="onRowClick" paginator :rows="10" filterDisplay="row">
                        <Column field="title" filterField="title" header="Title" sortable>
                            <template #body="{ data }">
                                <span>{{ data.title }}</span>
                            </template>
                            <template #filter="{ filterModel, filterCallback }">
                                <InputText v-model="filterModel.value" type="text" @input="filterCallback()" class="p-column-filter" placeholder="Search by name" />
                            </template>
                        </Column>
                        <Column field="date" filterField="date" header="Date" sortable>
                            <template #body="{ data }">
                                {{ formatDate(data.date) }}
                            </template>
                            <template #filter="{ filterModel }">
                                <DatePicker v-model="filterModel.value" dateFormat="mm/dd/yy" placeholder="mm/dd/yyyy" />
                            </template>
                        </Column>
                        <Column field="rating" filterField="rating" header="Reviews" :showFilterMenu="false" sortable>
                            <template #body="{ data }">
                                <Rating :modelValue="data.rating[0]"/>
                                {{ data.rating[0] }}
                            </template>
                            <template #filter="{ filterModel, filterCallback }">
                                <Select v-model="filterModel.value" @change="filterCallback()" :options="rate" placeholder="Select One" style="min-width: 12rem" :showClear="true">
                                    <template #option="slotProps">
                                        <Tag :value="slotProps.option" />
                                    </template>
                                </Select>
                            </template>
                        </Column>
                    </DataTable>
                </div>
            </template>
        </DataTable>

        <DataTable v-model:selection="docs" :filters="filters" :value="combinedDocuments" @rowClick="onRowClick" v-if="isSearching">
            <Column field="title" header="Title" sortable></Column>
            <Column field="date" header="Date" sortable></Column>
            <Column field="rating" header="Reviews" sortable></Column>
        </DataTable>
    </div>
</template>

<script setup>
    import { ref, onMounted, computed, watch} from 'vue';
    import { useToast } from 'primevue/usetoast';
    import DataTable from "primevue/datatable";
    import Column from "primevue/column";
    import router from '@/router/index.js';
    import { FilterMatchMode, FilterOperator } from "@primevue/core/api"
    import Rating from 'primevue/rating';
    import axios from 'axios';
    import categorizedDocuments from '../../utils/helper'
    import DatePicker from 'primevue/datepicker';
    import InputText from 'primevue/inputtext';
    import Select from 'primevue/select';
    import Tag from 'primevue/tag';
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
    const rate = ref(['5', '4', '3', '2', '1']);
    /**
     * Reactive reference to store filter settings.
     * @type {Object}
     */
    const filters = ref();
    const initFilters = () => {
        filters.value = {
            global: { value: null, matchMode: FilterMatchMode.CONTAINS },
            title: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
            date: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }] },
            rating: { value: null, matchMode: FilterMatchMode.EQUALS },
        };
    };
    initFilters();
    
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

    watch(
        () => filters.value.date.value,
      (newValue, oldValue) => {
        console.log(`Date filter changed from ${oldValue} to ${newValue}`);
      }
    );
</script>

<style scoped>


</style>