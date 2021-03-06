const httprequest = new XMLHttpRequest;
const url = location.search.split("?");
const id = url[1].split("=")[1];

var countries;
const http = new XMLHttpRequest();
http.open("GET", "http://localhost:2000/getCountries");
http.send();
http.onreadystatechange = function () {
    if (http.status === 200 && http.readyState === 4) {
        countries = JSON.parse(http.responseText);
        const countrySelect = document.getElementById("countrySelect");
        for (let i = 0; i < countries.length; i++) {
            const x = document.createElement("option");
            x.value = countries[i].id;
            x.innerHTML = countries[i].name;
            countrySelect.appendChild(x);
        }
    }
};


httprequest.open("GET", "http://localhost:2000/getSupermarketById?id=" + id);
httprequest.send();
httprequest.onreadystatechange = function () {
    if (httprequest.status === 200 && httprequest.readyState === 4) {
        createEverything(JSON.parse(httprequest.responseText));
    }
    if (httprequest.status === 404 && httprequest.readyState === 4) {
        const h = document.createElement("p");
        h.class = "lead";
        h.innerHTML = JSON.parse(httprequest.responseText).error;
        document.getElementById("container").appendChild(h);

    }
};

function showLocationOverlay() {
    on("locationOverlay");
}

function hideLocationOverlay() {
    document.getElementById("locationOverlay").style.display = "none";
}

window.onclick = function (event) {
    const overlay = document.getElementById("locationOverlay");
    if (event.target === overlay) {
        overlay.style.display = "none";
    }
};

function on(name) {
    document.getElementById(name).style.display = "block";
}

function items(prices) {
    let i;
    const col = ["Price", "Name", "Company", "Logo"];

    const table = document.createElement("table");

    let tr = table.insertRow(-1);

    for (i = 0; i < col.length; i++) {
        const th = document.createElement("th");
        th.innerHTML = col[i];
        tr.appendChild(th);
    }


    for (i = 0; i < prices.length; i++) {

        tr = table.insertRow(-1);

        for (let j = 0; j < col.length; j++) {
            const tabCell = tr.insertCell(-1);
            if (col[j] === "Logo") {
                if (prices[i].logo === "null") {
                    tabCell.innerHTML = "No logo yet";
                } else {
                    tabCell.innerHTML = "<img style='height:30px;' src='data:image/png;base64," + prices[i].logo + "'>";
                }
            }
            else if (col[j] === "Company") {
                const x = document.createElement("a");
                x.setAttribute("class", "nav-link");

                x.href = "../company/company.html?id=" + prices[i].companyId;
                x.innerHTML = prices[i].company.split("+").join(" ");
                tabCell.appendChild(x);
            }
            else if (col[j] === "Name") {
                const x = document.createElement("a");
                x.setAttribute("class", "nav-link");

                x.href = "../item/item.html?id=" + prices[i].itemId;
                x.innerHTML = prices[i].name.split("+").join(" ");
                tabCell.appendChild(x);
            }
            else {
                tabCell.innerHTML = prices[i].price;
            }
        }
    }
    table.setAttribute("class", "table");

    document.getElementById("section2").appendChild(table)
}

