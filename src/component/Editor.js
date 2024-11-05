import "./Editor.css";
import { useState, useEffect, useCallback, useRef } from "react";
import { emotionList, getFormattedDate } from "../utils";
import Button from "./Button";
import { useNavigate } from "react-router-dom";
import EmotionItem from "./EmotionItem";
import { LuPaperclip } from "react-icons/lu";

const Editor = ({ initData, onSubmit }) => {
    const navigate = useNavigate();
    const fileInputRef = useRef(null); // useRef for file input
    const [state, setState] = useState({
        date: getFormattedDate(new Date()),
        emotionId: 3,
        content: "",
        attachment: null, // 첨부파일 상태 추가
    });

    useEffect(() => {
        if (initData) {
            setState({
                ...initData,
                date: getFormattedDate(new Date(parseInt(initData.date))),
            });
        }
    }, [initData]);

    const handleChangeDate = (e) => {
        setState({
            ...state,
            date: e.target.value,
        });
    };

    const handleChangeContent = (e) => {
        setState({
            ...state,
            content: e.target.value,
        });
    };

    const handleChangeEmotion = useCallback((emotionId) => {
        setState((state) => ({
            ...state,
            emotionId,
        }));
    }, []);

    const handleIconClick = () => {
        fileInputRef.current.click();
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        const MAX_FILE_SIZE = 900 * 1024; // 1MB

        if (file) {
            // 파일 크기 체크
            if (file.size > MAX_FILE_SIZE) {
                alert("파일 크기가 900KB를 초과할 수 없습니다."); // 사용자 알림
                return;
            }

            const reader = new FileReader();
            reader.onload = () => {
                setState((prevState) => ({
                    ...prevState,
                    attachment: {
                        name: file.name,
                        dataUrl: reader.result, // 파일을 data URL 형식으로 저장
                    },
                }));
            };
            reader.readAsDataURL(file); // 파일을 data URL로 변환
        }
    };

    const handleFileUploadClick = () => {
        document.getElementById("fileInput").click(); // 파일 선택 창 열기
    };

    const handleSubmit = () => {
        onSubmit(state);
    };

    const handleOnGoBack = () => {
        navigate(-1);
    };

    return (
        <div className="Editor">
            <h4>오늘의 날짜</h4>
            <div className="input_wrapper">
                <input type="date" value={state.date} onChange={handleChangeDate} />
            </div>
            <div className="editor_section">
                <h4>오늘의 감정</h4>
                <div className="input_wrapper emotion_list_wrapper">
                    {emotionList.map((it) => (
                        <EmotionItem
                            key={it.id}
                            {...it}
                            onClick={handleChangeEmotion}
                            isSelected={state.emotionId === it.id}
                        />
                    ))}
                </div>
            </div>
            <div className="editor_section">
                <h4>오늘의 일기</h4>
                <div className="input_wrapper">
                    <textarea
                        placeholder="오늘은 어땠나요?"
                        value={state.content}
                        onChange={handleChangeContent}
                    />
                </div>
            </div>
            <div className="editor_section">
                <h4>첨부파일</h4>
                <div className="attachment_wrapper">
                    <input
                        type="file"
                        ref={fileInputRef}
                        style={{ display: "none" }}
                        onChange={handleFileChange}
                    />
                    <button type="button" onClick={handleIconClick} className="paperclip_button">
                        <LuPaperclip size={24}/> {/* Paperclip icon as button */}
                    </button>
                    <input
                        id="fileInput"
                        type="file"
                        style={{display: "none"}} // 기본 파일 선택 버튼 숨기기
                        onChange={handleFileChange}
                    />
                    {state.attachment && <p>선택된 파일: {state.attachment.name}</p>}
                </div>
            </div>

            <div className="editor_section bottom_section">
                <Button text={"취소하기"} onClick={handleOnGoBack}/>
                <Button text={"작성 완료"} type={"positive"} onClick={handleSubmit} />
            </div>
        </div>
    );
};

export default Editor;
