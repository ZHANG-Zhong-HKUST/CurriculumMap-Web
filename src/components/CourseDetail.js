import courses from "../assets/courses.json";

function CourseDetail(props) {
    var code = props.code;
    if(courses[code]==undefined) {
        return (
            <div>
                <p>The Curriculum map project is first introduce by Zory & Wang in <a href="https://github.com/zory233/CurriculumMap">their COMP2012H course project</a>.</p>
                <p>This is a web-based re-implementation. Please check the above link for the desktop APP, which has more functionality.</p>
                <p>The code of this web-app is available on <a href="https://github.com/ZHANG-Zhong-HKUST/CurriculumMap-Web">github</a>.</p>
            </div>
        );
    }
    return (
        <div className="row top-margin">
            <p>Note: you can check course detail by click the course code on the left/up.</p>
            <p> </p>
            <b>{code}</b>
            <b>{courses[code].name}</b>
            <p className="">{courses[code].cre}</p>
            <b>Prerequisites:</b>
            <p className="">{courses[code].tpre}</p>
            <b>Exclusion:</b>
            <p className="">{courses[code].texc}</p>
            <b>Co-requisites:</b>
            <p className="">{courses[code].tcov}</p>
            <b>Description:</b>
            <p className="">{courses[code].des}</p>
            <a href={"https://ust.space/review/"+code} target="_blank" rel="noopener noreferrer">Link to USTSPACE</a>
            <a href={"https://ug-msss.hkust.edu.hk/cwiki_catalog/"+code} target="_blank" rel="noopener noreferrer">Link to Cwiki</a>
            <a href={"https://prog-crs.hkust.edu.hk/ugcourse/2022-23/search?keyword="+code} target="_blank" rel="noopener noreferrer">Link to HKUST course catalog</a>
        </div>
    );
}

export default CourseDetail;