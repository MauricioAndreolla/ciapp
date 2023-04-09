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

module.exports={
    unformatCurrency,
    formatCurrency
    
}