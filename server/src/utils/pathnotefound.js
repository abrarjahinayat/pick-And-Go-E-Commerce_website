const pathNotFoundMiddleware = (req,res,next)=>{
    res.status(404).json({
        message:"page not found"
    })
}

module.exports = pathNotFoundMiddleware