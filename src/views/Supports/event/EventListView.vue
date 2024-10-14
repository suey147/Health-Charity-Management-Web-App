<template>
    <div class="card col-md-8 col-8 offset-2 offset-md-2">
        <!-- toolbar -->
        <div class="d-flex justify-content-center">
            <SelectButton v-model="layout" :options="options" optionLabel="name" :allowEmpty="false">
                <template #option="slotProps">
                    <i :class="slotProps.option.icon"></i>
                    <span>{{ slotProps.option.name }}</span>
                </template>
            </SelectButton>
            <button v-if="inNavigation" @click="closeNavigation" class="btn btn-danger">
                Close Navigation
            </button>
        </div>

        <!-- Event List datatabe -->
        <DataTable v-model:filters="filters" :value="docs" ref="dt" :rows="10" dataKey="id" filterDisplay="menu" :loading="loading"
        :globalFilterFields="['title', 'date', 'addr']" v-if="layout.value == 'list' && docs" paginator>
        <template #header>
            <div class="d-flex justify-content-between">
                <Button icon="pi pi-external-link" label="Export" @click="exportCSV($event)" />
                <IconField>
                    <InputIcon>
                        <i class="pi pi-search" />
                    </InputIcon>
                    <InputText v-if="layout.value == 'list'" v-model="filters['global'].value" placeholder="Keyword Search" />
                </IconField>
            </div>
        </template>
        <template #empty> No event found. </template>
        <template #loading> Loading event data. Please wait. </template>
            <!-- Event Image -->
            <Column field="image" style="width: 25%">
                <template #body="slotProps">
                    <div class="relative mx-auto position-relative container d-none d-lg-block position-relative img-fluid">
                    <img :src="slotProps.data.image" width="200" :alt="slotProps.data.title"/>
                    </div>
                </template>
            </Column>
            <!-- Event details -->
            <Column header="Name" filterField="title" field="title" style="min-width: 12rem" sortable>
                <template #body="{ data }">
                    <span>{{ data.title }}</span>
                </template>
                <template #filter="{ filterModel, filterCallback }">
                    <InputText v-model="filterModel.value" type="text" @input="filterCallback()" class="p-column-filter" placeholder="Search by name" />
                </template>
            </Column>

            <Column header="Date" filterField="date" field="date" style="min-width: 10rem" sortable>
                <template #body="{ data }">
                    {{ formatDate(data.start) }}
                    {{ data.start.toLocaleTimeString() }}
                </template>
                <template #filter="{ filterModel }">
                    <DatePicker v-model="filterModel.value" dateFormat="mm/dd/yy" placeholder="mm/dd/yyyy" />
                </template>
            </Column>

            <Column header="Address" filterField="addr" field="addr" style="min-width: 10rem" sortable>
                <template #body="{ data }">
                    <span>{{ data.addr }}</span>
                </template>
                <template #filter="{ filterModel, filterCallback }">
                    <InputText v-model="filterModel.value" type="text" @input="filterCallback()" class="p-column-filter" placeholder="Search by address" />
                </template>
            </Column>

            <!-- Register button -->
            <Column :exportable="false" style="width: 25%">
            <template #body="slotProps">
                <div class="d-flex gap-2 justify-content-end">
                    <button class="btn btn-primary mr-2" @click="visible = true, selectedEvent=slotProps.data, $event.stopPropagation()">Read more</button>
                </div>

            </template>
            </Column>
        </DataTable>
        <!-- Event Map -->

        <div ref="mapContainerRef" class="map-container"  v-show="layout.value == 'map'" aria-label="map view"></div>
        <section  v-show="layout.value == 'map'">
            Instruction to use
            <ul>
                <li>Search the desired location using search bar</li>
                <li>Click on the marker of events to view details</li>
                <li>Press direction to get navigation</li>
                <li>Choose a starting point and follow the route provide</li>
             </ul>
        </section>

        <FullCalendar :options="calendarOptions" v-if="layout.value == 'calendar'" aria-label="calendar view"/>
    </div>

    <!-- Event detail dialog -->
    <Dialog v-model:visible="visible" modal :value="selectedEvent" header="Event Details" :style="{ width: '25vw'}">
        <div  ref="eventDetailCanvas">
        <img alt="user header" :src='selectedEvent.image' style="max-width: 100%; max-height: 100%; object-fit: cover; overflow: hidden"/>
        <li class="list-unstyled">
            <i class="pi pi-clock margin-10px-right"></i><span>Time:</span>{{ selectedEvent.start}}
        </li>
        <li class="list-unstyled">
            <i class="pi pi-map-marker margin-5px-right"></i><span>Address:</span>{{ selectedEvent.addr }}
        </li>
        <li class="list-unstyled">
            <i class="margin-5px-right"></i><span>Description: </span>{{ selectedEvent.description }}
        </li>
        </div>
        <template #footer>
            <div class="d-flex gap-4 mt-1">
                <Button label="Direction" severity="primary" class="w-full" @click="addNavigation(selectedEvent.coordinates)" v-if="layout.value=='map'"/>
                <Button label="Registered" v-if="registeredEvent!=null && registeredEvent.includes(selectedEvent.id)" class="w-full"/>
                <!-- Show when logged in and registered event does not include selectedEvent -->
                <div v-if="isLoggedIn === 'true' && Array.isArray(registeredEvent) && !registeredEvent.includes(selectedEvent.id)">
                    <Button label="Register" class="w-full" @click="registerEvent(selectedEvent)"/>
                </div>
                <div v-else-if="isLoggedIn === 'true' && (!registeredEvent || (Array.isArray(registeredEvent) && registeredEvent.length === 0))">
                    <!-- Content to display when logged in but have no registered events -->
                    <Button label="Register" class="w-full" @click="registerEvent(selectedEvent)"/>
                </div>
                
                <Button label="Login To Register" v-if="isLoggedIn!='true'" class="w-full" @click="navigateToLogin"/>
            </div>
        </template>
        
    </Dialog>

    <Toast/>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import axios from 'axios'
