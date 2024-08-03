const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema } = require("../schema.js");
const {isLoggedIn} = require("../middleware.js");

const listingController = require("../controllers/listings.js");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });



const validateListing = (req, res, next) => {
    let {error} = listingSchema.validate(req.body);
      
      if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(404, errMsg);
      } else {
        next();
      }
  };

  router.route("/")
  .get(wrapAsync(listingController.index))
  // .post(isLoggedIn,
  //   validateListing,
  //   wrapAsync(listingController.createListing)
    
    
  // );
  .post(upload.single("listing[image]"), (req, res) => {
    res.send(req.file);
  });
    
  //New Route
  router.get("/new", isLoggedIn, listingController.renderNewForm);

  router.route("/:id")
  .get(wrapAsync(listingController.showListing))
  .put(isLoggedIn,
    validateListing,
     wrapAsync(listingController.updateListing))
     .delete(isLoggedIn, wrapAsync(listingController.destroyListing));




  



  
  //Edit Route
  router.get("/:id/edit", isLoggedIn, wrapAsync(listingController.renderEditForm));
  
  


module.exports = router;
