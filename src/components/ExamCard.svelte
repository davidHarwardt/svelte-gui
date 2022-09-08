<script lang="ts">
    import type { IExam } from "src/solve/data";
import StudentBadge from "./StudentBadge.svelte";
import TeacherBadge from "./TeacherBadge.svelte";

    export let exam: IExam; 
    export let onRemove: () => void;
    export let displayDuration: boolean = false;

    function dragStart(ev: DragEvent) {
        ev.dataTransfer.setData("application/json", JSON.stringify({
            type: "exam-card-drag",
            uuid: exam.uuid,
        }));
        ev.dataTransfer.dropEffect = "move";
    }

    function dragEnd(ev: DragEvent) {
        if(ev.dataTransfer.dropEffect !== "none") onRemove();
    }
</script>

<div class="exam-card" draggable="true" style:height={displayDuration ? `calc(var(--room-height) * ${exam.duration.asMinutes() / 60})` : "auto"} on:dragend={dragEnd} on:dragstart={dragStart}>
    <div class="exam-id">{exam.id}</div>
    <div class="exam-uuid">{exam.uuid}</div>
    <div class="exam-duration">Dauer: {exam.duration.asMinutes()} Minuten</div>
    <div class="exam-examiners">
        {#each exam.examiners as teacher}
            <TeacherBadge teacher={teacher}/>
        {/each}
    </div>
    <div class="exam-examinees">
        {#each exam.examinees as student}
            <StudentBadge student={student}/>
        {/each}
    </div>
</div>

<style>
    .exam-card {
        /* width: 15rem; */
        color: var(--bg-main);
        background-color: var(--color-blue);
        border-radius: var(--border-normal);
        padding: var(--padding-normal);
        z-index: 5;
    }
    
    .exam-id {
        font-size: 1.125rem;
        font-weight: bold;
    }

    .exam-uuid {
        font-size: 0.7rem;
        color: var(--fg-sec);
        font-family: monospace;
    }

</style>