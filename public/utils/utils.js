function unformatCurrency(value) {
    let unformattedValue = value.toString().replace(/\D/g, '');
    unformattedValue = unformattedValue.replace(',', '.');
    return parseFloat(unformattedValue);
}

function formatCurrency(inputValue) {
    inputValue = (inputValue / 100).toLocaleString('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
    return inputValue;
}

function diff_hours(dt2, dt1) {

    var diff = (dt2.getTime() - dt1.getTime()) / 1000;
    diff /= (60 * 60);
    return Math.abs(Math.round(diff));

}


module.exports={
    unformatCurrency,
    formatCurrency,
    diff_hours,
    
}