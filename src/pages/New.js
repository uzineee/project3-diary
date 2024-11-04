import { useNavigate } from "react-router-dom";
import Button from "../component/Button";
import Header from "../component/Header";
import Editor from "../component/Editor";
import {useContext, useEffect} from "react";
import { DiaryDispatchContext } from "../App";
import {setPageTitle} from "../utils";

const New = () => {
    useEffect(() => {
        setPageTitle("uzinee의 감정 일기장");
    }, []);

    const { onCreate } = useContext(DiaryDispatchContext);
    const navigate = useNavigate();

    const goBack = () => {
        navigate(-1);
    };

    const onSubmit = (data) => {
        const { date, content, emotionId, attachment } = data;
        onCreate(date, content, emotionId, attachment);
        navigate("/", { replace: true });
    };

    return (
        <div>
            <Header
                title={"새 일기 쓰기"}
                leftChild={<Button text={"< 뒤로 가기"} onClick={goBack} />}
            />
            <Editor onSubmit={onSubmit} />
        </div>
    );
};
export default New;