const Location = require('../models/location')
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding")
const mapBoxToken = process.env.MAPBOX_TOKEN
const geocoder = mbxGeocoding({ accessToken: mapBoxToken })
const { cloudinary } = require("../cloudinary")

module.exports.index = async (req, res) => {
    // const locations = await Location.find({})
    const locations = await Location.find({}).populate('popupText')
    res.render('locations/index', { locations })
}

module.exports.renderNewForm = (req, res) => {
    res.render('locations/new')
}

module.exports.createLocation = async (req, res, next) => {
    const geoData = await geocoder.forwardGeocode({
        query: req.body.location.address,
        limit: 1
    }).send()

    const location = new Location(req.body.location)

    location.geometry = geoData.body.features[0].geometry

    // if (location.images.length === 0) {
    //     location.images.push({
    //         url: 'https://res.cloudinary.com/djb8ahbbl/image/upload/v1681089744/VBook/no-image_gz4q4g.png', filename: 'no-image_gz4q4g'
    //     })
    // }

    location.images = req.files.map(f => ({ url: f.path, filename: f.filename }))

    if (req.files && req.files.length === 0) {
        location.images.push({
            url: 'https://res.cloudinary.com/djb8ahbbl/image/upload/v1682819516/VBook/360_F_109403481_g8LbMgibBxrnl7CBc201wcJsNihOWTF2_lkcxhy.jpg', filename: 'no-image_gz4q4g'
        })
    }

    location.author = req.user._id

    location.postDate = Date.now()

    await location.save()

    req.flash('success', 'Successfully made a new Location!')
    res.redirect(`/locations/${location._id}`)
}

module.exports.showLocation = async (req, res) => {
    const location = await Location.findById(req.params.id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }

    }).populate('author')
    if (!location) {
        req.flash('error', 'Cannot find that location')
        res.redirect('/locations')
    }

    if (req.files && req.files.length === 0) {
        location.images.push({
            url: 'https://res.cloudinary.com/djb8ahbbl/image/upload/v1681089744/VBook/no-image_gz4q4g.png', filename: 'no-image_gz4q4g'
        })
    }

    res.render('locations/show', { location })
}

module.exports.renderEditForm = async (req, res) => {
    const location = await Location.findById(req.params.id)
    if (!location) {
        req.flash('error', 'Cannot find that location')
        res.redirect('/locations')
    }
    res.render('locations/edit', { location })
}

module.exports.updateLocation = async (req, res) => {
    const { id } = req.params

    const location = await Location.findByIdAndUpdate(id, { ...req.body.location })
    // const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }))
    // location.images.push(...imgs)
    await location.save()
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename)
        }
        await location.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } })
    }

    req.flash('success', 'Successfully Updated Location')
    res.redirect(`/locations/${location._id}`)
}

module.exports.deleteLocation = async (req, res) => {
    const { id } = req.params
    await Location.findByIdAndDelete(id)
    req.flash('success', 'Successfully deleted location')
    res.redirect('/locations')
}