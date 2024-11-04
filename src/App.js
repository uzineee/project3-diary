import React, { useReducer, useRef, useEffect, useState } from "react";
import { Routes, Route} from "react-router-dom";
import "./App.css";
import Home from "./pages/Home";
import New from "./pages/New";
import Diary from "./pages/Diary";
import Edit from "./pages/Edit";

const mockData = [
    {
        id: "mock1",
        date: new Date("2024-11-20").getTime(),
        content: "mock1",
        emotionId: 1,
    },
    {
        id: "mock2",
        date: new Date("2024-11-15").getTime(),
        content: "mock2",
        emotionId: 2,
    },
    {
        id: "mock3",
        date: new Date("2024-11-10").getTime(),
        content: "mock3",
        emotionId: 3,
    },
];

function reducer(state, action) {
    switch (action.type) {
        case "INIT": {
            return action.data;
        }
        case "CREATE": {
            //return [action.data, ...state];
            const newState = [action.data, ...state];
            localStorage.setItem("diary", JSON.stringify(newState));
            return newState;
        }
        case "UPDATE": {
            /*return state.map((it) =>
                String(it.id) === String(action.data.id) ? { ...action.data } : it
            );*/

            const newState = state.map((it) =>
                String(it.id) === String(action.data.id) ? {...action.data} : it
            );
            localStorage.setItem("diary", JSON.stringify(newState));
            return newState;
        }
        case "DELETE": {
            // return state.filter((it) => String(it.id) !== String(action.targetId));
            const newState = state.filter(
                (it) => String(it.id) !== String(action.targetId)
            );
            localStorage.setItem("diary", JSON.stringify(newState));
            return newState;
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
    const idRef = useRef(0);


    useEffect(() => {
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
    }, []);

    const onCreate = (date, content, emotionId, attachment) => {
        dispatch({
            type: "CREATE",
            data: {
                id: idRef.current,
                date: new Date(date).getTime(),
                content,
                emotionId,
                attachment,
            },
        });
        idRef.current += 1;
    };

    const onUpdate = (targetId, date, content, emotionId, attachment) => {
        dispatch({
            type: "UPDATE",
            data: {
                id: targetId,
                date: new Date(date).getTime(),
                content,
                emotionId,
                attachment,
            },
        });
    };

    const onDelete = (targetId) => {
        dispatch({
            type: "DELETE",
            targetId,
        });
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