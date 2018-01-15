const wy = {
	ku : document.querySelector('.ku'),
	List : document.querySelector('.list'),
	currentListId : 0,
	moveTargetId : 0
}
let childrenNum = wy.ku.children;
const xuan = document.querySelector('.xuan');
var xuanEm = xuan.querySelector('em');
var cache = {length:0}
var shu = document.querySelector('.shu');
var spanNum = shu.querySelector('span');
var popover = document.querySelector('.popover');
var uItem = document.querySelector('.item');
var uLis = uItem.querySelectorAll('li');
var shanchu = document.querySelector('.shanchu');
var sureBtn = document.querySelector('.sureBtn');
var offBtn = document.querySelector('.offBtn');
var guo = true;
var yidong = document.querySelector('.yidong');
var lei = document.querySelector('.lei');
var biao = document.querySelector('.biao');
var dong = document.querySelector('.dong');
var off = document.querySelector('.off');
var sure = document.querySelector('.sure');
var shi = true;
var yi = document.querySelector('.yi');
var er = document.querySelector('.er');
var content = document.querySelector('.content')
var kong = document.querySelector('.kong')
var last = document.querySelector('.last');
//初始化操作
intoFolder(wy.currentListId);
console.log(childrenNum);
//点击进入
function intoFolder(currentListId){
	cache = {length:0};
	xuanEm.classList.remove('active');
	spanNum.innerHTML = 0;
	kuHtml(db, currentListId);
	listHtml(db,currentListId);
}

//右键菜单
//content.addEventListener('contextmenu',function(e){
//	e.preventDefault();
//  e.stopPropagation();
//  console.log(1);
//});
//生成当前文件节点
yi.onclick = function(){
	shi = true;
	intoFolder(wy.currentListId);
}
er.onclick = function(){
	shi = false;
	intoFolder(wy.currentListId);
}
//刷新
uLis[6].addEventListener('click',function(e){
	e.preventDefault();
	intoFolder(wy.currentListId);
})
function createWenjianHtml(fileData){
	const fileItem = document.createElement('li');
	fileItem.className = 'wenjian';
	fileItem.innerHTML = `<div class="btn"></div>
							<em class="em"></em>
							<a title="${fileData.name}">${fileData.name}</a>
							<div class="mingzi">
								<input type="text" class="inp" />
							</div>`;
	fileItem.fileId = fileData.id;
	var fileItemChildrens = fileItem.children;
	for(var i=0;i<fileItemChildrens.length;i++){
		fileItemChildrens[i].fileId = fileData.id;
	}
	return fileItem;
}

function kuHtml(db,id){
	wy.ku.innerHTML = '';
	let children = getChildrenById(db,id);
	if(!children.length){
		kong.style.display = 'block';
	}else{
		kong.style.display = '';
	}
	if(shi){
		children.sort(function (a, b){
		    return a.name[0].localeCompare(b.name[0], 'zh');
		});
	}else{
		children.sort(function(a,b){
			return a.id < b.id;
		})
	}
	children.forEach(function(item,i){
		(wy.ku).appendChild(createWenjianHtml(item))
	})
}
//生成面包屑导航
function createBreadHtml(fileData){
	const breatHtml = document.createElement('div');
	breatHtml.className = 'bread';
	breatHtml.innerHTML = `<em>></em>
					<a href="javascript:;">${fileData.name}</a>`;
	var fileItemChildrens = breatHtml.children;
	fileItemChildrens[1].fileId = fileData.id;
	return breatHtml;
}

function listHtml(db,id){
	wy.List.innerHTML ='';
	var data = getParents(db, id);
	data.forEach(function(item,i){
		(wy.List).appendChild(createBreadHtml(item))
	})
}

//生成移动的信息框
function leiHtml(db,id = 0,currentListId){
	const data= db[id];
	const floorIndex = getParents(db,id).length;
	const children = getChildrenById(db,id);
	const len = children.length;
	let str = `<ul>`;
	str += `<li>
				<div data-file-id="${data.id}" class="${currentListId === data.id ? 'active' : ''}" style="padding-left: ${(floorIndex-1)*15}px;">
					<em data-file-id="${data.id}"></em>
					<span data-file-id="${data.id}">${data.name}</span>
				</div>`;
	if(len){
		for(let i=0;i<len;i++){
			str += leiHtml(db,children[i].id,currentListId);
		}
	}
	return str += `</li></ul>`;
}


