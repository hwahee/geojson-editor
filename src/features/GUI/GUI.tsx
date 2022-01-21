import _ from "lodash"
import mapboxgl, { LngLat, LngLatLike } from "mapbox-gl"
import React, { useEffect, useRef, useState } from "react"
import { useSelector } from "react-redux"
import { useAppSelector } from "../../app/hooks"
import { RootState } from "../../app/store"
import { selectCount } from "../counter/counterSlice"
import { IGeojson, IGeojsonFeature, IGeometry } from "../geojson/Geojson"
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

const GUICoordinate = React.forwardRef((props: { value: string | number, readOnly?: boolean }, ref: any) => {
    const [val, setVal] = useState(props.value)
    const state = useAppSelector(selectGeojson)

    useEffect(() => {
        setVal(i => props.value)
    }, [state, props.value])

    return (
        <>
            <input ref={ref} type={"text"} value={val} onChange={(e) => { setVal(() => e.target.value) }} readOnly={props.readOnly} />
        </>
    )
})
const GUIMap = React.forwardRef((props: { coordinates: LngLatLike }, ref: any) => {
    const map = ref

    useEffect(() => {
        if (map?.current) return

        mapboxgl.accessToken = process.env.REACT_APP_MAPBOXGL_ACCESS_TOKEN ?? "";
        map.current = new mapboxgl.Map({
            container: 'map', // container ID
            style: 'mapbox://styles/mapbox/streets-v11', // style URL
            center: props.coordinates, // starting position [lng, lat]
            zoom: 14 // starting zoom
        });

        return () => {
            map.current.remove()
        }
    }, [])
    return (
        <div id="map" style={{ width: "480px", minWidth: "240px", minHeight: "120px", maxWidth: "480px", maxHeight: "240px" }}></div>
    )
})
const GUIGeometry = (props: IGeometry) => {
    const [marker, setMarker] = useState(new mapboxgl.Marker())
    const [coor, setCoor] = useState(props.coordinates)
    const fitToCoorRef = useRef<HTMLButtonElement>(null)
    const fitToMapRef = useRef<HTMLButtonElement>(null)

    const coordinateRef = useRef<HTMLInputElement>(null)
    const mapRef = useRef<mapboxgl.Map>(null)

    useEffect(() => {
        marker.setLngLat(mapRef.current?.getCenter() ?? props.coordinates).addTo(mapRef.current!)
    }, [])

    useEffect(() => {
        fitToCoorRef.current?.addEventListener('click', () => {
            mapRef.current?.flyTo({ center: strToLngLatLike(coordinateRef.current?.value) })
        })
        fitToMapRef.current?.addEventListener('click', () => {
            setCoor(i => mapRef.current?.getCenter() ?? props.coordinates)
            marker.remove()
            marker.setLngLat(mapRef.current?.getCenter() ?? props.coordinates).addTo(mapRef.current!)
        })
    }, [])

    function LngLatLikeToString(ll: LngLatLike): string {
        if (Array.isArray(ll))
            return ll.toString()
        else
            return `${(ll as LngLat).lng},${(ll as LngLat).lat}`
    }
    function strToLngLatLike(str: string = "NaN,NaN"): [number, number] {
        const [lng, lat] = str.split(',').map(i => Number(i)).slice(0, 2)
        return [lng, lat]
    }

    return (
        <>
            <button ref={fitToCoorRef} onClick={() => { }}>좌표로 지도 중심 이동</button>
            <button ref={fitToMapRef} onClick={() => { }}>지도 중심으로 좌표 설정</button>
            <GUICoordinate ref={coordinateRef} value={LngLatLikeToString(coor)} />
            <GUIMap ref={mapRef} coordinates={coor} />
        </>
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
                    <GUIGeometry coordinates={props.geometry.coordinates} type={props.geometry.type} />
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
        return <GUIFeature key={target.properties.id ?? ""} type={target.type} geometry={target.geometry} properties={target.properties} />
    }

    return (
        <>
            <form onSubmit={(e) => { e.preventDefault(); console.log("submitx") }}>
                <table>
                    <thead></thead>
                    <tbody>
                        {getGeojsonFeatureList(pageIdx)}
                    </tbody>
                </table>
                <input type={"submit"} />
            </form>
        </>
    )
}

export { GUI }