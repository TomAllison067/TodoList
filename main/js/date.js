const getToday = () => {
    let date = new Date();
    let options = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    }

    let today = date.toLocaleDateString("en-UK", options)
    return today;
}

module.exports = {
    getToday
}