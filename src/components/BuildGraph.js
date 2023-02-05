import courses from "../assets/courses.json";
import 'reactflow/dist/style.css';
import { useCallback, useState } from 'react';
import ReactFlow, { addEdge, applyEdgeChanges, applyNodeChanges, Background } from 'reactflow';
import{ useNodesState, useEdgesState } from 'reactflow';

var step_div=[0,0,0,0,0,0,0,0,0,0,0,0];
var step_X=[-220,-440,-660,-880,-1100,-1320,0,0,0,0,0,0];
var existsIDs=[];

function buildOne(work, baseX, baseY, code, level, step){
    let het = 30;
    let operand = Object.keys(work)[0];
    let newedges = [];
    let masternode = { id: code, data:{label:operand}, position:{x:baseX, y:baseY}, sourcePosition: 'right', targetPosition:'left'};
    let newnodes = [masternode];
    let innerCount = 0;
    for(let i=0; i < work[operand].length; i++){
        if(typeof(work[operand][i])=='string'){
            het+=10;
            let newcode = work[operand][i];
            let newnode = {id:code+i, 
                data:{label:newcode},
                parentNode: masternode.id,
                position:{x:10*level, y:het},
                style:{width:100,height:40},
                sourcePosition: 'right',
                targetPosition: 'left',
                extent: 'parent'};
            let new_id = getIdCode(newcode, step);
            if(new_id !== null){
                if(existsIDs.indexOf(new_id)==-1) {
                    let [node_id, tmp_nodes, tmp_edges] = buildRelation(newcode, step_X[step], step_div[step+1], step+1, new_id);
                    newedges = newedges.concat(tmp_edges);
                    newnodes = newnodes.concat(tmp_nodes);
                }
                newedges.push({id: new_id+'-'+newnode.id, source:new_id, target: newnode.id});
            }
            newnodes.push(newnode);
            het+=50;
        } else {
            if(Object.keys(work[operand][i]).length==0) continue;
            het+=10;
            innerCount += 1;
            let [tmp_nodes, tmp_edges, tmp_Y] = buildOne(work[operand][i], 10, het, code+'inner'+innerCount, level-1, step);
            tmp_nodes[0].parentNode=masternode.id;
            tmp_nodes[0].extetnt='parent';
            newedges = newedges.concat(tmp_edges);
            newnodes = newnodes.concat(tmp_nodes);
            het += tmp_Y+10;
        }
    }
    newnodes[0].style={width:100+level*20, height: het}
    return [ newnodes, newedges, het];
}

function getIdCode(code, step){
    if(courses[code]==undefined) return null;
    let work = courses[code].pre;
    if(Object.keys(work).length!==0){
        return JSON.stringify(work)+step+'super';
    }
    return null;
}

function buildRelation(code, baseX, baseY, step, idcode){
    let nodes=[], edges=[]
    if(courses[code]==undefined) return [-1,[],[]];
    let work = courses[code].pre;
    existsIDs.push(idcode);
    if(Object.keys(work).length!==0){
        let [tmp_nodes, tmp_edges, tmp_Y] = buildOne(work, baseX-220, baseY, idcode, 3, step);
        step_div[step]+=tmp_Y+10;
        nodes = nodes.concat(tmp_nodes);
        edges = edges.concat(tmp_edges);
        return [tmp_nodes[0].id, nodes, edges];
    }
    return [-1,[],[]];
}

function createGraph(code){
    for(let i = 0;i<step_div.length; i++) step_div[i]=0;
    let initialNodes = [];
    let initialEdges = [];
    existsIDs = [];
    if(code==''){
        return [initialNodes, initialEdges];
    }
    initialNodes.push({id:code, data:{label:code}, style:{width:100,height:40}, sourcePosition: 'right', targetPosition: 'left', position: {x:0, y:0}});
    let [node_id, tmp_nodes, tmp_edges] = buildRelation(code, 0, 0, 0, code+'super-1');
    // tmp_nodes[0].position.y = -tmp_nodes[0].style.height/2;
    initialNodes=initialNodes.concat(tmp_nodes);
    initialEdges=initialEdges.concat(tmp_edges);
    if(typeof(node_id)!='number') 
        initialEdges.push({id: node_id+'-'+code, source:node_id, target: code});
    return [initialNodes, initialEdges];
}

function BuildGraph(props){
    var [initialNodes, initialEdges] = createGraph(props.coursecode);
    // const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    // const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

    // var elements = [initialNodes, initialEdges];

    const onNodeClick = (e, Object) => {
        const code = [Object.data.label];
        if(code!=undefined && courses[code]!=undefined) {
            props.changeCode(code);
        }
    };

    if(initialNodes.length==0) {
        return (
            <div>
                <p>Serarch course code above, please click on the suggested list, or use [up] [down] and [enter] to select a course.</p>
                <p> <b style={{color: "red"}}>WARNING:</b> the inforamtion of this tool is obtained from <a href="https://prog-crs.hkust.edu.hk/ugcourse">HKUST course catalog</a>. It is not necessary to be correct and up to date. Please always refer back to the university's website.</p>
            </div>
        );
    }

    return (
        <div style={{height:props.het}}>
            {/* {props.coursecode} */}
            <ReactFlow
                nodes={initialNodes}
                edges={initialEdges}
                // onNodesChange={onNodesChange}
                onNodeClick={onNodeClick}
                fitView
                // style={rfStyle}
                attributionPosition="top-right"
            />
        </div>
    )
}

export default BuildGraph;