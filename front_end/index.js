google.charts.load('current', {
    'packages': ['corechart', 'bar']
});
google.charts.setOnLoadCallback(loadTable);

function loadTable() {
    const xhttp = new XMLHttpRequest();
    xhttp.open("GET", "http://localhost:3000/Index");
    xhttp.send();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var trHTML = '';
            var num = 1;
            const objects = JSON.parse(this.responseText);
            for (let object of objects) {

                trHTML += '<tr>';
                trHTML += '<td>' + num + '</td>';
                trHTML += '<td>' + object['Date received'] + '</td>';
                trHTML += '<td>' + object['Product'] + '</td>';
                trHTML += '<td>' + object['Sub-product'] + '</td>';
                trHTML += '<td>' + object['Issue'] + '</td>';
                trHTML += '<td>' + object['Sub-issue'] + '</td>';
                trHTML += '<td>' + object['Company response to consumer'] + '</td>';
                trHTML += '<td>' + object['Timely response?'] + '</td>';
                trHTML += '<td>' + object['Consumer disputed?'] + '</td>';
                trHTML += '<td>';
                trHTML += '<a type="button" class="btn btn-outline-secondary" onclick="showCompliantEditBox(\'' + object['_id'] + '\')"><i class="fas fa-edit"></i></a>';
                trHTML += '<a type="button" class="btn btn-outline-danger" onclick="compliantDelete(\'' + object['_id'] + '\')"><i class="fas fa-trash"></i></a></td>';
                trHTML += "</tr>";

                num++;
            }
            document.getElementById("mytable").innerHTML = trHTML;

            loadGraph();
        }
    };
}

function loadQueryTable() {
    document.getElementById("mytable").innerHTML = "<tr><th scope=\"row\" colspan=\"5\">Loading...</th></tr>";
    const searchText = document.getElementById('searchTextBox').value;

    const xhttp = new XMLHttpRequest();
    xhttp.open("GET", "http://localhost:3000/Index/issue/" + searchText);

    xhttp.send();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var trHTML = '';
            var num = 1;
            const objects = JSON.parse(this.responseText).Complaint;
            for (let object of objects) {
                trHTML += '<tr>';
                trHTML += '<td>' + num + '</td>';
                trHTML += '<td>' + object['Date received'] + '</td>';
                trHTML += '<td>' + object['Product'] + '</td>';
                trHTML += '<td>' + object['Sub-product'] + '</td>';
                trHTML += '<td>' + object['Issue'] + '</td>';
                trHTML += '<td>' + object['Sub-issue'] + '</td>';
                trHTML += '<td>' + object['Company response to consumer'] + '</td>';
                trHTML += '<td>' + object['Timely response?'] + '</td>';
                trHTML += '<td>' + object['Consumer disputed?'] + '</td>';
                trHTML += '<td>';
                trHTML += '<a type="button" class="btn btn-outline-secondary" onclick="showCompliantEditBox(\'' + object['_id'] + '\')"><i class="fas fa-edit"></i></a>';
                trHTML += '<a type="button" class="btn btn-outline-danger" onclick="compliantDelete(\'' + object['_id'] + '\')"><i class="fas fa-trash"></i></a></td>';
                trHTML += "</tr>";
                num++;


            }
            console.log(trHTML);
            document.getElementById("mytable").innerHTML = trHTML;

        }
    };
}

