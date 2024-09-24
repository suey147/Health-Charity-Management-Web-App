<template>
    <h1 class="text-center">Events</h1>
    <div class="col-md-8 col-8 offset-2 offset-md-2 text-end">
        <SelectButton v-model="value" :options="view" aria-labelledby="basic" severity="primary"/>
    </div>
    <div class="card col-md-8 col-8 offset-2 offset-md-2">
        <div class="input-group mb-3">
            <span class="input-group-text pi pi-search" id="basic-addon1"></span>
            <input class="form-control mr-sm-2" type="search" placeholder="Search event name" aria-label="Search" v-model="filters['name'].value">
        </div>
        <div class="gap-4 d-flex align-items-center col-md-2">
            <div class="flex-auto">
                <DatePicker v-model="filters['date'].value" selectionMode="range" :manualInput="false" placeholder="Date" showIcon fluid />
            </div>
        </div>
        <EventList :filters="filters" />
        <EventMap/>
    </div>
</template>

<script setup>
    import { ref } from 'vue';
    import { FilterMatchMode, FilterOperator } from "@primevue/core/api"
    import EventList from './EventListView.vue'
    import EventMap from './EventViewInMap.vue'
    import DatePicker from 'primevue/datepicker';
    

    const value = ref('List');

    const view = ref(['List', 'Map']);


    /**
     * Reactive reference to store filter settings.
     * @type {Object}
     */
    const filters = ref();

    const initFilters = () => {
        filters.value = {
            global: { value: null, matchMode: FilterMatchMode.CONTAINS },
            name: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
            date: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }] },
        };
    };
    initFilters();
</script>

<style scoped>
.events-date {
    text-align: center;
    position: absolute;
    background-color: rgba(25, 47, 89, 0.9);
    color: #fff;
    padding: 12px 20px 8px 20px;
    text-transform: uppercase
}
</style>