<script lang="ts">
    import { formatName } from "../helpers";
    import type { ITeacher } from "src/solve/data";

    export let teacher: ITeacher;
</script>

<div class="student-badge">
    {formatName(teacher.name)}
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