<script lang="ts">
    import ExamContainer from "./components/ExamContainer.svelte";
    import RoomContainer from "./components/RoomContainer.svelte";
    import SplitContainer from "./lib/SplitContainer.svelte";
import type { IExam, IRoom, ITimeTable } from "./solve/data";
    import { compute, store } from "./solve/methods";

    let data: {
        rooms: IRoom[],
        remainingExams: IExam[],
        timetable: ITimeTable,
    };

    store.subscribe(v => {
        data = v;
    })

    function runCompute() {
        compute();
    }
</script>

<div class="app">
    <div class="top-bar">
        <div class="compute" on:click={runCompute}>compute</div>
    </div>
    <SplitContainer percentage={0.8}>
        <RoomContainer rooms={data.rooms} timetable={data.timetable} slot="left"/>
        <ExamContainer exams={data.remainingExams} slot="right"/>
    </SplitContainer>
</div>

<style>
    .app {
        width: 100vw;
        height: 100vh;

        display: grid;
        grid-template-rows: auto minmax(0, 1fr);
    }

    .top-bar {
        background-color: var(--bg-sec);
        height: 2rem;
    }

    :global(::-webkit-scrollbar) {
        width: 0.5rem;
        height: 0.5rem;
    }

    :global(::-webkit-scrollbar-track) {
        background-color: transparent;
    }

    :global(::-webkit-scrollbar-thumb) {
        background-color: var(--fg-sec);
        /* border-radius: 0.25rem; */
        /* border-radius: 0.25rem; */
    }

    :global(::-webkit-scrollbar-corner) {
        background-color: transparent;
    }
</style>