import { generalInfoAndExerciseObj, logDisplayObj, updateAndDeleteLogObj } from "./loginfo.js"

const dateElement = document.getElementById('date');
const bodyWeightElement = document.getElementById('body-weight');
const sleepElement = document.getElementById('sleep');
const caloriesElement = document.getElementById('calories');
const dayElement = document.getElementById('day');
const exerciseElement = document.getElementById('exercise');
const weightElement = document.getElementById('weight');
const set1Element = document.getElementById('set-1');
const set2Element = document.getElementById('set-2');
const set3Element = document.getElementById('set-3');
const set4Element = document.getElementById('set-4');
const saveButton = document.getElementById('save-button');
const addButton = document.getElementById('add-button');
const createButton = document.getElementById('create-button');
const workoutsElement = document.getElementById('workouts');
const generalInfoElement = document.getElementById('gen-info');
const resetButton = document.getElementById('reset-button');
const displayButton = document.getElementById('display-button');
const logIdElement = document.getElementById('log-id');
const displayAllButton = document.getElementById('display-all-button');
const updateButton = document.getElementById('update-button');
const deleteButton = document.getElementById('delete-button');
const deleteAllButton = document.getElementById('delete-all-button');
const inputsElement = document.getElementById('inputs');
const generalDivElement = document.getElementById('general-information');
const generalDivElement2 = document.getElementById('general-information2');
const logNumberElement = document.getElementById('log-number');
let updateClicked = false;
let exercises_count = 0;


saveButton.addEventListener('click', async function(event){
    const date = dateElement.value;
    const bodyweight = bodyWeightElement.value;
    const sleep = sleepElement.value;
    const calories = caloriesElement.value;
    const day = dayElement.value;
    if (date !== "" && bodyweight !== "" && sleep !== "" && calories !== "" && day !== ""){
        await generalInfoAndExerciseObj.init();
        await generalInfoAndExerciseObj.saveGeneralInfo(date, bodyweight, sleep, calories, day);
    }
    event.target.hidden = true;
    addButton.hidden = false;
    inputsElement.hidden = false;
    generalDivElement.hidden = true;
    generalDivElement2.hidden = true;
});

addButton.addEventListener('click', function(event){
    const exercise = exerciseElement.value;
    const weight = weightElement.value;
    const set1 = set1Element.value;
    const set2 = set2Element.value;
    const set3 = set3Element.value;
    const set4 = set4Element.value;
    if (exercises_count > 0 && createButton.hidden == true) {
        createButton.hidden = false;
    }
    if (exercise !== "" && weight !== "" && set1 !== "" && set2 !== "" && set3 !== "" && set4 !== ""){
        generalInfoAndExerciseObj.saveExerciseInfo(exercise, weight, set1, set2, set3, set4);
        // exerciseInfoObj.render(workoutsElement);
        ++exercises_count;
        if (exercises_count.length >= 10){
            alert("Can't add more workouts");
            event.target.hidden = true;
        }
        createButton.hidden = false;
        resetButton.hidden = false;
        exerciseElement.value = "";
        weightElement.value = "";
        set1Element.value = "";
        set2Element.value = "";
        set3Element.value = "";
        set4Element.value = "";
        alert("Added workout!")
    }
});

createButton.addEventListener('click', function(event){
    removeGeneralInfoAndExercises();
    if (exercises_count > 0){
        resetAll();
        displayButton.hidden = false;
        displayAllButton.hidden = false;
        updateButton.hidden = false;
        deleteButton.hidden = false;
        deleteAllButton.hidden = false;
        logIdElement.hidden = false;
        logNumberElement.hidden = false;
        exercises_count = 0;
        alert("Succesfully created log !");
    }
});

resetButton.addEventListener('click', resetAll);

displayButton.addEventListener('click', async function(event){
    removeGeneralInfoAndExercises();
    let id = logIdElement.value;
    if ((id !== undefined || id !== "")){
        let value = await logDisplayObj.render(workoutsElement, id);
        if (value == -1){
            alert('No log associated with this id');
        }else{
            resetAll();
            displayButton.hidden = false;
            displayAllButton.hidden = false;
            updateButton.hidden = false;
            deleteButton.hidden = false;
            deleteAllButton.hidden = false;
            logIdElement.hidden = false;
        }
    }
});

displayAllButton.addEventListener('click', function(){
    removeGeneralInfoAndExercises();
    logDisplayObj.renderAll(workoutsElement);
    resetAll();
    displayButton.hidden = false;
    displayAllButton.hidden = false;
    updateButton.hidden = false;
    deleteButton.hidden = false;
    deleteAllButton.hidden = false;
    logIdElement.hidden = false;
});

updateButton.addEventListener('click', async function(){
    if (updateClicked == false){
        updateClicked = true;
        removeGeneralInfoAndExercises();
        inputsElement.hidden = true;
    }else{
        const id = logIdElement.value;
        const newGenInfo ={
                            date : dateElement.value,
                            bodyweight : bodyWeightElement.value,
                            sleep : sleepElement.value,
                            calories : caloriesElement.value,
                            day : dayElement.value,
                        }
        if (id !== undefined || id !== ""){
            let value = await updateAndDeleteLogObj.updateLog(id, newGenInfo);
            if (value == -1){
                alert('No log associated with this id');
            }else{
                updateClicked = false;
                alert('Updated log #' + id);
                resetAll();
                displayButton.hidden = false;
                displayAllButton.hidden = false;
                updateButton.hidden = false;
                deleteButton.hidden = false;
                deleteAllButton.hidden = false;
                logIdElement.hidden = false;
            }
        }
    }
});
deleteButton.addEventListener('click', async function(){
    removeGeneralInfoAndExercises();
    const id = logIdElement.value;
    if (id !== undefined || id !== ""){
        let value = await updateAndDeleteLogObj.deleteLog(id);
        if (value == -1){
            alert('No log associated with this id');
        }else{
            alert('Deleted log #' + id);
            resetAll();
            displayButton.hidden = false;
            displayAllButton.hidden = false;
            updateButton.hidden = false;
            deleteButton.hidden = false;
            deleteAllButton.hidden = false;
            logIdElement.hidden = false;
        }
    }
});
deleteAllButton.addEventListener('click', async function(){
    removeGeneralInfoAndExercises();
    const id = logIdElement.value;
    if (id !== undefined || id !== ""){
        let value = await updateAndDeleteLogObj.deleteAllLogs();
        if (value == -1){
            alert('No log associated with this id');
        }else{
            alert('Deleted all logs !');
            resetAll();
        }
    }
});


function resetAll(){
    dateElement.value = "";
    bodyWeightElement.value = "";
    sleepElement.value = "";
    caloriesElement.value = "";
    dayElement.value = "";
    exerciseElement.value = "";
    weightElement.value = "";
    set1Element.value = "";
    set2Element.value = "";
    set3Element.value = "";
    set4Element.value = "";
    logIdElement.value = "";
    saveButton.hidden = false;
    addButton.hidden = true;
    createButton.hidden = true;
    displayAllButton.hidden = true;
    resetButton.hidden = true;
    deleteButton.hidden = true;
    deleteAllButton.hidden = true;
    updateButton.hidden = true;
    displayButton.hidden = true;
    inputsElement.hidden = true;
    generalDivElement.hidden = false;
    generalDivElement2.hidden = false;
}


function removeGeneralInfoAndExercises(){
    while(generalInfoElement.firstChild){
        generalInfoElement.removeChild(generalInfoElement.firstChild);
    }
    while(workoutsElement.firstChild){
        workoutsElement.removeChild(workoutsElement.firstChild);
    }
}