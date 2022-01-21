import mapboxgl, { LngLatLike } from "mapbox-gl"
import axios from "axios"

mapboxgl.accessToken = process.env.REACT_APP_MAPBOXGL_ACCESS_TOKEN ?? ""

const reverseGeocoding = async (lngLat: LngLatLike) => {
    const res = await axios.get(`https://api.mapbox.com/geocoding/v5/mapbox.places/${lngLat.toString()}.json?access_token=${mapboxgl.accessToken}`)
    return (res.data.features[1].place_name as string)
}
export { reverseGeocoding }