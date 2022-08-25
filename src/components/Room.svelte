<script lang="ts">
import { duration } from "moment";

    import type { IRoom, ITimeTable } from "src/solve/data";
    import RoomSlot from "./RoomSlot.svelte";

    export let room: IRoom;
    export let timetable: ITimeTable;
</script>

<div class="room">
    <div class="heading">
        <div class="room-number">{room.number}</div>
    </div>
    <div class="room-slots" style={`grid-template-rows: ${timetable.lessons.map(v => v.duration.minutes() / 60 * 15 + "rem").join(" ")}`}>

        {#each room.slots as slot}
            <RoomSlot roomSlot={slot}/>
        {/each}
    </div>
</div>

<style>
    .room {

        width: 15rem;
    }

    .heading {
        height: calc(var(--room-head-height) - var(--padding-normal));
        margin: calc(var(--padding-normal) * 0.5);
        background-color: var(--bg-sec);
        position: sticky;
        top: 0;
        z-index: 10;
        box-shadow: 0px 5px 15px 5px #0000001a;
    }

    .room-slots {
        display: grid;
        position: relative;
        gap: var(--padding-normal);
        margin-top: calc(1.5 * var(--padding-normal));
    }

    .room-number {
        text-align: center;
        font-size: 1.25rem;
        font-weight: bold;
        padding: var(--padding-normal);
    }
</style>