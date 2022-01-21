import _ from "lodash"
import mapboxgl, { LngLat, LngLatLike } from "mapbox-gl"
import { useEffect, useRef, useState } from "react"
import { useSelector } from "react-redux"
import { useAppSelector } from "../../app/hooks"
import { RootState } from "../../app/store"
import { selectCount } from "../counter/counterSlice"
import { IGeojson, IGeojsonFeature } from "../geojson/Geojson"
import { selectGeojson } from "../geojson/geojsonSlice"
import 'mapbox-gl/dist/mapbox-gl.css'

const Textbar = (props: { value: string | number, readOnly?: boolean }) => {
    const [val, setVal] = useState(props.value)
    const state = useAppSelector(selectGeojson)

    useEffect(() => {
        setVal(i => props.value)
    }, [state])

    return (
        <input type={"text"} value={val} onChange={(e) => { setVal(() => e.target.value) }} readOnly={props.readOnly} />
    )
}
const GUIMap = (props: { coordinates: LngLatLike }) => {
    useEffect(() => {
        mapboxgl.accessToken = process.env.REACT_APP_MAPBOXGL_ACCESS_TOKEN?.slice(1, process.env.REACT_APP_MAPBOXGL_ACCESS_TOKEN.length - 2) ?? "";
        const map = new mapboxgl.Map({
            container: 'map', // container ID
            style: 'mapbox://styles/mapbox/streets-v11', // style URL
            center: props.coordinates, // starting position [lng, lat]
            zoom: 14 // starting zoom
        });

        const marker = new mapboxgl.Marker()
            .setLngLat(map.getCenter())
            .addTo(map);

        return () => {
            map.remove()
        }
    }, [])
    return (
        <div id="map" style={{ position: "absolute", width:"480px", minWidth: "240px", minHeight: "120px", maxWidth: "480px", maxHeight: "240px" }}></div>
    )
}


const GUIFeature = (props: IGeojsonFeature) => {
    return (
        <>
            <tr>
                <th>type: </th>
                <td>
                    <Textbar value={props.type} readOnly />
                </td>
            </tr><tr>
                <th>geometry: </th>
                <td>
                    {Object.entries(props.geometry).map(j => (<li>
                        {j[0]}: <input type={"text"} value={j[1]} onChange={() => { }} />
                    </li>))}
                </td>
            </tr>
            <tr>
                <th>properties: </th>
                <td>
                    {Object.entries(props.properties).map(j => (<li>
                        {j[0]}: <Textbar value={j[1]} />
                    </li>))}
                </td>
            </tr>
            <tr>
                <th>image: </th>
                <td><img src={props.properties.imageUrl ?? "#"} alt={props.properties.imageUrl ?? "no image"} style={{ maxWidth: "480px", maxHeight: "360px" }} /></td>
            </tr>
            <tr>
                <th>map: </th>
                <td><GUIMap coordinates={props.geometry.coordinates} /></td>
            </tr>
        </>
    )
}

const GUI = () => {
    const pageIdx = useAppSelector(selectCount)
    const data: IGeojson = useSelector((state: RootState) => state.geojson).data

    const getGeojsonFeatureList = (idx: number) => {
        if (idx < 0) return <></>
        if (!data.features?.length) return <></>
        const target = data.features[idx % data.features.length]
        return <GUIFeature key={target.properties.id ?? _.uniqueId()} type={target.type} geometry={target.geometry} properties={target.properties} />
    }

    return (
        <>
            <table>
                <thead></thead>
                <tbody>
                    {getGeojsonFeatureList(pageIdx)}
                </tbody>
            </table>
        </>
    )
}

export { GUI }