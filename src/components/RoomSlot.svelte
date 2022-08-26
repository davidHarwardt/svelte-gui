<script lang="ts">
    import type { IExam, IRoomSlot } from "src/solve/data";
    import { getExamByUUID, insertExamIntoSlot, removeExamFromSlot } from "./../solve/methods";
    import ExamCard from "./ExamCard.svelte";

    export let roomSlot: IRoomSlot;

    let draggingOver = false;
    function dragEnter(ev: DragEvent) {
        ev.preventDefault();
        draggingOver = true;
    }

    function dragLeave(ev: DragEvent) {
        draggingOver = false;
    }

    function dragOver(ev: DragEvent) {
        ev.preventDefault();
    }

    function drop(ev: DragEvent) {
        ev.preventDefault();
        const data = ev.dataTransfer.getData("application/json");
        
        if(!data) return;
        const jsonData = JSON.parse(data);
        setTimeout(_ => insertExamIntoSlot(jsonData.uuid, roomSlot), 1);
        // insertExamIntoSlot(jsonData.uuid, roomSlot);
        
        draggingOver = false;
    }

    function onRemove() {
        removeExamFromSlot(roomSlot);
    }
</script>

<div class="room-slot">
    {#if roomSlot.exam}
        <div class="card-wrapper">
            <ExamCard onRemove={onRemove} exam={roomSlot.exam} displayDuration={true}/>
        </div>
    {:else if roomSlot.blocked}
        <div class="empty"></div>
    {:else} 
        <div class="slot-empty" on:dragenter={dragEnter} on:dragleave={dragLeave} on:drop={drop} on:dragover={dragOver} class:dragging-over={draggingOver}></div>    
    {/if}
</div>

<style>
    .room-slot {
        display: grid;
    }

    .slot-empty {
        background-color: var(--bg-sec);
        margin: calc(var(--padding-normal) * 0.5) var(--padding-normal);
        border-radius: var(--border-small);
    }
    
    .dragging-over {
        outline: var(--fg-sec) 0.125rem solid;
        outline-offset: 0.125rem;
    }

    .card-wrapper {
        z-index: 5;
        padding: var(--padding-small);
    }
</style>