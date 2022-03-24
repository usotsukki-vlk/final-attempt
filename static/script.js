const tourTax = 32.50;
const breakfastPrice = 150.00;
let original = 0;
if (document.getElementById('input-sheet')) {
    original = document.getElementById('input-sheet').innerHTML;
}


let date = 0

let links = document.querySelectorAll('.link')
links.forEach(link => {
    if (link.children[0].getAttribute('href') == window.location.pathname) {
        link.classList.add('active');
    }
});


function changeDate(el) {
    date = el.input.value;

    generateTable(date);
    //console.log(date);
    resetPage();


}

function resetPage() {
    if (document.getElementById('input-sheet')) {
        document.getElementById('input-sheet').innerHTML = original;
    }

    if (!(document.querySelector('.input-row')))
        document.querySelector('.label-total').innerHTML = 'No Data';
}

var util = {
    qs(sel, ctx) {
        return (ctx || document).querySelector(sel);
    },
    qsa(sel, ctx) {
        return Array.from((ctx || document).querySelectorAll(sel));
    }
};

function getYesterdayDate(date) {
    var a = Date.parse(date) - 24 * 60 * 60 * 1000;
    var b = new Date(a);
    var c = b.toISOString().slice(0, 10)

    return c;
}

var formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
});

class DateCarouselMy {
    constructor(el) {
        this.element = el;
        this.prevButton = util.qs(".date-prev", el);
        this.input = util.qs(".date-current", el);
        this.nextButton = util.qs(".date-next", el);
        this.input.valueAsDate = new Date();
        this.prevButton.addEventListener("click", this.prev.bind(this));
        this.nextButton.addEventListener("click", this.next.bind(this));
        date = document.querySelector('.date-current').value;

        //console.log(date);
        generateTable(date);

    }

    prev() {
        this.input.stepDown();
        changeDate(this);
        date = document.querySelector('.date-current').value;

    }

    next() {
        this.input.stepUp();
        changeDate(this);
        date = document.querySelector('.date-current').value;
    }
}
util.qsa('.date-slider').forEach(function(el) { new DateCarouselMy(el) });






// LOSE FOCUS ON ENTER
let bigInputs = document.querySelectorAll('.input-big');
bigInputs.forEach(input => {
    input.addEventListener('keyup', function(e) {
        if (e.which == 13) this.blur();
    });
});

function changeStatus(room) {
    let row = room.parentNode;
    let status = row.classList.contains('row-active');
    if (!status) {
        row.classList.add('row-active');
    } else {
        row.classList.remove('row-active');
    }
}

function stepper(btn) {

    let myInputs = btn.parentNode.children;
    let myInput = myInputs[1];

    let id = btn.getAttribute("act");
    let min = myInput.getAttribute("min");
    let max = myInput.getAttribute("max");
    let step = myInput.getAttribute("step");
    let val = myInput.getAttribute("value");
    let calcStep = (id == "increment") ? (step * 1) : (step * -1);
    let newValue = parseInt(val) + calcStep;

    if (newValue >= min && newValue <= max) {
        myInput.setAttribute("value", newValue);
    }

}

function updTax(btn) {
    let adults = btn.parentNode.children[1].value;
    btn.parentNode.parentNode.children[5].children[1].setAttribute('value', adults);

}

function updThreeRoomDef(row) {
    while (!row.classList.contains('input-row')) {
        row = row.parentNode;
    }
    let children = row.children;
    let dailyRate = children[3].children[0];
    let adultGuests = parseInt((children[1].children[1].value), 10);
    let chilrenGuests = parseInt((children[2].children[1].value), 10);
    let guestNumber = adultGuests + chilrenGuests;

    if (guestNumber > 3) {
        guestNumber = 3;
    }
    guestCost = guestNumber * 100;
    dailyRate.value = guestCost + 900;
}

