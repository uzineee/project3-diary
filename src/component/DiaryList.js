import { useState, useEffect } from "react";
import Button from "./Button";
import "./DiaryList.css";
import { useNavigate } from "react-router-dom";
import DiaryItem from "./DiaryItem";
import * as XLSX from "xlsx";

const sortOptionList = [
    { value: "latest", name: "최신순" },
    { value: "oldest", name: "오래된 순" },
];

const DiaryList = ({ data }) => {
    const navigate = useNavigate();
    const [sortType, setSortType] = useState("latest");
    const [sortedData, setSortedData] = useState([]);

    useEffect(() => {
        const compare = (a, b) => {
            if (sortType === "latest") {
                return Number(b.date) - Number(a.date);
            } else {
                return Number(a.date) - Number(b.date);
            }
        };
        const copyList = JSON.parse(JSON.stringify(data));
        copyList.sort(compare);
        setSortedData(copyList);
    }, [data, sortType]);

    const onChangeSortType = (e) => {
        setSortType(e.target.value);
    };
    const onClickNew = () => {
        navigate("/new");
    };

    // 엑셀로 추출하는 함수
    const exportToExcel = () => {
        const formattedData = sortedData.map((item) => ({
            ...item,
            date: new Date(item.date).toLocaleDateString("ko-KR"),
        }));
        const monthYear = new Date(formattedData[0].date).toISOString().slice(0, 7);
        const worksheet = XLSX.utils.json_to_sheet(formattedData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "FilteredDiaryData");

        // 엑셀 파일 생성 및 다운로드
        XLSX.writeFile(workbook, `Emotion_Diary_${monthYear}.xlsx`);
    };

    return (
        <div className="DiaryList">
            <div className="menu_wrapper">
                <div className="left_col">
                    <select value={sortType} onChange={onChangeSortType}>
                        {sortOptionList.map((it, idx) => (
                            <option key={idx} value={it.value}>
                                {it.name}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="right_col">
                    <Button
                        type={"positive"}
                        text={"새 일기 쓰기"}
                        onClick={onClickNew}
                    />
                </div>
            </div>
            <div className="list_wrapper">
                {sortedData.map((it) => (
                    <DiaryItem key={it.id} {...it} />
                ))}
            </div>
            <div className="list_export">
                {sortedData.length > 0 && (
                    <Button text="Export" onClick={exportToExcel}></Button>
                )}

            </div>
        </div>
    );
};
export default DiaryList;