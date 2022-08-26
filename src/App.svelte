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
        <div class="compute bar-btn" on:click={runCompute}>compute</div>
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
        /* height: 2rem; */
    }

    .bar-btn {
        background-color: var(--fg-sec);
        width: fit-content;
        padding: var(--padding-normal);
        margin: var(--padding-small);
        border-radius: var(--border-small);

        user-select: none;
        cursor: pointer;
        transition: 0.125s ease-out;
    }

    .bar-btn:hover {
        filter: brightness(1.1);
    }

    .bar-btn:active {
        transform: scale(0.9);
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