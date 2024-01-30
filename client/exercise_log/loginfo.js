class GeneralInfoAndExerciseDisplay {
    constructor(){
        this.geninfo = {};
        this.exercises = [];
        this.cur_id = 0;
    }

    async init(){
        const response = await fetch(`/numLogs`, {
            method: 'GET',
        });
        const data = await response.json();
        console.log(data);
        this.cur_id = Number.parseInt(data) + 1;
    }


    async saveGeneralInfo(date, bodyweight, sleep, calories, day){
        const data = {date, bodyweight, sleep, calories, day};
        this.geninfo = JSON.parse(JSON.stringify(data));
        try {
            const response = await fetch(`/genInfo?date=${date}&bodyweight=${bodyweight}&sleep=${sleep}&calories=${calories}&day=${day}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });

            const responseData = await response.json();
            if (responseData.ok){
                this.cur_id++;
                console.log(this.cur_id);
            }
        } catch (error) {
            console.log(error);
        }
    }

    async saveExerciseInfo(exercise, weight, set1, set2, set3, set4){
        const data = {exercise, weight, set1, set2, set3, set4};
        this.exercises.push(data);
        try{
            const response = await fetch(`/exerciseInfo?id=${this.cur_id}&exercise=${exercise}&weight=${weight}&set1=${set1}&set2=${set2}&set3=${set3}&set4=${set4}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });
            const responseData = response.json();
        }catch(err){
            console.log(err);
        }
    }

}

class DisplayLog{
    async render(element, id){
        const logDisplayResponse = await fetch(`/logDisplay?id=${id}`, {
            method: 'GET',
        });
        if (logDisplayResponse.ok) {
            const logValue = await logDisplayResponse.json();
            const newDiv = document.createElement("div");
            let html = "";
            html += `<h1>Log # ${id}</h1>`;
            html += `<h2>Date:${logValue.geninfo.date}      
                  Body Weight:${logValue.geninfo.bodyweight}  
                        Sleep:${logValue.geninfo.sleep}
                     Calories:${logValue.geninfo.calories}
              Day of the Week:${logValue.geninfo.day}
                    </h2>`;
            html += '<br> <table>';
            html += `
                    <tr>
                        <td>Exercise</td>
                        <td>Weight (in lbs)</td>
                        <td>Set 1</td>
                        <td>Set 2</td>
                        <td>Set 3</td>
                        <td>Set 4</td>
                    </tr>
                `;
            logValue.exercises.forEach((ex) => {
                html += `
                    <tr>
                        <td>${ex.exercise}</td>
                        <td>${ex.weight}</td>
                        <td>${ex.set1}</td>
                        <td>${ex.set2}</td>
                        <td>${ex.set3}</td>
                        <td>${ex.set4}</td>
                    </tr>
                `;
            });
            html += '</table> <br>';
            newDiv.innerHTML = html;
            element.appendChild(newDiv);
            return 0;
        }else {
            return -1;
        }
    }

    async renderAll(element){
        const logDisplayResponse = await fetch(`/logDisplayAll`, {
            method: 'GET',
        });
        const logValue = await logDisplayResponse.json();
        const newDiv = document.createElement("div");
        let html = "";
        html += "<h1>Complete Log</h1>";
        logValue.forEach((log) => {
            html += `<h2>Date:${log.geninfo.date}      
                  Body Weight:${log.geninfo.bodyweight}  
                        Sleep:${log.geninfo.sleep}
                     Calories:${log.geninfo.calories}
              Day of the Week:${log.geninfo.day}
                    </h2>`;
            html += '<br> <table>';
            html += `
                    <tr>
                        <td>Exercise</td>
                        <td>Weight (in lbs)</td>
                        <td>Set 1</td>
                        <td>Set 2</td>
                        <td>Set 3</td>
                        <td>Set 4</td>
                    </tr>
                `;
            log.exercises.forEach((ex) => {
                html += `
                <tr>
                    <td>${ex.exercise}</td>
                    <td>${ex.weight}</td>
                    <td>${ex.set1}</td>
                    <td>${ex.set2}</td>
                    <td>${ex.set3}</td>
                    <td>${ex.set4}</td>
                </tr>
            `;
            });
            html += '</table> <br>';
        });
        newDiv.innerHTML = html;
        element.appendChild(newDiv);
    }
}

class UpdateAndDeleteLog{
    async updateLog(id, newObj){
        const date = newObj.date;
        const bodyweight = newObj.bodyweight;
        const sleep = newObj.sleep;
        const calories = newObj.calories;
        const day = newObj.day;
        const data = {id, date, bodyweight, sleep, calories, day};
        try{
             const response = await fetch(`/updateInfo?id=${id}&date=${date}&bodyweight=${bodyweight}&sleep=${sleep}&calories=${calories}&day=${day}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data),
                });
                const responseData = await response.json();
                console.log(responseData);
                return 0;
            }catch(err){
                console.log(err);
                return -1;
            }
        
    }

    async deleteLog(id){
        const data = {id};
        try {
            const response = await fetch(`/deleteLog?id=${id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });
            const responseData = await response.json();
            console.log(responseData);
            return 0;
        } catch (error) {
            console.log(error);
            return -1;
        }
    }

    async deleteAllLogs(){
        try {
            const response = await fetch(`/deleteAllLogs?`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            
            const responseData = await response.json();
            console.log(responseData);
            return 0;
        } catch (error) {
            console.log(error);
            return -1;
        }
    }
}




export const generalInfoAndExerciseObj = new GeneralInfoAndExerciseDisplay();
export const logDisplayObj = new DisplayLog();
export const updateAndDeleteLogObj = new UpdateAndDeleteLog();