function loadGraph() {
    var closeEx = 0;
    var inPro = 0;
    var closeOut = 0;
    var untimely = 0;
    var closed = 0;
    var closeMo = 0;
    var closeNonMo = 0;
    var other = 0;

    var Web = 0;
    var Phone = 0;
    var Fax = 0;
    var Postal = 0;
    var Referral = 0;
    var subother = 0;

    const xhttp = new XMLHttpRequest();
    xhttp.open("GET", "http://localhost:3000/Index/");
    xhttp.send();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            const objects = JSON.parse(this.responseText);
            for (let object of objects) {
                switch (object['Company response to consumer']) {
                    case "Closed with explanation":
                        closeEx = closeEx + 1;
                        break;
                    case "In progress":
                        inPro = inPro + 1;
                        break;
                    case "Closed without relief":
                        closeOut = closeOut + 1;
                        break;
                    case "Untimely response":
                        untimely = untimely + 1;
                        break;
                    case "Closed":
                        closed = closed + 1;
                        break;
                    case "Closed with monetary relief":
                        closeMo = closeMo + 1;
                        break;
                    case "Closed with non-monetary relief":
                        closeNonMo = closeNonMo + 1;
                        break;
                    default:
                        other = other + 1;
                        break;
                }

                switch (object['Submitted via']) {
                    case "Web":
                        Web = Web + 1;
                        break;
                    case "Phone":
                        Phone = Phone + 1;
                        break;
                    case "Postal mail":
                        Postal = Postal + 1;
                        break;
                    case "Referral":
                        Referral = Referral + 1;
                        break;
                    case "Fax":
                        Fax = Fax + 1;
                        break;
                    default:
                        subother = subother + 1;
                        break;
                }
            }

            var TimelyResponseData = google.visualization.arrayToDataTable([
                ['Company response to consumer', 'Case'],
                ['In progress', inPro],
                ['Closed', closed],
                ['Closed without relief', closeOut],
                ['Closed with explanation', closeEx],
                ['Closed with monetary relief', closeMo],
                ['Closed with non-monetary relief', closeNonMo],
                ['Untimely response', untimely],
                ['Other', other]
            ]);

            var optionsTimelyResponse = { title: 'Timely Response Stats (Latest  10000 cases)' };
            var chartTimelyResponse = new google.visualization.PieChart(document.getElementById('piechartTimelyResponse'));
            chartTimelyResponse.draw(TimelyResponseData, optionsTimelyResponse);

            var dataSubmitted = google.visualization.arrayToDataTable([
                ['Submitted Via', 'Number', {
                    role: 'style'
                }, {
                    role: 'annotation'
                }],
                ['Web', Web, 'gold', 'Web'],
                ['Phone', Phone, 'color: #F65A83', 'Phone'],
                ['Postal mail', Postal, 'color: #F9F5EB', 'Postal mail'],
                ['Referral', Referral, 'color: #607EAA', 'Referral'],
                ['Fax', Fax, 'color: #E04D01', 'Fax'],
                ['Other', subother, 'color: #1C3879', 'Other']
            ]);

            var optionSubmitted = {
                title: 'Submitted Via Stats (Latest  10000 cases)',
                legend: { position: 'none' }
            };

            var chartSubmitted = new google.visualization.BarChart(document.getElementById('barchartSubmitted'));
            chartSubmitted.draw(dataSubmitted, optionSubmitted);
        }
    };


}

function showCompliantCreateBox() {

    var d = new Date();
    const date = d.toISOString().split('T')[0]

    Swal.fire({
        title: 'Create Compliant',
        html: '<input id="Date_received" class="swal2-input" placeholder="Product" type="hidden" value="' + date + '">' +
            '<div class="mb-3"><label for="Date_received" class="form-label">Date received</label>' +
            '<input class="form-control" id="Date_received" placeholder="Product"></div>' +
            '<div class="mb-3"><label for="Product" class="form-label">Product</label>' +
            '<input class="form-control" id="Product" placeholder="Product"></div>' +
            '<div class="mb-3"><label for="Sub_product" class="form-label">Sub-product</label>' +
            '<input class="form-control" id="Sub_product" placeholder="Sub-product"></div>' +
            '<div class="mb-3"><label for="Issue" class="form-label">Issue</label>' +
            '<input class="form-control" id="Issue" placeholder="Issue"></div>' +
            '<div class="mb-3"><label for="Sub_issue" class="form-label">Sub-issue</label>' +
            '<input class="form-control" id="Sub_issue" placeholder="Sub-issue"></div>' +
            '<div class="mb-3"><label for="Company" class="form-label">Company</label>' +
            '<input class="form-control" id="Company" placeholder="Company"></div>' +
            '<div class="mb-3"><label for="State" class="form-label">State</label>' +
            '<input class="form-control" id="State" placeholder="State"></div>' +
            '<div class="mb-3"><label for="Submitted_via" class="form-label">Submitted via</label>' +
            '<input class="form-control" id="Submitted_via" placeholder="Submitted_via"></div>' +
            '<div class="mb-3"><label for="Date_sent" class="form-label">Date sent to company</label>' +
            '<input class="form-control" id="Date_sent" placeholder="Date sent to company, e.g. 2022-08-09"></div>' +
            '<div class="mb-3"><label for="Timely_response" class="form-label">Timely response?</label>' +
            '<input class="form-control" id="Timely_response" placeholder="Timely response?, e.g. yes, no"></div>' +
            '<div class="mb-3"><label for="Consumer_disputed" class="form-label">Consumer disputed?</label>' +
            '<input class="form-control" id="Consumer_disputed" placeholder="Consumer disputed?"></div>' +
            '<div class="mb-3"><label for="Complaint_ID" class="form-label">Complaint ID</label>' +
            '<input class="form-control" id="Complaint_ID" placeholder="Complaint ID"></div>',
        focusConfirm: false,
        preConfirm: () => {
            compliantCreate();
        }
    });
}