function updSuiteRoomDef(row) {
    while (!row.classList.contains('input-row')) {
        row = row.parentNode;
    }
    let children = row.children;
    let dailyRate = children[3].children[0];
    let adultGuests = parseInt((children[1].children[1].value), 10);
    let chilrenGuests = parseInt((children[2].children[1].value), 10);
    let guestNumber = adultGuests + chilrenGuests;

    let guestCost = 0;
    if (guestNumber > 4) {
        guestCost = 1000 * 1;
    } else if (guestNumber > 2) {
        guestCost = 500 * 1
    };

    dailyRate.value = guestCost + 2500 * 1;
}

function total(row) {
    while (!row.classList.contains('input-row')) {
        row = row.parentNode;
    }
    let children = row.children;



    let total = children[6].children[0];
    if (row.classList.contains('row-active')) {


        let dailyRate = children[3].children[0].value * 1;
        let breakfast = children[4].children[1].value * breakfastPrice;
        let tax = children[5].children[1].value * tourTax;
        let sum = dailyRate + breakfast + tax;


        total.innerHTML = sum.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
        total.setAttribute('value', sum);
        let value = total.getAttribute('value');

    } else {
        total.setAttribute('value', 0.00);
        total.innerHTML = 0.00;

    }

}

function grandTotalForDay() {

    let bottomLine = document.getElementById('grand-total');
    if (document.querySelector('.row-active')) {
        let activeRooms = document.querySelectorAll('.row-active');
        let roomTotals = [];
        activeRooms.forEach(room => {
            let total = parseFloat(room.children[6].children[0].getAttribute('value'));
            roomTotals.push(total);
        });
        var sum = roomTotals.reduce(function(a, b) {
            return a + b;
        }, 0);
        bottomLine.setAttribute('value', sum)
        bottomLine.innerHTML = sum.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');


    }
}

function copyTextToClipboard(text) {
    var textArea = document.createElement("textarea");

    //
    // *** This styling is an extra step which is likely not required. ***
    //
    // Why is it here? To ensure:
    // 1. the element is able to have focus and selection.
    // 2. if the element was to flash render it has minimal visual impact.
    // 3. less flakyness with selection and copying which **might** occur if
    //    the textarea element is not visible.
    //
    // The likelihood is the element won't even render, not even a
    // flash, so some of these are just precautions. However in
    // Internet Explorer the element is visible whilst the popup
    // box asking the user for permission for the web page to
    // copy to the clipboard.
    //

    // Place in the top-left corner of screen regardless of scroll position.
    textArea.style.position = 'fixed';
    textArea.style.top = 0;
    textArea.style.left = 0;

    // Ensure it has a small width and height. Setting to 1px / 1em
    // doesn't work as this gives a negative w/h on some browsers.
    textArea.style.width = '2em';
    textArea.style.height = '2em';

    // We don't need padding, reducing the size if it does flash render.
    textArea.style.padding = 0;

    // Clean up any borders.
    textArea.style.border = 'none';
    textArea.style.outline = 'none';
    textArea.style.boxShadow = 'none';

    // Avoid flash of the white box if rendered for any reason.
    textArea.style.background = 'transparent';


    textArea.value = text;

    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
        var successful = document.execCommand('copy');
        var msg = successful ? 'successful' : 'unsuccessful';
        //console.log('Copying text command was ' + msg);
    } catch (err) {
        //console.log('Oops, unable to copy');
    }

    document.body.removeChild(textArea);
}

function copyToClipboard(text) {
    const elem = document.createElement('textarea');
    elem.value = text;
    elem.innerHTML = text;
    document.body.appendChild(elem);
    elem.select();
    document.execCommand('copy');
    document.body.removeChild(elem);
}

