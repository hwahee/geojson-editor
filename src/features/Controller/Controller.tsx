import { useEffect, useState } from "react"
import { useAppDispatch, useAppSelector } from "../../app/hooks"
import {
    decrement,
    incrementMax,
    selectCount,
    setByAmount,
} from '../counter/counterSlice';
import styles from '../counter/Counter.module.css';
import { reverseGeocoding } from "./reverseGeocoding"
import { selectGeojson, setGeojson } from "../geojson/geojsonSlice";
import { LngLatLike } from "mapbox-gl";

const Controller = () => {
    const count = useAppSelector(selectCount)
    const [localCount, setLocalCount] = useState(count.toString())
    const geojson = useAppSelector(selectGeojson)
    const dispatch = useAppDispatch()

    useEffect(()=>{setLocalCount(i=>count.toString())},[count])

    return (
        <>
            <div className={styles.row}>
                <button
                    className={styles.button}
                    aria-label="Decrement value"
                    onClick={() => dispatch(decrement())}
                >
                    -
                </button>
                <form onSubmit={(e) => {
                    e.preventDefault()
                    dispatch(setByAmount({ target: parseInt(localCount), min: 0, max: geojson.features.length }))
                }} >
                    <input
                        className={styles.textbox}
                        aria-label="Set increment amount"
                        value={localCount}
                        onChange={(e) => setLocalCount(i => e.target.value)}
                    />
                </form>
                <button
                    className={styles.button}
                    aria-label="Increment value"
                    onClick={() => dispatch(incrementMax(geojson.features.length ?? 0))}
                >
                    +
                </button>
            </div>
            <div>
                <button
                    className={styles.button}
                    aria-label="Increment value"
                    onClick={async () => {
                        //  ????????? reverse geocoding??? ???????????? ??????????????? ????????????  
                        //  ????????? geojson.feature??? ???????????? ????????? ???????????? ?????????  
                        //  geojson??? features??? ?????? count??? ???????????? ???????????? ??????????????? ?????? ??????  
                        //  ????????? 
                        const lnglat: LngLatLike = geojson?.features[count]?.geometry.coordinates ?? [null, null]
                        reverseGeocoding(lnglat).then((res_address) => {
                            const res_geojson_feature = { ...geojson.features[count], properties: { ...geojson.features[count].properties, address: res_address } }
                            dispatch(setGeojson({ ...geojson, features: geojson.features.slice(0, count).concat(res_geojson_feature).concat(geojson.features.slice(count + 1)) }))
                        })
                    }}
                >
                    Reverse Geocoding
                </button>
            </div>
        </>
    )
}

export { Controller }