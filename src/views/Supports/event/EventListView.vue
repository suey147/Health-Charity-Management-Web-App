<template>
    <div class="card col-md-8 col-8 offset-2 offset-md-2">
        <div class="d-flex justify-content-end">
            <IconField>
                <InputIcon>
                    <i class="pi pi-search" />
                </InputIcon>
                <InputText v-if="layout == 'list'" v-model="filters['global'].value" placeholder="Keyword Search" />
            </IconField>
            <SelectButton v-model="layout" :options="options" :allowEmpty="false">
                <template #option="{ option }">
                    <i :class="[option === 'list' ? 'pi pi-bars' : 'pi pi-map']" />
                </template>
            </SelectButton>
        </div>
        <DataTable v-model:filters="filters" :value="docs" paginator :rows="10" dataKey="id" filterDisplay="menu" :loading="loading"
        :globalFilterFields="['name', 'date']" v-if="layout == 'list'">
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
        <div ref="mapContainerRef" class="map-container"  v-show="layout == 'map'"></div>
    </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import axios from 'axios'
import { FilterMatchMode, FilterOperator } from '@primevue/core/api';
import InputText from 'primevue/inputtext';
import InputIcon from 'primevue/inputicon';
import IconField from 'primevue/iconfield';
import DatePicker from 'primevue/datepicker';
import mapboxgl from 'mapbox-gl'
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';

mapboxgl.accessToken = 'pk.eyJ1Ijoic3VleWhvIiwiYSI6ImNrbGkyemhlcTRlbjIydnBlN3lvczI5NWsifQ.G9H734iySPGG2ZiJds8kTw';
const options = ref(['list', 'map']);
const layout = ref('list');
const loading = ref(true);
const filters = ref();
const mapContainerRef = ref(null);
const mapInstance = ref(null); // To store the map instance
const initFilters = () => {
    filters.value = {
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    name: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
    date: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }] },
    address: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
}};
initFilters();

const initMap = () => {
    if (mapContainerRef.value && !mapInstance.value){
        mapInstance.value  = new mapboxgl.Map({
            container: mapContainerRef.value,
            style: "mapbox://styles/mapbox/streets-v12", // Replace with your preferred map style
            center: [145.131, -37.9099],
            zoom: 9,
        });

        setTimeout(() => {
          if (mapInstance.value) {
            mapInstance.value.resize(); // Resize the map after a short delay
          }
        }, 100);

        docs.value.forEach(address => {
            geocodeAddress(address.addr).then(coordinates => {
                addMarker(mapInstance.value, coordinates);
        });

        mapInstance.value.addControl(
        new MapboxGeocoder({
                accessToken: mapboxgl.accessToken,
                mapboxgl: mapboxgl
            })
        );
      });
    } else {
        console.error('Map container not found!');
    }
}
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
    if (layout.value === 'map') {
        initMap();
    }
})

watch( layout, (newLayout) => {
    if (newLayout == 'map'){
        initMap();
    } else if (mapInstance) {
        mapInstance.resize(); // Resize the map when switching to a different layout
    }
}
);

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

const geocodeAddress = async (address) => {
    try {
        const response = await axios.get(`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json?country=au&limit=1&proximity=ip&types=address&access_token=${encodeURIComponent(mapboxgl.accessToken)}`);
        const [longitude, latitude] = response.data.features[0].center;
        return [longitude, latitude];
    } catch (error) {
        console.error('Error geocoding address:', error);
    }
};

const addMarker = (map, coordinates) => {
    console.log(map, coordinates)
    const marker = new mapboxgl.Marker({
        color: "#FF0000"}).setLngLat(coordinates).addTo(map);
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
.map-container {
    width: 100%;
    height: 70vh; 
}
</style>
