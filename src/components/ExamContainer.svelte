<script lang="ts">
    import type { IExam } from "src/solve/data";
    import ExamCard from "./ExamCard.svelte";

    export let exams: IExam[];

    let search = "";
    function clear() { search = ""; }

    $: filtered = exams.filter(v => v.id.includes(search));
</script>

<div class="exam-container">
    <div class="search-bar-container">
        <input type="text" bind:value={search} class="search-bar">
        <input type="button" value="x" on:click={clear} class="clear-btn">
    </div>
    <div class="cards-container">
        {#each filtered as exam}
            <ExamCard exam={exam}/>
        {/each}
    </div>
</div>

<style>
    .search-bar-container {
        display: grid;
        grid-template-columns: 1fr 2rem;
        padding: var(--padding-normal);
        gap: var(--padding-normal);
    }
    
    .cards-container {
        padding: var(--padding-normal);
        gap: var(--padding-normal);
        display: flex;
        flex-wrap: wrap;
        justify-content: space-evenly;

        color: var(--bg-main);
        user-select: none;
    }
</style>