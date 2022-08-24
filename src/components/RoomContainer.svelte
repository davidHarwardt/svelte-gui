<script lang="ts">
    import type { IRoom, ITimeTable } from "src/solve/data";

    export let timetable: ITimeTable;
    export let rooms: IRoom;

</script>

<div class="room-container">
    <div class="time-table-container">

    </div>
    <div class="rooms-container">

    </div>
</div>

<style>
    :global(.room-container) {
        --room-heigth: 5rem;
    }
</style>