function generateTextMessage(input_par) {
    let message = date.split('-')[2] + '.' + date.split('-')[1] + '.' + date.split('-')[0] +
        '\nВиїзд: \nЗаїзд: \nПроживання:';

    if (document.querySelectorAll(input_par)) {

        let bottomLine = 'Сума з добу:'.padEnd(30, ' ') + document.getElementById('grand-total').innerHTML;

        let activeRooms = document.querySelectorAll(input_par);

        let len = activeRooms.length;
        var roomArray = new Array(len)
        for (var i = 0; i < len; i++) {
            roomArray[i] = new Array();
        };
        if (input_par == '.row-active') {
            for (var rowIndex = 0; rowIndex < len; rowIndex++) {
                row = activeRooms[rowIndex];
                let room = row.children[0].innerHTML + '-';
                let adultGuests = row.children[1].children[1].value;
                let childGuests = row.children[2].children[1].value;
                let total = row.children[6].children[0].innerHTML;
                roomArray[rowIndex].push(room, adultGuests, childGuests, total);
            };
        } else if (input_par == '.input-row') {
            //console.log('trigger')
            for (var rowIndex = 0; rowIndex < len; rowIndex++) {
                //console.log(activeRooms)
                row = activeRooms[rowIndex];
                //console.log(row)
                let room = row.children[0].innerHTML + '-';
                //console.log(room)
                let adultGuests = row.children[1].innerHTML;
                let childGuests = row.children[2].innerHTML;
                let total = row.children[3].innerHTML;
                roomArray[rowIndex].push(room, adultGuests, childGuests, total);
            };
        }

        //console.log(roomArray);
        for (var i = 0; i < len; i++) {
            message += '\n'
            for (var j = 0; j < 4; j++) {
                message += roomArray[i][j].padEnd(15, ' ');
            }
        }
        message += '\n' + bottomLine;


    };
    message += '\nБронь:'
    copyTextToClipboard(message);
    document.querySelector('.copy-icon').classList.add('green');
    setTimeout(function() {
        document.querySelector('.copy-icon').classList.remove('green')
    }, 1000);

    //console.log(message);
}

function createJSON(submitBtn) {

    if (document.querySelectorAll('.row-active')) {
        let bottomLine = parseFloat(document.getElementById('grand-total').getAttribute('value'));
        let activeRooms = document.querySelectorAll('.row-active');
        let len = activeRooms.length;
        var jsonArray = new Array()

        for (var rowIndex = 0; rowIndex < len; rowIndex++) {
            row = activeRooms[rowIndex];

            let dayOfMonth = parseInt(date.split('-')[2]);
            let year = parseInt(date.split('-')[0]);
            let month = parseInt(date.split('-')[1]);
            //console.log(dayOfMonth, year, month);

            let room = parseInt(row.children[0].innerHTML, 10);
            let adultGuests = parseInt(row.children[1].children[1].value, 10);
            let childGuests = parseInt(row.children[2].children[1].value, 10);
            let dailyRate = parseFloat(row.children[3].children[0].value)
            let breakfasts = parseInt(row.children[4].children[1].value, 10);
            let tax = parseFloat(row.children[5].children[1].value);
            let total = parseFloat(row.children[6].children[0].getAttribute('value'));
            jsonArray.push({
                'year': year,
                'month': month,
                'date': dayOfMonth,
                'room-id': room,
                'adult-guests': adultGuests,
                'child-guests': childGuests,
                'daily-rate': dailyRate,
                'breakfast': breakfasts,
                'tax': tax,
                'room-total': total,
                'day-total': bottomLine
            });
        };

        let xhr = new XMLHttpRequest();
        xhr.open('POST', '/add-data', true);
        xhr.setRequestHeader("Content-Type", "application/json");
        var data = JSON.stringify({ report: jsonArray });
        xhr.send(data);
        console.log('sent')
    }
}

