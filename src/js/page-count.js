export const calcPageCount = count => {
    let pageCount = Math.ceil(count / 10);
    return pageCount;
};
