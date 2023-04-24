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

function secondsToHHMM(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  }

function diff_hours(startDate, endDate) {

    const diffTime = Math.abs(startDate - endDate);
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffTime / (1000 * 60)) % 60);
    
    const diffFormatted = `${diffHours.toString().padStart(2, '0')}:${diffMinutes.toString().padStart(2, '0')}`;

    return diffFormatted;

}

function diff_seconds(dt2, dt1) {

    var diff = (dt2.getTime() - dt1.getTime()) / 1000;
    return  Math.abs(diff);

}


module.exports={
    unformatCurrency,
    formatCurrency,
    diff_hours,
    diff_seconds,
    secondsToHHMM,
    
}