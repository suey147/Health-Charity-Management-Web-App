<template>
    <DataTable v-if="users" v-model:selection="selectedProduct" v-model:filters="filters" :value="users" dataKey="id" @rowClick="onRowClick" paginator :rows="10" filterDisplay="row">
        <Column selectionMode="multiple" headerStyle="width: 3rem"></Column>
        <Column field="username" filterField="username" header="Name" sortable>
            <template #body="{ data }">
                <span>{{ data.name }}</span>
            </template>
            <template #filter="{ filterModel, filterCallback }">
                <InputText v-model="filterModel.value" type="text" @input="filterCallback()" class="p-column-filter" placeholder="Search by name" />
            </template>
        </Column>
        <Column field="email" filterField="email" header="Email" sortable>
            <template #body="{ data }">
                {{ formatDate(data.email) }}
            </template>
            <template #filter="{ filterModel }">
                <InputText v-model="filterModel.value" type="text" @input="filterCallback()" class="p-column-filter" placeholder="Search by email" />
            </template>
        </Column>
        <Column field="role" filterField="role" header="Role" :showFilterMenu="false" sortable>
            <template #body="{ data }">
                {{ data.role }}
            </template>
            <template #filter="{ filterModel, filterCallback }">
                <Select v-model="filterModel.value" @change="filterCallback()" :options="role" placeholder="Select role" style="min-width: 12rem" :showClear="true">
                    <template #option="slotProps">
                        <Tag :value="slotProps.option" />
                    </template>
                </Select>
            </template>
        </Column>
    </DataTable>
</template>

<script setup>
    import { ref, onMounted, computed, watch} from 'vue';
    import DataTable from "primevue/datatable";
    import Column from "primevue/column";
    import axios from 'axios';
    import InputText from 'primevue/inputtext';
    import Select from 'primevue/select';
    import Tag from 'primevue/tag';
    import { FilterMatchMode, FilterOperator } from "@primevue/core/api"

    const users = ref();
    const selectedProduct = ref();
    const metaKey = ref(true);
    const role = ref(['participant, volunteer']);

    onMounted(() => {
        getUsers();
    });

    /**
     * Fetches document data from localStorage and updates the docs reference.
     * @function getDocumentsData
     */
    const getUsers = async() => {
        try {
            const response = await axios.get('https://getusers-bj37ljbsda-uc.a.run.app');
            const documents = response.data;
            console.log(response.data)
            users.value = documents;
        } catch (error) {
            console.log('Error fetch users: ', error);
        }
    }

    

    const filters = ref();
    const initFilters = () => {
        filters.value = {
            global: { value: null, matchMode: FilterMatchMode.CONTAINS },
            username: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
            email: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }] },
            role: { value: null, matchMode: FilterMatchMode.EQUALS },
        };
    };
    initFilters();

</script>

<style scoped>

</style>