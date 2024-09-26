<template>
    <div class="card col-md-8 col-8 offset-2 offset-md-2">
        <div class="d-flex justify-content-end">
            <IconField>
                <InputIcon>
                    <i class="pi pi-search" />
                </InputIcon>
                <InputText v-model="filters['global'].value" placeholder="Keyword Search" />
            </IconField>
            <SelectButton v-model="layout" :options="options" :allowEmpty="false">
                <template #option="{ option }">
                    <i :class="[option === 'list' ? 'pi pi-bars' : 'pi pi-map']" />
                </template>
            </SelectButton>
        </div>
        <DataTable v-model:filters="filters" :value="docs" paginator :rows="10" dataKey="id" filterDisplay="menu" :loading="loading"
        :globalFilterFields="['name', 'date']">
            <!-- Event Image -->
            <Column field="image" style="width: 25%">
            <template #body="slotProps">
                <div
                class="relative mx-auto position-relative container d-none d-lg-block position-relative img-fluid"
                >
                <div class="events-date">
                    <div class="font-size28">{{ slotProps.data.date.getDate() }}</div>
                    <div class="font-size14">{{ slotProps.data.date.toLocaleString('default', { month: 'long' }) }}</div>
                </div>
                <img :src="slotProps.data.image" width="200" />
                </div>
            </template>
            </Column>
            <!-- Event details -->
            <Column header="Name" filterField="name" style="min-width: 12rem">
                <template #body="{ data }">
                    <span>{{ data.name }}</span>
                </template>
                <template #filter="{ filterModel, filterCallback }">
                    <InputText v-model="filterModel.value" type="text" @input="filterCallback()" class="p-column-filter" placeholder="Search by name" />
                </template>
            </Column>

            <Column header="Date" filterField="date" style="min-width: 10rem">
                <template #body="{ data }">
                    {{ formatDate(data.date) }}
                </template>
                <template #filter="{ filterModel }">
                    <DatePicker v-model="filterModel.value" dateFormat="mm/dd/yy" placeholder="mm/dd/yyyy" />
                </template>
            </Column>

            <Column header="Address" filterField="address" dataType="date" style="min-width: 10rem">
                <template #body="{ data }">
                    {{ data.addr}}
                </template>
                <template #filter="{ filterModel, filterCallback }">
                    <InputText v-model="filterModel.value" type="text" @input="filterCallback()" class="p-column-filter" placeholder="Search by address" />
                </template>
            </Column>

            <!-- Register button -->
            <Column :exportable="false" style="width: 25%">
            <template #body="slotProps">
                <div class="d-flex gap-2 justify-content-end">
                    <button class="btn btn-primary mr-2" @click="$event.stopPropagation()">Read more</button>
                    <Button icon="pi pi-heart" outlined></Button>
                </div>

            </template>
            </Column>
        </DataTable>
        <!-- Event Map -->
        <div id="mapContainerRef" style="width: 100%;" class="position-relative"></div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import axios from 'axios'
import { FilterMatchMode, FilterOperator } from '@primevue/core/api';
import InputText from 'primevue/inputtext';
import InputIcon from 'primevue/inputicon';
import IconField from 'primevue/iconfield';
import DatePicker from 'primevue/datepicker';
import mapboxgl from 'mapbox-gl'
import Toolbar from 'primevue/toolbar';

mapboxgl.accessToken = 'pk.eyJ1Ijoic3VleWhvIiwiYSI6ImNrbGkyemhlcTRlbjIydnBlN3lvczI5NWsifQ.G9H734iySPGG2ZiJds8kTw';
const mapContainerRef = ref(null);
const options = ref(['list', 'grid']);
const layout = ref('grid');
const loading = ref(true);

const filters = ref();
const initFilters = () => {
    filters.value = {
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    name: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
    date: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }] },
    address: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
}};
initFilters();
/**
 * Reactive reference to store documents.
 */
const docs = ref()
/**
 * Lifecycle hook that runs when the component is mounted.
 * @function onMounted
 */
onMounted(() => {
  getEvents();
  new mapboxgl.Map({
        container: "mapContainerRef",
        style: "mapbox://styles/mapbox/streets-v12", // Replace with your preferred map style
        center: [-71.224518, 42.213995],
        zoom: 9,
  });
})

const getEvents = async () => {
  try {
    const response = await axios.get(
      'http://127.0.0.1:5001/fit5032-assignment-ce36f/us-central1/getEvents'
    );
    const documents = response.data;
    const formattedDocs = documents.map(doc => {
        let formattedData = {...doc};
        if(formattedData.date) {
            const eventDate = new Date(doc.date._seconds * 1000 + doc.date._nanoseconds / 1000);
            formattedData.date = eventDate;
        }
        return formattedData;
    })
    docs.value = formattedDocs;
    loading.value = false;
  } catch (error) {
    console.error('Error fetching book count: ', error);
    this.error = error;
  }
}

const formatDate = (value) => {
    return value.toLocaleDateString('en-AU', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
};
</script>

<style scoped>
.events-date {
  text-align: center;
  position: absolute;
  background-color: rgba(25, 47, 89, 0.9);
  color: #fff;
  padding: 12px 20px 8px 20px;
  text-transform: uppercase;
}

</style>
