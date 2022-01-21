import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import { IGeojson } from './Geojson';

export interface GeojsonState {
    data: IGeojson
}

const initialState: GeojsonState = {
    data: {
        type: "FeatureCollection",
        features: []
    },
};

export const geojsonSlice = createSlice({
    name: 'geojson',
    initialState,
    reducers: {
        setGeojson: (state, data) => {
            state.data = data.payload
        }
    }
})

export const { setGeojson } = geojsonSlice.actions
export const selectGeojson = (state: RootState) => state.geojson.data;
export default geojsonSlice.reducer