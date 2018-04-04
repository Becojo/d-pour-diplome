// on croise les doigts ces cossins la change pas trop
var divNoteMinimale = document.querySelector('#ctl00_ContentPlaceHolderMain_lesOnglets_tmpl0_divNoteMinimale');

function calculate() {
    var lines = document.querySelectorAll('#ctl00_ContentPlaceHolderMain_lesOnglets_tmpl0_panneauAvecNotes table .ig_Office2010BlueItem.igg_Office2010BlueItem tr');
    var evals = [];
    var remainingWork = [];

    for(var i = 0; i < lines.length; i++) {
        var evalName = lines[i].querySelector('td').innerText;
        var weight = lines[i].querySelector('td:nth-child(6)').innerText;
        var grade = lines[i].querySelector('td:nth-child(4)').innerText;
        var gradedOn = lines[i].querySelector('td:nth-child(5)').innerText;

        if(evalName.indexOf('*') !== -1) {
            grade = grade.replace(/\s*/, '');

            var done = grade.length > 0;

            weight = parseFloat(weight.split(' ')[0].replace(',', '.'));
            grade = parseFloat(grade.replace(',', '.'));
            gradedOn = parseFloat(gradedOn.replace(',', '.'));

            evals.push({ name: evalName, weight: weight, grade: grade / gradedOn, done: done });

            if(!done) {
                remainingWork.push(evalName.replace('*', '').replace(/\s+$/, ''));
            }
        }
    }

    // un peu d'algèbre...
    var weightRemaining = 0;
    var weightDone = 0;

    for(var i = 0; i < evals.length; i++) {
        if(evals[i].done) {
            weightDone += evals[i].weight;
        } else {
            weightRemaining += evals[i].weight;
        }
    }

    var totalWeight = weightDone + weightRemaining;
    var needed = 0.5 * totalWeight;

    for(var i = 0; i < evals.length; i++) {
        if(evals[i].done) {
            needed -= evals[i].weight * evals[i].grade;
        }
    }

    needed /= weightRemaining;

    document.querySelector('#etsMCTwoRight').innerHTML += `
<div style="background-color: #fff6b7; border: 1px solid #ffe007; padding: 10px; margin-top: 10px;">
<h3>Plugin D pour diplôme</h3>
<div>Afin de respecter la condition qui demande d'avoir au moins 50 % aux évaluations individuelles, vous devez obtenir une moyenne d'au moins ${(needed * 100).toFixed(3)} % dans les évaluations suivantes: ${remainingWork.join(',')}</div>
</div>
`;
}

if(divNoteMinimale) {
    calculate();
}
