import { useNavigate, useParams } from "react-router-dom";
import Button from "../component/Button";
import Header from "../component/Header";
import useDiary from "../hooks/useDiary";
import {getFormattedDate, setPageTitle} from "../utils";
import Viewer from "../component/Viewer";
import {useEffect} from "react";

const Diary = () => {
    const { id } = useParams();
    const data = useDiary(id);

    const navigate = useNavigate();
    const goBack = () => {
        navigate(-1);
    };

    const goEdit = () => {
        navigate(`/edit/${id}`);
    };

    useEffect(() => {
        setPageTitle("uzinee의 감정 일기장");
    }, []);

    if (!data) {
        return <div>일기를 불러오고 있습니다...</div>;
    } else {
        const { date, emotionId, content, attachment } = data;
        const title = `${getFormattedDate(new Date(Number(date)))} 기록`;
        return (
            <div>
                <Header
                    title={title}
                    leftChild={<Button text={"< 뒤로 가기"} onClick={goBack} />}
                    rightChild={<Button text={"수정하기"} onClick={goEdit} />}
                />
                <Viewer content={content} emotionId={emotionId} attachment={attachment} />
            </div>
        );
    }
};
export default Diary;