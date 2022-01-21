import { initializeApp } from 'firebase/app'
import { doc, Firestore, getDoc, getFirestore } from 'firebase/firestore'
import { useEffect, useRef } from 'react'
import { useDispatch } from 'react-redux'
import { isIdDuplicated } from '../test/Test'
import { IGeojson } from './Geojson'
import { setGeojson } from './geojsonSlice'

const firebaseApp = initializeApp({
    apiKey: process.env.REACT_APP_APIKEY,
    authDomain: process.env.REACT_APP_AUTHDOMAIN,
    projectId: process.env.REACT_APP_PROJECTID,
    storageBucket: process.env.REACT_APP_STORAGEBUCKET,
    messagingSenderId: process.env.REACT_APP_MESSAGINGSENDERID,
    appId: process.env.REACT_APP_APPID,
    measurementId: process.env.REACT_APP_MEASUREMENTID,
})

class DB {
    private static instance: DB

    private _db: Firestore
    private constructor() {
        this._db = getFirestore()
    }
    public static getInstance() {
        if (!DB.instance) {
            DB.instance = new DB()
        }

        return DB.instance
    }

    public getData = async (): Promise<IGeojson> => {
        try {
            const docRef = doc(this._db, "METAWORLD", 'geojson')
            let docSnap = await getDoc(docRef)

            let data: IGeojson
            if (docSnap.exists()) {
                data = docSnap.data() as IGeojson
                return data
            }
            else {
                throw ("NO DATA FOUND")
            }
        } catch (e) {
            console.error(`[from getData]\n>>> `, e)
            return { type: "", features: [] }
        }
    }
    public uploadData = async (data: IGeojson) => {
        if (this._testIfErrorExists(data)) return

    }
    /**
     * 데이터 무결성을 업로드 전에 테스트하여  
     * 에러가 있으면 에러 메세지, 없으면 그냥 리턴한다
     */
    private _testIfErrorExists = (data: IGeojson) => {
        try {
            const testList: ((arg0: IGeojson) => string | undefined)[] = [isIdDuplicated]
            for (let test of testList) {
                const err = test(data)
                if (err) throw err
            }
            return
        } catch (e) {
            console.error(`[Test Failed]\n>>> `, e)
            return e
        }
    }
}

const DBConsole = () => {
    const dispatch = useDispatch()
    const getDataRef: React.RefObject<HTMLButtonElement> = useRef<HTMLButtonElement>(null)

    useEffect(() => {
        if (getDataRef.current) {
            getDataRef.current.addEventListener('click', async () => {
                const data: IGeojson = await DB.getInstance().getData()
                if (data?.features.length) {
                    dispatch(setGeojson(data))
                }
            })
        }
    }, [])

    return (
        <>
            <button ref={getDataRef}>Click to get data</button>
        </>
    )
}

export { DBConsole }