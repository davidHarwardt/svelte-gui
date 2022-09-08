<script lang="ts">
    import { formatName } from "../helpers";
    import type { IStudent } from "src/solve/data";

    export let student: IStudent;
</script>

<div class="student-badge">
    {formatName(student.name)}
</div>

<style>
    .student-badge {
        display: inline-block;
        margin: var(--padding-xsmall);
        padding: var(--padding-xsmall);
        border-radius: var(--border-small);
        background-color: var(--color-orange);
    }
</style>