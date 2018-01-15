const db = {
	'0':{
		id:0,
		name:'云盘'
	},
	'1':{
		id:1,
		pId:0,
		name:'音乐'
	},
	'2':{
		id:2,
		pId:0,
		name:'电影'
	},
	'3':{
		id:3,
		pId:1,
		name:'周杰伦'
	},
	'4':{
		id:4,
		pId:2,
		name:'战狼2'
	},
	'5':{
		id:5,
		pId:2,
		name:'战狼'
	}
}


//根据指定id找到所有当前id的所有子级

function getChildrenById(db,id){
	const data = [];
	for(let key in db){
		const item = db[key];
		if(item.pId === id){
			data.push(item);
		}
	}
	return data;
}

//根据指定id找到所有当前这个文件以及它的所有的父级
function getParents(db,id){
	var arr = [];
	if(db[id]){
		arr.push(db[id]);
		var item = db[id].pId;
		arr = getParents(db,item).concat(arr);
	}
	return arr;
}


//根据指定id删除所有指定子集
function deleteItemById(db,id){
	if(!id){return false;}
	delete db[id];
	let children = getChildrenById(db,id);
	let len = children.length;
	if(len){
		for(let i=0;i<len;i++){
			deleteItemById(db,children[i].id);
		}
	}
	return true;
}

//判断名字是否可用
function nameCanUse(db, id, text){
  const currentData = getChildrenById(db, id);
  return currentData.every(item => item.name !== text);
}

// 根据id设置指定的数据
function setItemById(db, id, data){   // setItemById(db, 0, {name: '123'})
  const item = db[id];
  // for(let key in data){
  //   item[key] = data[key];
  // }
  return Object.assign(item, data);  // 合拼对象里面的属性
}

// 根据指定id删除对应的数据以及它所有的子集
function deleteItemById(db, id){
  if(!id) return false;  // 根目录不能删除
  delete db[id];
  let children = getChildrenById(db, id);
  let len = children.length;
  if(len){
    for(let i=0; i<len; i++){
      deleteItemById(db, children[i].id);
    }
  }
  return true;
}
// 判断可否移动数据
function canMoveData(db, currentId, targetId){
  const currentData = db[currentId];
  
  const targetParents = getParents(db, targetId);
  
  if(currentData.pId === targetId){
    return 2; // 移动到自己所在的目录
  }
  
  if(targetParents.indexOf(currentData) !== -1){
    return 3;   // 移动到自己的子集
  }
  if(!nameCanUse(db, targetId, currentData.name)){
    return 4; // 名字冲突
  }
  
  return 1;
}

function moveDataToTarget(db, currentId, targetId){
  db[currentId].pId = targetId;
}