function locations(locations) {
    const col = ["Address", "Country", "Flag", ""];

    const table = document.createElement("table");

    let tf = table.insertRow(-1);

    for (let z = 0; z < col.length; z++) {
        const th = document.createElement("th");
        th.innerHTML = col[z];
        tf.appendChild(th);
    }


    for (let i = 0; i < locations.length; i++) {

        let tr = table.insertRow(-1);

        for (let j = 0; j < col.length; j++) {
            const tabCell = tr.insertCell(-1);
            if (col[j] === "Flag") {
                if (locations[i].flag === "null") {
                    tabCell.innerHTML = "No logo yet";
                } else {
                    tabCell.innerHTML = "<img class='flag' style='height:30px;' src='data:image/png;base64," + locations[i].flag + "'>";
                }
            }
            else if (col[j] === "Country") {
                const x = document.createElement("a");
                x.setAttribute("class", "nav-link name");

                x.href = "../country/country.html?id=" + locations[i].countryId;
                x.innerHTML = locations[i].countryName.split("+").join(" ");
                tabCell.appendChild(x);
            }
            else if (col[j] === "Address") {
                tabCell.innerHTML = locations[i].address.split("+").join(" ");
                tabCell.setAttribute("class", "address");
            }
            else {
                const editBtn = document.createElement("button");
                editBtn.setAttribute("class", "btn btn-outline-warning");
                editBtn.innerHTML = "Edit";
                tabCell.appendChild(editBtn);

                editBtn.onclick = edit;

                function edit() {
                    const before = tr.innerHTML;
                    const http = new XMLHttpRequest();
                    http.open("GET", "http://localhost:2000/getCountries");
                    http.send();
                    http.onreadystatechange = function () {
                        if (http.status === 200 && http.readyState === 4) {


                            const name = tr.getElementsByClassName("name")[0].innerHTML;
                            const flag = tr.getElementsByClassName("flag")[0];
                            const address = tr.getElementsByClassName("address")[0].innerHTML;

                            let cell = tr.insertCell(-1);
                            const nameField = document.createElement("input");
                            nameField.setAttribute("class", "form-control");
                            nameField.value = address;
                            cell.appendChild(nameField);
                            tr.innerHTML = "";
                            tr.appendChild(cell);


                            cell = tr.insertCell(-1);

                            const x = document.createElement("select");
                            x.setAttribute("class", "form-control");
                            x.id = "select";

                            const json2 = JSON.parse(http.responseText);
                            for (let j = 0; j < json2.length; j++) {
                                const y = document.createElement("option");
                                y.value = json2[j].id + "::::" + json2[j].flag;
                                y.innerHTML = json2[j].name;
                                if (json2[j].name === name) {
                                    y.selected = true;
                                }
                                x.appendChild(y);

                            }

                            x.onchange = function () {
                                flag.src = "data:image/png;base64," + x.options[x.selectedIndex].value.split("::::")[1];
                            };
                            cell.appendChild(x);
                            tr.appendChild(cell);


                            cell = tr.insertCell(-1);
                            cell.appendChild(flag);

                            const saveBtn = document.createElement("button");
                            saveBtn.innerHTML = "Save";
                            saveBtn.setAttribute("class", "btn btn-outline-success");
                            saveBtn.style.marginRight = "10px";
                            saveBtn.onclick = function () {
                                const id = locations[i].id;

                                const h = new XMLHttpRequest();
                                h.open("GET", "http://localhost:2000/updateLocation?id=" + id + "&countryId=" + x.options[x.selectedIndex].value.split("::::")[0] + "&address=" + nameField.value);
                                h.send();
                                window.location = window.location;
                            };

                            const declineBtn = document.createElement("button");
                            declineBtn.innerHTML = "Delete Location";
                            declineBtn.setAttribute("class", "btn btn-outline-warning");
                            declineBtn.style.marginRight = "10px";
                            declineBtn.onclick = function () {
                                tr.innerHTML = before;
                            };


                            const deleteBtn = document.createElement("button");
                            deleteBtn.innerHTML = "Delete Location";
                            deleteBtn.setAttribute("class", "btn btn-outline-danger");
                            deleteBtn.onclick = function () {
                                const id = locations[i].id;

                                const h = new XMLHttpRequest();
                                h.open("GET", "http://localhost:2000/removeLocation?id=" + id);
                                h.send();
                                table.removeChild(tr);
                            };

                            const div = document.createElement("div");
                            div.appendChild(saveBtn);
                            div.appendChild(declineBtn);
                            div.appendChild(deleteBtn);

                            const c = tr.insertCell(-1);
                            c.appendChild(div);
                        }
                    };


                }

            }


        }
    }
    table.setAttribute("class", "table");

    document.getElementById("section3").appendChild(table);
}

function general(json) {
    function handleFileSelect(evt) {
        const files = evt.target.files;

        let i = 0, f;
        for (; f = files[i]; i++) {

            if (!f.type.match('image.*')) {
                continue;
            }

            const reader = new FileReader();

            reader.onload = (function () {
                return function (e) {
                    const img = document.getElementById('logo');
                    img.src = e.target.result;
                };
            })(f);

            // Read in the image file as a data URL.
            reader.readAsDataURL(f);
        }
    }

    document.getElementById('picker').addEventListener('change', handleFileSelect, false);


    const img = document.getElementById("logo");
    if (json.supermarketLogo !== "null") {
        img.src = "data:image/png;base64," + json.supermarketLogo;
    }

    const name = document.getElementById("name");
    name.innerHTML = json.supermarketName;
}

function createEverything(json) {
    general(json);
    locations(json.locations);
    items(json.prices);
}

function editName() {

    const edit = document.getElementById("edit");
    const before = edit.innerHTML;

    const button = document.createElement("button");
    button.innerHTML = "Apply";
    button.style.marginTop = "10px";
    button.setAttribute("class", "btn btn-success");
    button.onclick = apply;

    function apply() {
        const name = document.getElementById("nameInput").value;

        edit.innerHTML = before;
        if (!(name === "")) {
            document.getElementById("name").innerHTML = name;
        }
    }

    const button2 = document.createElement("button");
    button2.innerHTML = "Decline";
    button2.style.marginTop = "10px";
    button2.style.marginLeft = "10px";
    button2.setAttribute("class", "btn btn-danger");

    function dismiss() {
        edit.innerHTML = before;
    }

    button2.onclick = dismiss;

    edit.innerHTML = "<input value='" + document.getElementById("name").innerHTML + "' id='nameInput' type=\"text\" class=\"form-control\">";


    edit.appendChild(button);
    edit.appendChild(button2);

}

function save() {
    if (confirm("Do you really want to save the logo and the name?")) {
        const name = document.getElementById("name").innerHTML;
        const img = document.getElementById("logo").src.split(";base64,")[1];

        const id = location.search.split("?")[1].split("=")[1];

        const httprequest = new XMLHttpRequest();
        httprequest.open("GET", "http://localhost:2000/updateSupermarket?name=" + name + "&logo=" + img + "&id=" + id);
        httprequest.send();
    }
}

function deleteSupermarket() {
    if (confirm("Do you really want to request a deletion of the supermarket via email?")) {
        window.location.href = "mailto:supermarket.comparer@gmail.com";
    }
}

function addLocation() {
    const http = new XMLHttpRequest();
    http.open("GET", "http://localhost:2000/addLocation?countryId=" + document.getElementById("countrySelect").options[document.getElementById("countrySelect").selectedIndex].value + "&address=" + document.getElementById("addressInput").value + "&supermarketId=" + id);
    http.send();
    hideLocationOverlay();
    location.href = location.href;
}