import { FilterMatchMode, FilterOperator } from '@primevue/core/api';
import InputText from 'primevue/inputtext';
import InputIcon from 'primevue/inputicon';
import IconField from 'primevue/iconfield';
import DatePicker from 'primevue/datepicker';
import Dialog from 'primevue/dialog';
import mapboxgl from 'mapbox-gl'
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';
import MapboxDirections from '@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions';
import '@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions.css';
import { useStore } from 'vuex';
import { useToast } from 'primevue/usetoast'
import { useRouter } from 'vue-router';
import Toast from 'primevue/toast'
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'


mapboxgl.accessToken = 'pk.eyJ1Ijoic3VleWhvIiwiYSI6ImNrbGkyemhlcTRlbjIydnBlN3lvczI5NWsifQ.G9H734iySPGG2ZiJds8kTw';
const options = ref([
    { name: 'list', value: 'list', icon: 'pi pi-list'},
    { name: 'map', value: 'map', icon:  'pi pi-map'},
    { name: 'calendar', value: 'calendar', icon: 'pi pi-calendar' }
]);
const layout = ref({value: 'list'});
const loading = ref(true);
const filters = ref();
const mapContainerRef = ref(null);
const mapInstance = ref(null); // To store the map instance
const visible = ref(false);
const selectedEvent = ref();
const inNavigation = ref(false);
const navigation = ref();
const geocoderContainer = ref();
const store = useStore();
const dt = ref();
const registeredEvent = ref();
const eventDetailCanvas = ref( null );
const isLoggedIn = ref(false);
const router = useRouter();
const initFilters = () => {
    filters.value = {
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    title: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
    date: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }] },
    addr: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
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
        mapInstance.value.addControl(
            new MapboxGeocoder({
                    accessToken: mapboxgl.accessToken,
                    mapboxgl: mapboxgl
                })
        );
        geocoderContainer.value = document.querySelector('.mapboxgl-ctrl-geocoder');
        docs.value.forEach(address => {
            geocodeAddress(address.addr).then(coordinates => {
                addMarker(mapInstance.value, coordinates, address);
            });
        });

    } else {
        console.log('Map container not found!');
    }
}

const toast = useToast();
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
    getUserRegisteredEvents();
    if (layout.value == 'map') {
        initMap();
    }
    isLoggedIn.value = store.getters.isAuthenticated;
})

watch( layout, (newLayout) => {
    if (newLayout.value == 'map'){
        initMap();
    }
}
);

const handleDateClick = () => {
    toast.add({ severity: 'success', summary:  'Date is clicked', detail: 'date is clicked', life: 3000 });
    }
const handleEventClick = (arg) => {
    selectedEvent.value = {...arg.event._def.extendedProps, start: arg.event.start, id: arg.event.id};
    visible.value = true;
};


const getEvents = async () => {
  try {
    // const response = await axios.get(
    //   'http://127.0.0.1:5001/fit5032-assignment-ce36f/us-central1/getEvents'
    // );
    const response = await axios.get(
      'https://getevents-bj37ljbsda-uc.a.run.app'
    );
    const documents = response.data;
    const formattedDocs = documents.map(doc => {
        let formattedData = {...doc};
        if(formattedData.date) {
            console.log(doc.date)
            const eventDate = new Date(doc.date._seconds*1000 );
            formattedData.date = eventDate;
        }
        if(formattedData.start) {
            const eventDate = new Date(doc.start._seconds * 1000);
            formattedData.start = eventDate;
        }
        if(formattedData.end) {
            const eventDate = new Date(doc.end._seconds * 1000);
            formattedData.end = eventDate;
        }
        return formattedData;
    })
    docs.value = formattedDocs;
    loading.value = false;
  } catch (error) {
    console.log('Error getting events: ', error);
  }
}

