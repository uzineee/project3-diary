import "./Viewer.css";
import { emotionList } from "../utils";

const Viewer = ({ content, emotionId, attachment }) => {
    const emotionItem = emotionList.find((it) => it.id === emotionId);

    return (
        <div className="Viewer">
            <section>
                <h4>오늘의 감정</h4>
                <div
                    className={[
                        "emotion_img_wrapper",
                        `emotion_img_wrapper_${emotionId}`,
                    ].join(" ")}
                >
                    <img alt={emotionItem.name} src={emotionItem.img}/>
                    <div className="emotion_descript">{emotionItem.name}</div>
                </div>
            </section>
            <section>
                <h4>오늘의 일기</h4>
                <div className="content_wrapper">

                    <p>{content}</p>
                </div>
            </section>
            <section>
                <h4>첨부파일</h4>
                {attachment ? (
                    <a
                        href={attachment.dataUrl}
                        download={attachment.name}
                    >
                        {attachment.name}
                    </a>
                ) : (
                    <p>첨부파일이 없습니다.</p>
                )}
            </section>
        </div>
    );
};
export default Viewer;