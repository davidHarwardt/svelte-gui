<script lang="ts">
import type moment from "moment";

    import type { IRoom, ITimeTable } from "src/solve/data";
import Room from "./Room.svelte";

    export let timetable: ITimeTable;
    export let rooms: IRoom[];

    function time(t: moment.Moment) { return `${t.hours().toString().padStart(2, "0")}:${t.minutes().toString().padStart(2, "0")}`; }
</script>

<div class="room-container">
    <div class="time-table-container">
        <div class="spacer"></div>

        {#each timetable.lessons as slot}
            <div class="time-slot" data-from={time(slot.start)} data-to={time(slot.start.clone().add(slot.duration))} style:height={`calc(var(--room-height) * ${slot.duration.minutes() / 60})`}></div>            
        {/each}
    </div>
    <div class="rooms-container" style={`grid-template-columns: repeat(${rooms.length}, auto)`}>
        {#each rooms as room}
            <Room room={room} timetable={timetable}/>
        {/each}
    </div>
</div>

<style>
    :global(.room-container) {
        --room-height: 15rem;
        --room-head-height: 8rem;
    }

    .room-container {
        overflow: auto;
        display: grid;
        grid-template-columns: auto minmax(0, 1fr);
    }

    .rooms-container {
        display: grid;
        justify-content: left;
    }
    
    .spacer {
        height: var(--room-head-height);
        background-color: var(--bg-sec);
        width: 3rem;
        margin-bottom: var(--padding-normal);
        box-shadow: 5px 0px 15px 5px #0000001a;
    }

    .time-table-container {
        position: sticky;
        left: 0;
        z-index: 20;
    }

    .time-slot {
        width: 3rem;
        background-color: var(--bg-sec);

        position: relative;
        margin-bottom: var(--padding-normal);
        box-shadow: 5px 0px 15px 5px #0000001a;
    }

    .time-slot::before {
        content: attr(data-from);
        position: absolute;
        top: 0.25rem;
        left: 0.125rem;
    }

    .time-slot::after {
        content: attr(data-to);
        position: absolute;
        bottom: 0.25rem;
        left: 0.125rem;
    }
</style>