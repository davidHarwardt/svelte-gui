
type HardConstraint<T, U> = (value: T, candidate: U) => boolean;
type SoftConstraint<T, U> = (value: T, candidate: U) => number;

type Ranked<T> = { value: T, score: number };
type Indexed<T> = { value: T, idx: number };


function* map<T, U>(gen: Generator<T>, fn: (v: T) => U) {
    let { value, done } = gen.next();

    while(!done) {
        yield fn(value);
        ({ value, done } = gen.next());
    }
}

function reduce<T, U>(gen: Generator<T>, fn: (acc: U, value: T) => U): U {
    let { value, done } = gen.next();
    let acc = value;

    while(!done) {
        ({ value, done } = gen.next());
        if(!done) acc = fn(acc, value);
    }
    return acc;
}

function* filter<T>(gen: Generator<T>, fn: (v: T) => boolean) {
    let { value, done } = gen.next();

    while(!done) {
        if(fn(value)) yield value;
        ({ value, done } = gen.next());
    }
}

function applyHard<T, U>(v: T, candidate: U, constraints: HardConstraint<T, U>[]) {
    for(const c of constraints) {
        if(!c(v, candidate)) return false;
    }
    return true;
}

function applySoft<T, U>(v: T, candidate: U, constraints: SoftConstraint<T, U>[]) {
    return constraints.reduce((acc, c) => acc + c(v, candidate), 0);
}

class SolverError<T, U> extends Error {
    finished: [T, U][];

    constructor(descr: string, finished: [T, U][]) {
        super(descr);
        this.finished = finished;
    }
}

function solve<T, U>(
    values: T[],
    candidates: () => Generator<U>,
    mutator: (value: T, pairedCandidate: U) => void,

    hardConstraints: HardConstraint<T, U>[],
    softConstraints: SoftConstraint<T, U>[],
): [T, U][] {
    const finished: [T, U][] = [];
    const cloned = values.slice();
    const skipped: T[] = [];

    while(cloned.length > 0) {
        const found = values.map((v, i) => {
            const best = reduce(map(filter(candidates(),
            // filter hard
            candidate => applyHard(v, candidate, hardConstraints)),
            // rank soft
            candidate => (<Ranked<U>>{ value: candidate, score: applySoft(v, candidate, softConstraints) })),
            // reduce max
            (acc: Ranked<U>, v) => v.score > acc.score ? v : acc);  

            if(!best) throw new SolverError(`couldtn find item matching criteria (${cloned.length} items remaining)`, finished);
            
            return <Ranked<[T, U]>> {
                score: best.score,
                value: [v, best.value],
            };
        })
        .map((value, idx) => (<Indexed<Ranked<[T, U]>>>{ value, idx }))
        .reduce((acc, v) => v.value.score > acc.value.score ? v : acc);

        // couldtn find a matching item
        if(!found) throw new SolverError(`couldtn find item matching criteria (${cloned.length} items remaining)`, finished);
        cloned.splice(found.idx, 1);
        // call mutator on the found values to enter eg. calendar events
        mutator(found.value.value[0], found.value.value[1]);
        finished.push(found.value.value);
    }
    
    return finished;
}

export type {
    HardConstraint,
    SoftConstraint,
}

export {
    solve,
    SolverError,
}
