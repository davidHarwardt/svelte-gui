<script lang="ts">
    import ExamContainer from "./components/ExamContainer.svelte";
    import SplitContainer from "./lib/SplitContainer.svelte";
    import * as mock from "./solve/mock";

    let mockData = {
        rooms: mock.rooms,
        exams: mock.exams, 
    };
</script>

<div class="app">
    <div class="top-bar"></div>
    <SplitContainer percentage={0.8}>
        <div slot="left">test</div>
        <ExamContainer exams={mockData.exams} slot="right"/>
    </SplitContainer>
</div>

<style>
    .app {
        width: 100vw;
        height: 100vh;

        display: grid;
        grid-template-rows: minmax(1rem, auto) 1fr;
    }

    .top-bar {
        background-color: var(--bg-sec);
    }
</style>