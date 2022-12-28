import courses from "../assets/courses.json";

function CourseDetail(props) {
    var code = props.code;
    if(courses[code]==undefined) {
        return (
            <div>
                <p>The Curriculum map project is first introduce by Zory in <a href="https://github.com/zory233/CurriculumMap">their COMP2012H course project</a>.</p>
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
        </div>
    );
}

export default CourseDetail;