function compliantCreate() {

    const Date_received = document.getElementById("Date_received").value;
    const Product = document.getElementById("Product").value;
    const Sub_product = document.getElementById("Sub_product").value;
    const Issue = document.getElementById("Issue").value;
    const Sub_issue = document.getElementById("Sub_issue").value;
    const Company = document.getElementById("Company").value;
    const State = document.getElementById("State").value;
    const Submitted_via = document.getElementById("Submitted_via").value;
    const Date_sent = document.getElementById("Date_sent").value;
    const Timely_response = document.getElementById("Timely_response").value;
    const Consumer_disputed = document.getElementById("Consumer_disputed").value;
    const Complaint_ID = document.getElementById("Complaint_ID").value;

    console.log(JSON.stringify({
        'Date received': Date_received,
        Product: Product,
        'Sub-product': Sub_product,
        Issue: Issue,
        'Sub-issue': Sub_issue,
        Company: Company,
        State: State,
        'Submitted via': Submitted_via,
        'Date sent to company': Date_sent,
        'Timely response?': Timely_response,
        'Consumer disputed?': Consumer_disputed,
        'Complaint ID': Complaint_ID,
    }));

    const xhttp = new XMLHttpRequest();
    xhttp.open("POST", "http://localhost:3000/Index/create");
    xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhttp.send(JSON.stringify({
        'Date received': Date_received,
        Product: Product,
        'Sub-product': Sub_product,
        Issue: Issue,
        'Sub-issue': Sub_issue,
        Company: Company,
        State: State,
        'Submitted via': Submitted_via,
        'Date sent to company': Date_sent,
        'Timely response?': Timely_response,
        'Consumer disputed?': Consumer_disputed,
        'Complaint ID': Complaint_ID,
    }));
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            const objects = JSON.parse(this.responseText);
            Swal.fire(
                'Good job!',
                'Create Compliant Successfully!',
                'success'
            );
            loadTable();
        }
    };
}

function compliantDelete(id) {
    console.log("Delete: ", id);
    const xhttp = new XMLHttpRequest();
    xhttp.open("DELETE", "http://localhost:3000/Index/delete");
    xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhttp.send(JSON.stringify({
        "_id": id
    }));
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4) {
            const objects = JSON.parse(this.responseText);
            Swal.fire(
                'Good job!',
                'Delete Compliant Successfully!',
                'success'
            );
            loadTable();
        }
    };
}