//画框选中
wy.ku.onmousedown = function(e){
	var mouseX = e.clientX,mouseY = e.clientY;
	for(let i=0;i<childrenNum.length;i++){
			childrenNum[i].net = false;
	}
	document.onmousemove = function(e){
		e.preventDefault();
		var divX = e.clientX,divY = e.clientY;
		var num = 0;
		if(divX-mouseX !== 0 && divY-mouseY !== 0){
			last.style.left = Math.min(mouseX,divX) + 'px';
			last.style.top = Math.min(mouseY,divY) + 'px';
			last.style.width = Math.max(mouseX,divX) - Math.min(mouseX,divX) + 'px';
			last.style.height = Math.max(mouseY,divY) - Math.min(mouseY,divY) + 'px';
		}
		for(let i=0;i<childrenNum.length;i++){
			childrenNum[i].index = false;
			if(childrenNum[i].index !== duang(last,childrenNum[i])){
				childrenNum[i].index = true;
			}else{
				childrenNum[i].index = false;
			}
			if(childrenNum[i].index !== childrenNum[i].net){
				btnAddClass(childrenNum[i].firstElementChild);
				childrenNum[i].net = childrenNum[i].index;
			}
		}
	}
	document.onmouseup = function(e){
		last.style.left = '';
		last.style.top ='';
		last.style.width ='';
		last.style.height ='';
		this.onmouseup = this.onmousemove = null;
	}
}

//单选添加类名
function btnAddClass(target){
	const checked = target.classList.toggle('active');
	target.parentNode.classList.toggle('active');
	if(checked){
		cache[target.fileId] = target.parentNode;
		cache.length++;
	}else{
		cache.length--;
		delete cache[target.fileId];
	}
	if(cache.length === childrenNum.length){
		xuanEm.classList.add('active');
	}else{
		xuanEm.classList.remove('active');
	}
	spanNum.innerHTML = cache.length;
}


//点击进入
wy.ku.addEventListener('click',function(e){
	var em = wy.ku.querySelector('.em')
	const target = e.target;
	if(target.classList.contains('em') || target.classList.contains('wenjian')){
		intoFolder(wy.currentListId = target.fileId);
	}
	if(target.classList.contains('btn')){
		btnAddClass(target);
	}
})
//点击面包屑导航
wy.List.addEventListener('click',function(e){
	e.preventDefault();
	const target = e.target;
	if(target.fileId !== undefined && wy.currentListId !== target.fileId){
		intoFolder(wy.currentListId = target.fileId);
	}
})



//重命名事件
uLis[3].addEventListener('click',function(e){
	var len = cache.length;
	if(len>1){
		return alertMessage('只能选择一个');
	}
	if(!len){
		return alertMessage('请选择一个文件');
	}
	setNewName(cache);
})

//多选按钮
xuanEm.addEventListener('click',function(e){
	cache = {length:0};
	e.preventDefault();
	var target = e.target;
	var btn = document.querySelectorAll('.btn');
	if(target.classList.contains('active')){
		target.classList.remove('active');
		btn.forEach(function(item,i){
			item.classList.remove('active');
			item.parentNode.classList.remove('active');
		});
		spanNum.innerHTML = 0;
	}else{
		target.classList.add('active');
		btn.forEach(function(item,i){
			cache.length++;
			item.classList.add('active');
			item.parentNode.classList.add('active');
			cache[item.fileId] = item.parentNode;
		});
		spanNum.innerHTML = childrenNum.length;
	}
})

//删除按钮
uLis[4].addEventListener('click',function(e){
	e.preventDefault();
	if(!cache.length){
		return alertMessage('请选择文件');
	}
	shanchu.style.display = 'block';
	animation({
		el:shanchu,
		attrs:{
			opacity:1
		}
	})
})

//删除的取消按钮
offBtn.addEventListener('click',function(e){
	e.preventDefault();
	hui();
})

//删除的确定按钮
sureBtn.addEventListener('click',function(e){
	e.preventDefault();
	var arr = changeArr(cache);
	arr.forEach(function(item,i){
		const {fileId,fileNode} = item;
		wy.ku.removeChild(fileNode);
		cache.length--;
		if(!cache.length){
			cache = {length:0}
		}else{
			delete cache[fileId];
		}
		deleteItemById(db,fileId);
	})
	hui();
	alertMessage('删除成功');
})


//新建文件夹
uLis[5].addEventListener('click',function(e){
	e.preventDefault();
	intoFolder(wy.currentListId);
	const {ku} = wy;
	var newFolder = {
		id : Date.now(),
		pId : wy.currentListId,
		name : ''
	};
	var newWenjianHtml = createWenjianHtml(newFolder);
	ku.insertBefore(newWenjianHtml, ku.firstElementChild);
	var newLiChild = newWenjianHtml.querySelector('.btn');
	btnAddClass(newLiChild);
	db[newFolder.id] = newFolder;
	setNewName(cache,guo);
})


//移动文件夹
uLis[2].addEventListener('click',function(e){
	e.preventDefault();
	if(!cache.length){
		return alertMessage('未选中文件');
	}
	locomotion();
})

