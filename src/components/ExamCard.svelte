<script lang="ts">
    import type { IExam } from "src/solve/data";

    export let exam: IExam; 
</script>

<div class="exam-card">
    <div class="exam-id">{exam.id}</div>
    <div class="exam-uuid">{exam.uuid}</div>
    <div class="exam-duration">Dauer: {exam.duration.asMinutes()} Minuten</div>
    <div class="exam-examiners">
        todo
    </div>
    <div class="exam-examinees">
        todo
    </div>
</div>

<style>
    .exam-card {
        width: 15rem;
        background-color: var(--color-blue);
        border-radius: var(--border-normal);
        padding: var(--padding-normal);
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