function autoLogIn() {
    var form = document.createElement("form");
    var element1 = document.createElement("input");
    var element2 = document.createElement("input");
    var element3 = document.createElement("input");
    let dayOfMonth = parseInt(date.split('-')[2]);
    let year = parseInt(date.split('-')[0]);
    let month = parseInt(date.split('-')[1]);

    form.method = "POST";
    form.action = "/";

    element1.value = dayOfMonth;
    element1.name = "day";
    form.appendChild(element1);

    element2.value = year;
    element2.name = "year";
    form.appendChild(element2);

    element3.value = month;
    element3.name = "month";
    form.appendChild(element3);

    document.body.appendChild(form);

    form.submit();
}

function green(el) {
    el.classList.add('greener')
    setTimeout(function() {
        el.classList.remove('greener')
    }, 1500)
}



function generateTable(date) {

    if (!document.querySelector('.testing')) { return };
    if (!document.querySelector('.input-sheet')) { return };

    let table = document.querySelector('.input-sheet');
    let stringArray = document.querySelector('.testing').getAttribute('value');

    if (!JSON.parse(stringArray.replace(/'/g, '"'))) { return };

    array = JSON.parse(stringArray.replace(/'/g, '"'));

    if (document.querySelectorAll('.input-row')) {
        var toDel = document.querySelectorAll('.input-row');
        toDel.forEach(element => {
            element.remove();
        });
    }

    let month = parseInt(date.split('-')[1]);
    let day = parseInt(date.split('-')[2]);
    let year = parseInt(date.split('-')[0]);
    let grandTotalForDay = document.getElementById('grand-total');


    array.forEach(dataRow => {


        if (dataRow.day != day || dataRow.month != month || dataRow.year != year) {

            return;
        }
        let row = document.createElement('div');

        let room = document.createElement('div');
        let adults = document.createElement('div');
        let children = document.createElement('div');
        let roomRate = document.createElement('div');

        row.classList.add('input-row');

        room.classList.add('label');
        adults.classList.add('label');
        children.classList.add('label');
        roomRate.classList.add('label');

        room.innerHTML = dataRow.room;
        adults.innerHTML = dataRow.adults;
        children.innerHTML = dataRow.children;
        roomRate.innerHTML = dataRow.room_total.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
        row.appendChild(room);
        row.appendChild(adults);
        row.appendChild(children);
        row.appendChild(roomRate);

        table.appendChild(row);

        grandTotalForDay.innerHTML = dataRow.day_total.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');

    });

};

function fillFormAsBefore() {

    if (!document.querySelector('.list-re')) { return };
    let stringArray = document.querySelector('.list-re').getAttribute('value');
    dateYesterday = getYesterdayDate(date);


    if (!JSON.parse(stringArray.replace(/'/g, '"'))) { return };
    array = JSON.parse(stringArray.replace(/'/g, '"'));

    inputRows = document.querySelectorAll('.input-row')

    let month = parseInt(dateYesterday.split('-')[1]);
    let day = parseInt(dateYesterday.split('-')[2]);
    let year = parseInt(dateYesterday.split('-')[0]);

    let yesterday = []

    let i = 0;

    array.forEach(dataRow => {
        if (dataRow.day != day || dataRow.month != month || dataRow.year != year) {
            return;
        }
        yesterday.push([dataRow.room, dataRow.adults, dataRow.children, dataRow.daily_rate, dataRow.breakfast, dataRow.tax, dataRow.room_total]);



    });
    inputRows.forEach(row => {
        yesterday.forEach(yesRow => {
            if (row.children[0].innerHTML == yesRow[0]) {

                row.children[1].children[1].setAttribute('value', yesRow[1]);
                row.children[2].children[1].setAttribute('value', yesRow[2]);
                row.children[3].children[0].setAttribute('value', yesRow[3]);
                row.children[4].children[1].setAttribute('value', yesRow[4]);
                row.children[5].children[1].setAttribute('value', yesRow[5]);
                row.children[6].children[0].setAttribute('value', yesRow[6]);
                row.children[6].children[0].innerHTML = yesRow[6].toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
                row.classList.add('row-active');
            }

        });
    });
    //console.log(date, dateYesterday)
};