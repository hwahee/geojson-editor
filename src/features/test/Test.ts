import { IGeojson } from "../geojson/Geojson"

const isIdDuplicated = (geojson: IGeojson) => {
    const idArray: string[] = geojson.features.map(i => i.properties.id ?? "")
    if ((new Set(idArray)).size !== idArray.length)
        return `Duplicated Id Error`
    else 
        return
}

export { isIdDuplicated }