function showCompliantEditBox(id) {
    console.log("edit", id);
    const xhttp = new XMLHttpRequest();
    xhttp.open("GET", "http://localhost:3000/Index/" + id);
    xhttp.send();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            const object = JSON.parse(this.responseText).object;
            console.log("showCompliantEditBox", object);
            Swal.fire({
                title: 'Edit Compliant',
                html: '<input id="id" class="swal2-input" placeholder="Product" type="hidden" value="' + object['_id'] + '"><br>' +
                    '<div class="mb-3"><label for="Date_received" class="form-label">Date received</label>' +
                    '<input class="form-control" id="Date_received" placeholder="Product" value="' + object['Date received'] + '"></div>' +
                    '<div class="mb-3"><label for="Product" class="form-label">Product</label>' +
                    '<input class="form-control" id="Product" placeholder="Product" value="' + object['Product'] + '"></div>' +
                    '<div class="mb-3"><label for="Sub_product" class="form-label">Sub-product</label>' +
                    '<input class="form-control" id="Sub_product" placeholder="Sub-product" value="' + object['Sub-product'] + '"></div>' +
                    '<div class="mb-3"><label for="Issue" class="form-label">Issue</label>' +
                    '<input class="form-control" id="Issue" placeholder="Issue" value="' + object['Issue'] + '"></div>' +
                    '<div class="mb-3"><label for="Sub_issue" class="form-label">Sub-issue</label>' +
                    '<input class="form-control" id="Sub_issue" placeholder="Sub-issue" value="' + object['Sub-issue'] + '"></div>' +
                    '<div class="mb-3"><label for="Company" class="form-label">Company</label>' +
                    '<input class="form-control" id="Company" placeholder="Company" value="' + object['Company'] + '"></div>' +
                    '<div class="mb-3"><label for="State" class="form-label">State</label>' +
                    '<input class="form-control" id="State" placeholder="State" value="' + object['State'] + '"></div>' +
                    '<div class="mb-3"><label for="Submitted_via" class="form-label">Submitted via</label>' +
                    '<input class="form-control" id="Submitted_via" placeholder="Submitted_via" value="' + object['Submitted via'] + '"></div>' +
                    '<div class="mb-3"><label for="Date_sent" class="form-label">Date sent to company</label>' +
                    '<input class="form-control" id="Date_sent" placeholder="Date sent to company, e.g. 2022-08-09" value="' + object['Date sent to company'] + '"></div>' +
                    '<div class="mb-3"><label for="Timely_response" class="form-label">Timely response?</label>' +
                    '<input class="form-control" id="Timely_response" placeholder="Timely response?, e.g. yes, no" value="' + object['Timely response?'] + '"></div>' +
                    '<div class="mb-3"><label for="Consumer_disputed" class="form-label">Consumer disputed?</label>' +
                    '<input class="form-control" id="Consumer_disputed" placeholder="Consumer disputed?" value="' + object['Consumer disputed?'] + '"></div>' +
                    '<div class="mb-3"><label for="Complaint_ID" class="form-label">Complaint ID</label>' +
                    '<input class="form-control" id="Complaint_ID" placeholder="Complaint ID" value="' + object['Complaint ID'] + '"></div>',
                focusConfirm: false,
                preConfirm: () => {
                    userEdit();
                }
            });
        }
    };
}

function userEdit() {
    const id = document.getElementById("id").value;
    const Date_received = document.getElementById("Date_received").value;
    const Product = document.getElementById("Product").value;
    const Sub_product = document.getElementById("Sub_product").value;
    const Issue = document.getElementById("Issue").value;
    const Sub_issue = document.getElementById("Sub_issue").value;
    const Company = document.getElementById("Company").value;
    const State = document.getElementById("State").value;
    const Submitted_via = document.getElementById("Submitted_via").value;
    const Date_sent = document.getElementById("Date_sent").value;
    const Timely_response = document.getElementById("Timely_response").value;
    const Consumer_disputed = document.getElementById("Consumer_disputed").value;
    const Complaint_ID = document.getElementById("Complaint_ID").value;

    console.log(JSON.stringify({
        "_id": id,
        "Date received": Date_received,
        Product: Product,
        "Sub-product": Sub_product,
        Issue: Issue,
        "Sub-issue": Sub_issue,
        Company: Company,
        State: State,
        "Submitted via": Submitted_via,
        "Date sent to company": Date_sent,
        "Timely response?": Timely_response,
        "Consumer disputed?": Consumer_disputed,
        "Complaint ID": Complaint_ID,
    }));

    const xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "http://localhost:3000/Index/update");
    xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhttp.send(JSON.stringify({
        "_id": id,
        "Date received": Date_received,
        Product: Product,
        "Sub-product": Sub_product,
        Issue: Issue,
        "Sub-issue": Sub_issue,
        Company: Company,
        State: State,
        "Submitted via": Submitted_via,
        "Date sent to company": Date_sent,
        "Timely response?": Timely_response,
        "Consumer disputed?": Consumer_disputed,
        "Complaint ID": Complaint_ID,
    }));
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            const objects = JSON.parse(this.responseText);
            Swal.fire(
                'Good job!',
                'Update Compliant Successfully!',
                'success'
            )
            loadTable();
        }
    };
}