//关闭移动问价夹提示框
dong.onmousedown = function (e){
    e.stopPropagation();
    yidong.style.display = '';
};
off.onclick = function (){
	yidong.style.display = '';
}
function locomotion(){
	const {currentListId} = wy;
	lei.innerHTML = leiHtml(db,id = 0,currentListId);
	yidong.style.display = 'block';
	dragEle({
		downEle: biao.querySelector('h4'),
		moveEle: biao
	});
	const listTreeItems = lei.querySelectorAll('div');
	var prevActive = currentListId;
	for(let i=0;i<listTreeItems.length;i++){
		listTreeItems[i].onclick = function(){
			for(let i=0;i<listTreeItems.length;i++){
				listTreeItems[i].classList.remove('active');
			}
			this.classList.add('active');
			wy.moveTargetId = this.dataset.fileId * 1;
		}
		listTreeItems[i].firstElementChild.onclick = function (){
			const allSiblings = [...this.parentNode.parentNode.children].slice(1);
			if(allSiblings.length){
				allSiblings.forEach(function(item,i){
					item.style.display = item.style.display === '' ? 'none' : '';
				})
			}
			this.classList.toggle('em1');
		}
	}
	sure.onclick = function(){
	 	const checkedEles = changeArr(cache);
	 	for(let i=0;i<checkedEles.length;i++){
    		const {fileId, fileNode} = checkedEles[i];
		    const ret = canMoveData(db, fileId, wy.moveTargetId);
		    if(ret === 2){
    			yidong.style.display = '';
	        	return alertMessage('已经在当前目录');
		    }
		    if(ret === 3){
    			yidong.style.display = '';
		        return alertMessage('不能移动到子集');
		    }
		    if(ret === 4){
    			yidong.style.display = '';
		        return alertMessage('存在同名文件');
		    }
	 	}
	 	checkedEles.forEach(function(item, i){
	        const {fileId, fileNode} = item;
	        moveDataToTarget(db, fileId, wy.moveTargetId);
//	        console.log(fileNode);
//	        cache.removeChild(fileNode.parentNode);
	   });
		yidong.style.display = '';
        return alertMessage('移动成功');
	}
}
//删除后恢复默认
function hui(){
	shanchu.style.display = '';
	shanchu.style.opacity = '';
	alertMessage('删除取消');
}
//重命名遇到事件
function setNewName(cache,can){
	var cacheEle = changeArr(cache)[0];
	const {fileId,fileNode} = cacheEle;
	var mingZi = fileNode.querySelector('.mingzi');
	var liA = fileNode.querySelector('a');
	var inp = mingZi.querySelector('.inp');
	dblSetCls(mingZi,liA);
	const oldName = inp.value = liA.innerHTML;
	inp.select();
	inp.onblur = function (){
		let newName = this.value.trim();
		if(can){
			if(!newName){
				delete db[fileId];
				this.onblur = null;
				return alertMessage('创建失败');
			}
		}
		if(can){
			if(!nameCanUse(db, wy.currentListId, newName)){
				inp.value = '';
				inp.select();
				popover.innerHTML = '命名冲突';
				animation({
				  	duration:600,
				  	el:popover,
				  	attrs:{
				  		top:30,
				  		opacity:1
				  	},
				  	cb(){
				  		alertMessage.timer = setTimeout(function() {
				        popover.innerHTML = '';
				        popover.style.top = '';
				        popover.style.opacity = '0';
				      }, 1500);
				  	}
				  })
				return;
			}
		}
		if(!newName){
	      dblSetCls(liA,mingZi);
	      this.onblur = null;
	      return alertMessage('取消重命名');
	    }
		if(newName === oldName){
	      dblSetCls(liA, mingZi);
	      this.onblur = null;
	      return;
	    }
		if(!nameCanUse(db, wy.currentListId, newName)){
	      this.select();
	      this.onblur = null;
	      return alertMessage('命名冲突');
	    }
		if(can){
			if(!newName){
				delete db[fileId];
				this.onblur = null;
				return alertMessage('创建失败');
			}
		}
		liA.innerHTML = newName;
		dblSetCls(liA, mingZi);
		setItemById(db,fileId, {name: newName});
		alertMessage('命名成功');
		intoFolder(wy.currentListId);
		this.onblur = null;
	}
}

function dblSetCls(mingZi,liA){
	mingZi.style.display = 'block';
	liA.style.display = 'none';
}


//将选中的元素缓存成数组
function changeArr(cache){
	let data = [];
	for(let key in cache){
		if(key !== 'length'){
			var value = cache[key];
			data.push({
				fileId:key*1,
				fileNode:value
			})
		}
	}
	return data;
}


//信息提示框
function alertMessage(text){
clearTimeout(alertMessage.timer);
  popover.innerHTML = text;
  intoFolder(wy.currentListId);
  animation({
  	duration:600,
  	el:popover,
  	attrs:{
  		top:30,
  		opacity:1
  	},
  	cb(){
  		alertMessage.timer = setTimeout(function() {
        popover.innerHTML = '';
        popover.style.top = '';
        popover.style.opacity = '0';
      }, 1500);
  	}
  })
}