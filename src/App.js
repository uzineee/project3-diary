import React, { useReducer, useRef, useEffect, useState } from "react";
import { Routes, Route} from "react-router-dom";
import "./App.css";
import Home from "./pages/Home";
import New from "./pages/New";
import Diary from "./pages/Diary";
import Edit from "./pages/Edit";
import { firebaseDB } from './firebaseConfig';
import { collection, addDoc, updateDoc, deleteDoc, getDocs, doc } from "firebase/firestore";

function reducer(state, action) {
    switch (action.type) {
        case "INIT": {
            return action.data;
        }
        case "CREATE": {
            return [action.data, ...state];

            // localStorage
            /*const newState = [action.data, ...state];
            localStorage.setItem("diary", JSON.stringify(newState));
            return newState;*/
        }
        case "UPDATE": {
            return state.map((it) =>
                String(it.id) === String(action.data.id) ? { ...action.data } : it
            );

            // localStorage
            /*const newState = state.map((it) =>
                String(it.id) === String(action.data.id) ? {...action.data} : it
            );
            localStorage.setItem("diary", JSON.stringify(newState));
            return newState;*/
        }
        case "DELETE": {
            return state.filter((it) => String(it.id) !== String(action.targetId));

            // localStorage
            /*const newState = state.filter(
                (it) => String(it.id) !== String(action.targetId)
            );
            localStorage.setItem("diary", JSON.stringify(newState));
            return newState;*/
        }
        default: {
            return state;
        }
    }
}

export const DiaryStateContext = React.createContext();
export const DiaryDispatchContext = React.createContext();

function App() {
    const [isDataLoaded, setIsDataLoaded] = useState(false);
    const [data, dispatch] = useReducer(reducer, []);
   // const idRef = useRef(0);
    const MAX_FILE_SIZE = 1024 * 1024; // 1MB로 설정 (원하는 크기로 조정)

// localStorage
/*    useEffect(() => {
        const rawData = localStorage.getItem("diary");
        if (!rawData){
            setIsDataLoaded(true);
            return;
        }
        const localData = JSON.parse(rawData);
        if(localData.length === 0) {
            setIsDataLoaded(true);
            return;
        }
        localData.sort((a,b) => Number(b.id) - Number(a.id));
        idRef.current = localData[0].id + 1;
        dispatch({ type: "INIT", data: localData });
        setIsDataLoaded(true);
    }, []);*/

    useEffect(() => {
        const fetchData = async () => {
            try {
                const querySnapshot = await getDocs(collection(firebaseDB, "emotionDiary"));
                const firestoreData = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data()
                }));
                firestoreData.sort((a, b) => Number(b.id) - Number(a.id));
                dispatch({ type: "INIT", data: firestoreData });
                setIsDataLoaded(true);
            } catch (error) {
                console.error("Error fetching data from Firestore: ", error);
            }
        };
        fetchData();
    }, []);




    const onCreate = async (date, content, emotionId, attachment) => {
        // localStorage
        /*dispatch({
            type: "CREATE",
            data: {
                id: idRef.current,
                date: new Date(date).getTime(),
                content,
                emotionId,
                attachment,
            },
        });
        idRef.current += 1;*/


        const newDiary = {
            date: new Date(date).getTime(),
            content,
            emotionId,
            attachment,
        };

        try {
            const docRef = await addDoc(collection(firebaseDB, "emotionDiary"), newDiary);
            dispatch({ type: "CREATE", data: { id: docRef.id, ...newDiary } });
        } catch (error) {
            console.error("Error adding document: ", error);
        }
    };

    const onUpdate = async(targetId, date, content, emotionId, attachment) => {

        // localStorage
        /*dispatch({
            type: "UPDATE",
            data: {
                id: targetId,
                date: new Date(date).getTime(),
                content,
                emotionId,
                attachment,
            },
        });*/

        const updatedDiary = {
            date: new Date(date).getTime(),
            content,
            emotionId,
            attachment,
        };

        try {
            const diaryRef = doc(firebaseDB, "emotionDiary", targetId);
            await updateDoc(diaryRef, updatedDiary);
            // 상태 업데이트
            dispatch({ type: "UPDATE", data: { id: targetId, ...updatedDiary } });
        } catch (error) {
            console.error("Error updating document: ", error);
        }
    };

    const onDelete = async(targetId) => {

        // localStorage
        /*dispatch({
            type: "DELETE",
            targetId,
        });*/

        try {
            const diaryRef = doc(firebaseDB, "emotionDiary", targetId);
            await deleteDoc(diaryRef);
            dispatch({ type: "DELETE", targetId });
        } catch (error) {
            console.error("Error deleting document: ", error);
        }
    };

    if (!isDataLoaded) {
        return <div>데이터를 불러오는 중입니다</div>;
    } else {
        return (
            <DiaryStateContext.Provider value={data}>
                <DiaryDispatchContext.Provider
                    value={{
                        onCreate,
                        onUpdate,
                        onDelete,
                    }}
                >
                    <div className="App">
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/new" element={<New />} />
                            <Route path="/diary/:id" element={<Diary />} />
                            <Route path="/edit/:id" element={<Edit />} />
                        </Routes>
                    </div>
                </DiaryDispatchContext.Provider>
            </DiaryStateContext.Provider>
        );
    }
}
export default App;