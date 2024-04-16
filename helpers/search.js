module.exports = (query) => {
    let objectSearch = {
        keyword: "",
    }
    if(query.keyword){
        objectSearch.keyword = query.keyword;
        const regex = new RegExp(keyword, "i");// thêm chữ i để hiểu là tìm kiếm không phân biệt chữ hoa chữ thường
        objectSearch.regex = regex;//dùng regex để khi chỉ nhập vài chữ cũng có thể tìm ra sản phẩm muốn tìm
    }
    return objectSearch;
}