let goal = 2000
let total = 0
let list=[]

let streakDays = Number(localStorage.getItem("streakDays"))||0

let lastCompleteDate = localStorage.getItem("lastCompleteDate")

function getToday(){
    const d = new Date()
    return d.getFullYear() + "-" +
           String(d.getMonth()+1).padStart(2,"0") + "-" +
           String(d.getDate()).padStart(2,"0")
}

function updateStreak(){
    document.getElementById("streak").innerText = "連續達成" + streakDays +"天"
}


function checkStreak(){

    let today = getToday()

    if(lastCompleteDate ===today) return

    let yesterdayDate = new Date()
    yesterdayDate.setDate(yesterdayDate.getDate()-1)

    let yesterday = yesterdayDate.getFullYear() + "-" +
                    String(yesterdayDate.getMonth()+1).padStart(2,"0") + "-" +
                    String(yesterdayDate.getDate()).padStart(2,"0")

    if(lastCompleteDate ===yesterday){
        streakDays++
    }else{
        streakDays = 1
    }

    lastCompleteDate = today
    localStorage.setItem("streakDays", streakDays)
    localStorage.setItem("lastCompleteDate", today)

    updateStreak()
}

function save(){

    const data = {
        total:total,
        list:list,
        date:getToday()
    }

    localStorage.setItem("drinkData",JSON.stringify(data)) 
}

function load(){
    const saved = localStorage.getItem("drinkData")
    if(!saved){
        total = 0
        list = []
        render()
        return
    }

    let data = JSON.parse(saved)

    let today = getToday()

    if(data.date !== today){
        localStorage.removeItem("drinkData")
        total = 0
        list = []
        render()
        return
    }

    total = data.total
    list = data.list

    render()

}

function addDrink(){
    let amount = Number(document.getElementById("amount").value)

    let ratio = document.getElementById("drink").value

    let drinkName = document.getElementById("drink").selectedOptions[0].text

    if(!amount) return

    let water = Math.round(amount*ratio)

    total += water

    let item ={
        drink: drinkName,
        amount: amount,
        water:water
    }

    if(total >= goal){
        checkStreak()
    }

    list.push(item)

    render()
    save()
    }

function render(){
    document.getElementById("total").innerText = total + "ml"
    
    let ul = document.getElementById("list")
    ul.innerHTML = ""

    list.forEach((item,index)=>{

        let li = document.createElement("li")

        li.innerText = item.drink + item.amount + "ml，" + "含水量" + item.water + "ml"

        let btn = document.createElement("button")

        btn.innerText = "刪除"
        btn.onclick = function(){
            total -=item.water
            list.splice(index,1)
            
            render()
            save()
        }

        li.appendChild(btn)
        ul.appendChild(li)
    })

    let percent = (total / goal)*100

    if(percent > 100) percent = 100

    document.getElementById("progress-bar").style.width = percent + "%"

    if(percent <50 && percent >= 0){ 
        document.getElementById("progress-bar").style.backgroundColor = "red"
    }
    else if(percent <=99 && percent>=50){
        document.getElementById("progress-bar").style.backgroundColor = "orange"
    }
    else if(percent >=100){
        document.getElementById("progress-bar").style.backgroundColor = "green"
    }

    document.getElementById("drinkPercent").innerText = "今日已喝了" + percent +"%"

    updateStreak()
}


function restToday(){
    total = 0
    list = []

    localStorage.removeItem("drinkData")

    render()
}



function showDate(){
    let today = new Date()

    let text = today.getFullYear() + "/" + (today.getMonth()+1) + "/" + today.getDate()

    document.getElementById("date").innerText = text
}


    load()
    showDate()
    updateStreak()