const getUserRegisteredEvents = async () => {
  try {
    const userId = store.getters.currentUser;
    if (userId){
        // const response = await axios.post(
        //   'http://127.0.0.1:5001/fit5032-assignment-ce36f/us-central1/getUserRegisteredEvents', {userId: userId}
        // );
        const response = await axios.post(
        'https://getuserregisteredevents-bj37ljbsda-uc.a.run.app', {userId: userId}
        );
        const documents = response.data;
        if (documents && documents.length > 0) {
            console.log(documents)
            const documentIds = documents.map(doc => doc.id);
            registeredEvent.value = documentIds;
            console.log(documentIds);
        } else {
            registeredEvent.value = [];
            console.log("No documents found.");
        }
    }
  } catch (error) {
    console.error('Error fetching registered events: ', error);
    this.error = error;
  }
}

// Merge events for the calendar
const mergedEvents = computed(() => {
  // Create a map of registered events for easy lookup
  let markedDocs = docs.value;
  if(registeredEvent.value && docs.value){
    markedDocs = docs.value.map(event => {
        if (registeredEvent.value.includes(event.id)) {
            return { ...event, type: 'registered', id: event.id }; // Mark as registered if found
        }
        return { ...event, type: 'available', id: event.id }; // Mark as available
    });
  }
    return markedDocs;
});

const isConflict = (newEvent) => {
    if(registeredEvent.value){
        return mergedEvents.value.some((event) => {
            console.log(event.type)
            console.log(new Date(event.start).getTime())
            console.log(new Date(newEvent.start).getTime())
            return (new Date(event.start).getTime() === new Date(newEvent.start).getTime()) && (event.type == "registered")
        })
    }else{
        return false;
    }
  
};

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

const addMarker = (map, coordinates, placeInfo) => {
    const marker = new mapboxgl.Marker({
        color: "#FF0000"}).setLngLat(coordinates).addTo(map);
    marker.getElement().addEventListener('click', () => {
        if (inNavigation.value == false){
            placeInfo.coordinates = coordinates;
            selectedEvent.value = placeInfo;
            visible.value = true;
        }
    });
};

const addNavigation = (destination) => {
    visible.value = false;
    inNavigation.value = true;
    geocoderContainer.value.style.display = 'none'
    navigation.value = new MapboxDirections({
        accessToken: mapboxgl.accessToken
    });
    
    mapInstance.value.addControl(
        navigation.value, 'top-left'
    ); 

    navigation.value.setDestination([destination[0], destination[1]]);
}
const closeNavigation = () => {
      if (navigation.value) {
        // Clear the directions
        inNavigation.value = false;
        mapInstance.value.removeControl(navigation.value);
        geocoderContainer.value.style.display = 'block';
      }
    }
const registerEvent = async(event) => {
    try {
        const userId = store.getters.currentUser;
        if (userId){
            if(isConflict(event) == false){
                // const response = await axios.post('http://127.0.0.1:5001/fit5032-assignment-ce36f/us-central1/registerEvent', {userId: userId,eventId: eventId });
                const response = await axios.post('https://registerevent-bj37ljbsda-uc.a.run.app', {userId: userId,eventId: event.id });
                const userDetails = JSON.parse(sessionStorage.getItem("details"));
                const send = await axios.post('https://app-bj37ljbsda-uc.a.run.app/sendEmail',{data: selectedEvent.value, user: userDetails});
                toast.add({ severity: 'success', summary:  'Registered' + selectedEvent.value.name, detail: 'Receipt has send to your email', life: 3000 });
                const redirect = router.currentRoute.value.query.redirect || { name: 'Events' }
                router.push(redirect)
            }else{
                toast.add({ severity: 'error', summary: 'Error Message', detail: 'Event clash with other events', life: 3000 });
            }
        } else {
            toast.add({ severity: 'error', summary: 'Error Message', detail: 'Please Loggin to register', life: 3000 });
        }
        visible.value = false;
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Error Message', detail: 'Failed to register event', life: 3000 });
        console.log('Error register event: ', error);
        visible.value = false;
    }
}
const renderEventContent = () => {
  const event = mergedEvents;

  const backgroundColor = event.value.extendedProps.type === 'registered' ? 'red' : 'green';

  return {
    html: `<div style="background-color: ${backgroundColor}; padding: 5px; border-radius: 5px;">${event.value.title}</div>`
  };
};

const calendarOptions = ref({
        plugins: [ dayGridPlugin, interactionPlugin ],
        initialView: 'dayGridMonth',
        eventInteractive: true,
        dateClick: handleDateClick,
        eventClick: handleEventClick,
        events: mergedEvents
      })
const exportCSV = () => {
    dt.value.exportCSV();
};

const navigateToLogin = () => {
    const redirect = router.currentRoute.value.query.redirect || { name: 'Login' }
    router.push(redirect)
}


</script>

<style scoped>
.map-container {
    width: 100%;
    height: 70vh; 
}
</style>
