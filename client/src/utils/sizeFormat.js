export default (size) => {
    if (size > 1024*1024*1024) {
        return (size/(1024*1024*1024)).toFixed(1)+"ГБ"
    } else if (size > 1024*1024) {
        return (size/(1024*1024)).toFixed(1)+"МБ"
    } else if (size > 1024) {
        return (size/(1024)).toFixed(1)+"КБ"
    }

    return size+"Б"
};