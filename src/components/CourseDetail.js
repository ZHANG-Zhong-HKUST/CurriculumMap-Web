import courses from "../assets/courses.json";

function CourseDetail(props) {
    var code = props.code;
    if(courses[code]==undefined) {
        return (
            <div>
                Note: you can check course detail by click on the course code on the left.
            </div>
        );
    }
    return (
        <div className="row top-margin">
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