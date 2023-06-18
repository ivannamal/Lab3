if(localStorage.length === 0){
    localStorage.setItem("0;Помідори;Не куплено", 1);
    localStorage.setItem("1;Печиво;Не куплено", 1);
    localStorage.setItem("2;Сир;Не куплено", 1);
}
let items = [];

for(let i=0; i<localStorage.length; i++){
    let name = localStorage.key(i);
    let count = localStorage.getItem(name);
    let bought;
    if(name.split(";")[2]==="Куплено"){
        bought = true;
    }else{
        bought = false;
    }
    let order = name.split(";")[0];
    name = name.split(";")[1];
    items.push({
        name,
        count,
        bought,
        order
    });
}

items.sort((a,b) => a.order-b.order).forEach(a => {
    let section = addItem(a.name, a.count);
    if(a.bought){
        buyItem(section);
    }});


let previousName;

function addItem(product, count){
    const section = document.createElement("section");
    section.appendChild(document.createElement("hr"));
    const sectionElement = document.createElement("section");
    section.appendChild(sectionElement);
    sectionElement.classList.add("item");
    document.querySelector(".list").appendChild(section);
    const inputField = document.createElement("input");
    inputField.classList.add("name");
    inputField.value = product;
    inputField.addEventListener('focusin', function(){
        previousName = inputField.value;
    });
    inputField.addEventListener("focusout", () => {changeName(inputField)});
    sectionElement.appendChild(inputField);
    const addSection = document.createElement("section");
    addSection.classList.add("add");
    const minusButton = document.createElement("button");
    minusButton.classList.add("minus");
    minusButton.innerHTML = "-";
    minusButton.setAttribute("data-tooltip", "Зменшити");
    minusButton.addEventListener("click", () => {reduceItem(sectionElement.querySelector(".add"))});
    if(count == 1){
        minusButton.setAttribute("style", "background-color:#ef9f9e; border-bottom-color: #ed9392; pointer-events:none");
    }else{
        minusButton.setAttribute("style", "pointer-events:all");
    }
    addSection.appendChild(minusButton);
    const amountLabel = document.createElement("label");
    amountLabel.classList.add("amount");
    amountLabel.innerHTML = count;
    addSection.appendChild(amountLabel);
    const plusButton = document.createElement("button");
    plusButton.classList.add("plus");
    plusButton.innerHTML = "+";
    plusButton.setAttribute("data-tooltip", "Збільшити");
    plusButton.addEventListener("click", () => {plusItem(sectionElement.querySelector(".add"))});
    addSection.appendChild(plusButton);
    sectionElement.appendChild(addSection);
    const buySection = document.createElement("section");
    buySection.classList.add("buy");
    const buyButton = document.createElement("button");
    buyButton.classList.add("state");
    buyButton.setAttribute("data-tooltip", "Товар куплено");
    buyButton.innerHTML = "Куплено";
    buyButton.addEventListener("click", () => {buyItem(sectionElement)});
    buySection.appendChild(buyButton);
    const deleteButton = document.createElement("button");
    deleteButton.classList.add("cross");
    deleteButton.setAttribute("data-tooltip", "Видалити товар");
    deleteButton.innerHTML = "×";
    deleteButton.addEventListener("click", () => {deleteItem(section)});
    buySection.appendChild(deleteButton);
    sectionElement.appendChild(buySection);
    const item = document.createElement("span");
    item.classList.add("good");
    item.innerHTML = product;
    const numberOfItem = document.createElement("span");
    numberOfItem.classList.add("number");
    numberOfItem.innerHTML = count;
    item.appendChild(numberOfItem);
    document.querySelector(".not-bought").appendChild(item);
    return sectionElement;
}

const submitButton = document.querySelector(".search-button");
submitButton.addEventListener("click", add);

const input = document.querySelector(".search-input");
input.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        add();
    }
});

function add() {
    if(input.value.replace(/\s/g, "").length){
        const name = input.value;
        let exist;
        for(const good of document.querySelectorAll(".list .item .name")){
            if(good.value.toLowerCase() === name.toLowerCase()){
                if(good.style.textDecoration === ""){
                    plusItem(good.parentElement.querySelector(".add"));
                }
                exist = true;
            }
        }
        if(!exist){
            addItem(name, 1);
            let good = {
                name: name,
                count: 1,
                bought: false,
                order: items.length
            }
            items.push(good);
        }
    }
    input.value = "";
}

function changeName(field){
    if(field.value.replace(/\s/g, "").length){
        let exist;
        for(const good of document.querySelectorAll(".not-bought span")){
            if(good.childNodes[0].textContent.toLowerCase() === field.value.toLowerCase()){
                exist = true;
            }
        }
        if(exist){
            field.value = previousName;
        }else{
            for(const good of document.querySelectorAll(".not-bought span")){
                if(previousName === good.childNodes[0].textContent){
                    good.childNodes[0].textContent = field.value;
                    for(const item of items){
                        if(item.name == previousName){
                            item.name = field.value;
                        }
                    }
                }
            }
        }
    }else{
        field.value = previousName;
    }
}

