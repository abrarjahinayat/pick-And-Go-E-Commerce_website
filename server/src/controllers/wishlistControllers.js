const wishlistModel = require("../model/wishlist.model");

const addtowishlistControllers = async (req, res) => {
 try {

    let { user, product } = req.body;

    let wishlist = await wishlistModel({ user, product });
    wishlist.save();
    return res.status(200).json({ success: true, message: "Product added to wishlist" , data: wishlist});
    
 } catch (error) {
    return res.status(500).json({ success: false, message: "Server Error", error: error.message || error});
 }
}

const getwishlistControllers = async (req, res) => {
    try {
        let { id } = req.params;

        let getwishlist = await wishlistModel.find({ user: id }).populate({path: 'product', select: 'title price slug stock image _id'});
        return res.status(200).json({ success: true, message: "Product get to wishlist" , data: getwishlist});
        // let wishlist = wishlistModel.find({ user: id }).populate({path: 'product', select: 'name price images _id'});
        // return res.status(200).json({ success: true, message: "Product added to wishlist" , data: wishlist});
        
     } catch (error) {
        return res.status(500).json({ success: false, message: "Server Error", error: error.message || error});
     }
};

const deletewishlistControllers = async (req, res) => {
    try {
        let { id } = req.params;
        let deletewishlist = await wishlistModel.deleteMany({ user: id });
        return res.status(200).json({ success: true, message: "Product deleted to wishlist" , data: deletewishlist});
        
     } catch (error) {
        return res.status(500).json({ success: false, message: "Server Error", error: error.message || error});
     }
};

const removewishlistControllers = async (req, res) => {
    try {
        let { id } = req.params;
        let removewishlist = await wishlistModel.findByIdAndDelete(id);
        return res.status(200).json({ success: true, message: "Product deleted to wishlist" , data: removewishlist});
        
     } catch (error) {
        return res.status(500).json({ success: false, message: "Server Error", error: error.message || error});
     }
};

const getsinglewishlistControllers = async (req, res) => {
    try {
        let { id } = req.params;
        let getsinglewishlist = await wishlistModel.find( {user: id});
        return res.status(200).json({ success: true, message: "Single wishlist product get successfully" , data: getsinglewishlist});
        
     } catch (error) {
        return res.status(500).json({ success: false, message: "Server Error", error: error.message || error});
     }
}

module.exports = {
  addtowishlistControllers,
    getwishlistControllers,
    deletewishlistControllers,
    removewishlistControllers,
    getsinglewishlistControllers

};