import _ from 'lodash'

interface IGeojson {
    type: string,
    features: NEW.IGeojsonFeature[]
}
namespace OLD {
    interface IGeometry {
        address?: string,
        type: string,
        coordinates: [number, number]
    }
    interface IProperties {
        address?: string,
        title: string,
        description: string,
        markerType: string,
        gallery?: string,
        imageUrl?: string,
        highlight?: boolean,
    }
    export interface IGeojsonFeature {
        id?: number,
        type: string,
        geometry: IGeometry,
        properties: IProperties
    }
}

/**네이버 지도의 마커 geojson에 기반 */
namespace NEW {
    interface IGeometry {
        type: string,
        coordinates: [number, number]
    }
    interface IProperties {
        id?: string,
        mid?: number,
        name_dp: string,
        name_full?: string,
        address?: string
        type?: string,
        description?: string,
        markerType?: string,
        gallery?: string,
        imageUrl?: string,
        highlight?: boolean
    }

    export interface IGeojsonFeature {
        type: string,
        geometry: IGeometry,
        properties: IProperties
    }
}
const geojsonFeatureOldToNew = (target: OLD.IGeojsonFeature): NEW.IGeojsonFeature => {
    return {
        type: target.type,
        geometry: {
            type: target.geometry.type,
            coordinates: target.geometry.coordinates
        },
        properties: {
            id: _.uniqueId(),
            address: target.geometry.address ?? target.properties.address ?? undefined,
            name_dp: target.properties.title,
            description: target.properties.description || "",
            markerType: target.properties.markerType || "marker-default",
            gallery: target.properties.gallery ?? undefined,
            imageUrl: target.properties.imageUrl ?? undefined,
            highlight: target.properties.highlight ?? undefined
        }
    }
}

interface IGeojsonFeature extends NEW.IGeojsonFeature { }
export type { IGeojson, IGeojsonFeature }