function deleteItem(item){
    item.remove();
    let name = item.querySelector(".name").value;
    const index = items.indexOf(items.filter((o) => o.name === name)[0]);
    items.splice(index, 1);
    for(const good of document.querySelectorAll(".not-bought span")){
        if(name === good.childNodes[0].textContent){
            good.remove();
        }
    }
}


function reduceItem(amount){
    amount.querySelector(".quantity").textContent = +amount.querySelector(".quantity").textContent - 1;
    if(+amount.querySelector(".quantity").textContent === 1){
        amount.querySelector(".minus").setAttribute("style", "background-color:#ef9f9e; border-bottom-color: #ed9392; pointer-events:none");
    }
    let name = amount.parentElement.querySelector(".name").value;
    for(const item of items){
        if(item.name === name){
            item.count = +amount.querySelector(".quantity").textContent;
        }
    }
    for(const good of document.querySelectorAll(".not-bought span")){
        if(name === good.childNodes[0].textContent){
            good.childNodes[1].textContent = +good.childNodes[1].textContent-1;
        }
    }

}

function plusItem(amount){
    amount.querySelector(".quantity").innerHTML = +amount.querySelector(".quantity").innerHTML + 1;
    if(+amount.querySelector(".quantity").innerHTML === 2){
        amount.querySelector(".minus").removeAttribute("style");
    }
    let name = amount.parentElement.querySelector(".name").value;
    for(const item of items){
        if(item.name === name){
            item.count = +amount.querySelector(".quantity").textContent;
        }
    }
    for(const good of document.querySelectorAll(".not-bought span")){
        if(name === good.childNodes[0].textContent){
            good.childNodes[1].textContent = +good.childNodes[1].textContent+1;
        }
    }
}

function buyItem(section){
    section.querySelector(".buy .state").remove();
    const button = document.createElement("button");
    button.classList.add("state");
    button.classList.add("tooltip");
    button.setAttribute("data-tooltip", "Товар не куплено");
    button.textContent = "Не куплено";
    button.addEventListener("click", () => {unbuyItem(section)});
    section.querySelector(".buy").appendChild(button);
    section.querySelector(".buy .cross").setAttribute("style", "display:none");
    section.querySelector(".name").setAttribute("style", "text-decoration: line-through; pointer-events:none");
    section.querySelector(".add .minus").setAttribute("style", "visibility: hidden");
    section.querySelector(".add .plus").setAttribute("style", "visibility: hidden");
    let name = section.querySelector(".name").value;
    for(const good of items){
        if(good.name === name){
            good.bought = true;
        }
    }
    let item;
    for(const good of document.querySelectorAll(".not-bought span")){
        if(name === good.childNodes[0].textContent){
            item = good;
            good.remove();
        }
    }
    document.querySelector(".status .bought").appendChild(item);
    item.setAttribute("style", "text-decoration: line-through");
    item.querySelector("span").setAttribute("style", "text-decoration: line-through");
}

function unbuyItem(section){
    section.querySelector(".buy .state").remove();
    const button = document.createElement("button");
    button.classList.add("state");
    button.setAttribute("data-tooltip", "Товар куплено");
    button.textContent = "Куплено";
    button.addEventListener("click", () => {buyItem(section)});
    section.querySelector(".buy").insertBefore(button, section.querySelector(".buy .cross"));
    section.querySelector(".buy .cross").removeAttribute("style");
    section.querySelector(".name").setAttribute("style", "pointer-events:all");
    if(+section.querySelector(".add .amount").textContent === 1){
        section.querySelector(".add .minus").setAttribute("style", "background-color:#ef9f9e; border-bottom-color: #ed9392; pointer-events:none");
    }else{
        section.querySelector(".add .minus").removeAttribute("style");
    }
    section.querySelector(".add .plus").removeAttribute("style");
    let name = section.querySelector(".name").value;
    for(const good of items){
        if(good.name === name){
            good.bought = false;
        }
    }
    let item;
    for(const good of document.querySelectorAll(".bought span")){
        if(name === good.childNodes[0].textContent){
            item = good;
            good.remove();
        }
    }
    document.querySelector(".status .not-bought").appendChild(item);
    item.removeAttribute("style");
    item.querySelector("span").removeAttribute("style");
}

window.onbeforeunload = function(){
    localStorage.clear();
    for(let i=0; i<items.length; i++){
        if(items[i].bought){
            localStorage.setItem(i+";"+items[i].name+";Куплено", items[i].count);
        }else{
            localStorage.setItem(i+";"+items[i].name+";Не куплено", items[i].count);
        }
    }
}



