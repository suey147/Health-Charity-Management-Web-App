<template>
    <h1 class="text-center">Knowledge Hub</h1>
    <form class="form-inline my-2 my-lg-0 flex-fill">
        <div class="input-group">
            <div class="dropdown">
                <a class="btn btn-outline-dark me-2 dropdown-toggle" type="button" id="aboutUsDropdownButton" data-bs-toggle="dropdown" aria-expanded="false">
                Categories
                </a>
                <ul class="dropdown-menu" aria-labelledby="aboutUsDropdownButton">
                    <li><a class="dropdown-item" href="#">Accessories</a></li>
                    <li><a class="dropdown-item" href="#">Clothing</a></li>
                    <li><a class="dropdown-item" href="#">Footwear</a></li>
                    <li><a class="dropdown-item" href="#">Ladies</a></li>
                    <li><a class="dropdown-item" href="#">Men</a></li>
                    <li><a class="dropdown-item" href="#">New Arrivals</a></li>
                    <li><a class="dropdown-item" href="#">Sale</a></li>
                </ul>
            </div>
            <input class="form-control mr-sm-2" type="search" placeholder="Search" aria-label="Search">
            <!-- <button class="bi bi-search my-2 my-sm-0" type="submit"></button> -->
            <button type="button" class="btn btn-primary">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-search" viewBox="0 0 16 16">
                    <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0"></path>
                </svg>
            </button>
        </div>
    </form>
    <KnowledgeHubTable/>
</template>

<script setup>
    import KnowledgeHubTable from './KnowledgeHubTable.vue';

</script>

<style scoped>


</style>