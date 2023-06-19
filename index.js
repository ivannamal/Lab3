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
    buyButton.setAttribute("data-tooltip", "Придбано");
    buyButton.innerHTML = "Куплено";
    buyButton.addEventListener("click", () => {buyItem(sectionElement)});
    buySection.appendChild(buyButton);
    const deleteButton = document.createElement("button");
    deleteButton.classList.add("cross");
    deleteButton.setAttribute("data-tooltip", "Видалити");
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

    for(const good of document.querySelectorAll(".not-bought span")){
        if(name === good.childNodes[0].textContent){
            good.remove();
        }
    }
}


function reduceItem(amount){
    amount.querySelector(".amount").textContent = +amount.querySelector(".amount").textContent - 1;
    if(+amount.querySelector(".amount").textContent === 1){
        amount.querySelector(".minus").setAttribute("style", "background-color:#ef9f9e; border-bottom-color: #ed9392; pointer-events:none");
    }
    let name = amount.parentElement.querySelector(".name").value;

    for(const good of document.querySelectorAll(".not-bought span")){
        if(name === good.childNodes[0].textContent){
            good.childNodes[1].textContent = +good.childNodes[1].textContent-1;
        }
    }

}

function plusItem(amount){
    amount.querySelector(".amount").innerHTML = +amount.querySelector(".amount").innerHTML + 1;
    if(+amount.querySelector(".amount").innerHTML === 2){
        amount.querySelector(".minus").removeAttribute("style");
    }
    let name = amount.parentElement.querySelector(".name").value;

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
    button.setAttribute("data-tooltip", "Купити?");
    button.textContent = "Не куплено";
    button.addEventListener("click", () => {unbuyItem(section)});
    section.querySelector(".buy").appendChild(button);
    section.querySelector(".buy .cross").setAttribute("style", "display:none");
    section.querySelector(".name").setAttribute("style", "text-decoration: line-through; pointer-events:none");
    section.querySelector(".minus").setAttribute("style", "visibility: hidden");
    section.querySelector(".plus").setAttribute("style", "visibility: hidden");
    let name = section.querySelector(".name").value;

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
    button.setAttribute("data-tooltip", "Придбано");
    button.textContent = "Куплено";
    button.addEventListener("click", () => {buyItem(section)});
    section.querySelector(".buy").insertBefore(button, section.querySelector(".buy .cross"));
    section.querySelector(".buy .cross").removeAttribute("style");
    section.querySelector(".name").setAttribute("style", "pointer-events:all");
    if(+section.querySelector(" .amount").textContent === 1){
        section.querySelector(".minus").setAttribute("style", "background-color:#ef9f9e; border-bottom-color: #ed9392; pointer-events:none");
    }else{
        section.querySelector(".minus").removeAttribute("style");
    }
    section.querySelector(".plus").removeAttribute("style");
    let name = section.querySelector(".name").value;

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

addItem("Помідори",1);
addItem("Печиво",1);
addItem("Сир",1);



