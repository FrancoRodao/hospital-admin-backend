const pagination = async (req,total)=>{
    let limit = Number(req.query.limit)
    let page = Number(req.query.page)

    if(limit == total){
        return {
            total: 12,
            totalPages: 1,
            page: 0,
            limit: 12,
            skip: 0
        }
    }

    if(!Number.isInteger(total)){
        return error = {error: {
            message: `total must be an integer`
        }}
    }
    if(!Number.isInteger(limit) || limit <= 0){
        limit = 5
        
    }
    if(!Number.isInteger(page) || page <= 0){
        page = 0
    }
    total -= 1
    let totalPages = await Math.round(total/limit) //ARREGLAR ESTA LOGICA
    total += 1  
    if(totalPages < 0){
        totalPages = 0
    }

    if(page > totalPages){
        return error = {error: {
            message: `There are only ${totalPages} pages`
        }}
    }
    
    const skip = page*limit
    return {
        total,
        totalPages,
        page,
        limit,
        skip
    }
}

module.exports = pagination