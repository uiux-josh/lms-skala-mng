window.initCommon=()=>{document.querySelectorAll('.lnb .lnb-link,.bookmark-nav a').forEach(item=>item.addEventListener('click',event=>{event.preventDefault();const group=item.closest('nav');group.querySelectorAll('a').forEach(link=>link.classList.remove('is-active'));item.classList.add('is-active')}));const sidebarTabs=document.querySelectorAll('[data-sidebar-tab]');const sidebarPanels=document.querySelectorAll('[data-sidebar-panel]');sidebarTabs.forEach(tab=>tab.addEventListener('click',()=>{const target=tab.dataset.sidebarTab;sidebarTabs.forEach(button=>{const active=button===tab;button.classList.toggle('is-active',active);button.setAttribute('aria-selected',String(active));const icon=button.querySelector('img');if(button.dataset.sidebarTab==='bookmark'&&icon)icon.src=active?'images/icons/star-fill.svg':'images/icons/star-outline.svg'});sidebarPanels.forEach(panel=>{panel.hidden=panel.dataset.sidebarPanel!==target})}));const adminPage=document.querySelector('.admin-page');const rail=document.querySelector('.sidebar-rail');rail?.addEventListener('click',()=>{const closed=adminPage.classList.toggle('is-sidebar-closed');rail.setAttribute('aria-expanded',String(!closed));rail.setAttribute('aria-label',closed?'메뉴 열기':'메뉴 닫기');rail.querySelector('img').src=closed?'images/icons/rail-open.svg':'images/icons/rail-close.svg';rail.querySelector('span').innerHTML=closed?'메<br>뉴<br>열<br>기':'메<br>뉴<br>닫<br>기'});const panel=document.querySelector('.search-panel');if(panel)panel.dataset.fullHeight=panel.offsetHeight+'px';const fold=document.querySelector('.fold-button');const label=document.querySelector('.fold-label');fold?.addEventListener('click',()=>{const collapsed=panel.classList.toggle('is-collapsed');panel.style.height=collapsed?'66px':panel.dataset.fullHeight;fold.classList.toggle('is-collapsed',collapsed);label.textContent=collapsed?'검색영역 펼치기':'검색영역 접기'});

/* 좌측 메뉴: 화살표(상위 메뉴) 클릭 시 하위 메뉴 펼침/접힘 (한 번에 하나만 펼침) */
const sideNav=document.querySelector('.side-nav');
if(sideNav){
  const groups=[...sideNav.querySelectorAll('.side-group')];
  sideNav.querySelectorAll('.side-parent').forEach(parent=>parent.addEventListener('click',event=>{
    event.preventDefault();
    const group=parent.closest('.side-group');
    if(!group.querySelector('.side-sub'))return; // 하위 메뉴가 없는 항목
    const open=!group.classList.contains('is-open');
    groups.forEach(item=>{
      const isTarget=item===group;
      item.classList.toggle('is-open',isTarget&&open);
      item.querySelector('.side-parent').setAttribute('aria-expanded',String(isTarget&&open));
    });
  }));
  sideNav.querySelectorAll('.side-sub a').forEach(link=>link.addEventListener('click',event=>{
    event.preventDefault();
    sideNav.querySelectorAll('.side-sub a.is-active').forEach(active=>active.classList.remove('is-active'));
    link.classList.add('is-active');
  }));
}

/* GNB 2차 메뉴 레이어: 위쪽 화살표 클릭 시 3차 메뉴 접기/펼치기 */
document.querySelectorAll('.lnb-toggle').forEach(button=>button.addEventListener('click',event=>{
  event.preventDefault();
  event.stopPropagation();
  const item=button.closest('.has-sub');
  const collapsed=item.classList.toggle('is-collapsed');
  const name=item.querySelector(':scope > a').textContent.trim();
  button.setAttribute('aria-expanded',String(!collapsed));
  button.setAttribute('aria-label',name+(collapsed?' 하위 메뉴 펼치기':' 하위 메뉴 접기'));
}));

/* 전체메뉴 레이어팝업: 그리드 아이콘 클릭으로 열고, 닫기 버튼 / 배경 클릭 / ESC 로 닫기 */
const allMenu=document.getElementById('allMenu');
const allMenuOpen=document.getElementById('allMenuOpen');
if(allMenu&&allMenuOpen){
  const closeButton=allMenu.querySelector('.all-menu__close');
  const setOpen=open=>{
    allMenu.classList.toggle('is-open',open);
    allMenu.setAttribute('aria-hidden',String(!open));
    allMenuOpen.setAttribute('aria-expanded',String(open));
    if(open)closeButton.focus();else allMenuOpen.focus();
  };
  allMenuOpen.addEventListener('click',()=>setOpen(true));
  closeButton.addEventListener('click',()=>setOpen(false));
  allMenu.addEventListener('click',event=>{if(event.target===allMenu)setOpen(false)});
  allMenu.querySelectorAll('a').forEach(link=>link.addEventListener('click',event=>event.preventDefault()));
  document.addEventListener('keydown',event=>{if(event.key==='Escape'&&allMenu.classList.contains('is-open'))setOpen(false)});
}

/* 검색결과 표 가로 스크롤 여부 표시 (스크롤이 생길 때만 표 아래 테두리를 그린다) */
document.querySelectorAll('.table-scroll').forEach(box=>{
  const update=()=>box.classList.toggle('is-scroll',box.scrollWidth>box.clientWidth+1);
  update();
  if(window.ResizeObserver)new ResizeObserver(update).observe(box);else window.addEventListener('resize',update);
});

/* 선택 버튼 그룹(radio-group): 선택된 항목 표시 */
document.querySelectorAll('.radio-group').forEach(group=>{
  group.addEventListener('change',()=>{
    group.querySelectorAll('label').forEach(label=>label.classList.toggle('is-checked',label.querySelector('input').checked));
  });
});

/* 즐겨찾기: X 클릭 삭제, 위아래 화살표를 누른 채 드래그하면 항목이 마우스를 따라 움직이며 순서 변경 */
const bookmarkNav=document.querySelector('.bookmark-nav');
if(bookmarkNav){
  const SETTLE='transform .2s ease';
  let drag=null,justDragged=false;
  const listItems=()=>[...bookmarkNav.querySelectorAll('a')];
  // 캡처 단계에서 처리해 기존 메뉴 활성화 클릭 핸들러보다 먼저 막는다
  bookmarkNav.addEventListener('click',event=>{
    if(justDragged){event.preventDefault();event.stopPropagation();justDragged=false;return}
    const remove=event.target.closest('.bookmark-remove');
    if(remove){event.preventDefault();event.stopPropagation();remove.closest('a').remove()}
  },true);
  // 브라우저 기본 이미지/링크 끌기가 시작되면 드래그가 중단되므로 막는다
  bookmarkNav.addEventListener('dragstart',event=>event.preventDefault());

  const onMove=event=>{
    if(!drag||event.pointerId!==drag.pointerId)return;
    drag.moved=true;
    const {item}=drag;
    // 항목이 마우스를 따라가되, 목록 영역 안에서만 움직인다
    const minTop=drag.listTop,maxTop=drag.listTop+(drag.count-1)*drag.height;
    const top=Math.min(maxTop,Math.max(minTop,drag.startTop+event.clientY-drag.startY));
    const items=listItems();
    const target=Math.round((top-drag.listTop)/drag.height);
    if(target!==items.indexOf(item)){
      // 다른 항목들은 원래 보이던 위치에서 새 자리로 부드럽게 이동한다 (FLIP)
      const others=items.filter(x=>x!==item);
      const before=new Map(others.map(x=>[x,x.getBoundingClientRect().top]));
      bookmarkNav.insertBefore(item,others[target]||null);
      others.forEach(x=>{
        x.style.transition='none';
        x.style.transform='';
        const diff=before.get(x)-x.getBoundingClientRect().top;
        if(!diff)return;
        x.style.transform='translateY('+diff+'px)';
        x.getBoundingClientRect();
        x.style.transition=SETTLE;
        x.style.transform='';
      });
    }
    item.style.transform='';
    item.style.transform='translateY('+(top-item.getBoundingClientRect().top)+'px)';
  };

  const onEnd=event=>{
    if(!drag||event.pointerId!==drag.pointerId)return;
    const {item,moved}=drag;
    document.removeEventListener('pointermove',onMove);
    document.removeEventListener('pointerup',onEnd);
    document.removeEventListener('pointercancel',onEnd);
    document.body.classList.remove('is-bookmark-dragging');
    // 놓은 자리(새 위치)로 부드럽게 안착
    item.classList.remove('is-dragging');
    item.classList.add('is-settling');
    item.style.transition=SETTLE;
    item.style.transform='';
    setTimeout(()=>{
      item.classList.remove('is-settling');
      listItems().forEach(x=>{x.style.transition='';x.style.transform=''});
    },230);
    justDragged=moved;
    drag=null;
    // 클릭이 발생하지 않는 경우를 대비해 플래그 초기화
    setTimeout(()=>{justDragged=false},0);
  };

  bookmarkNav.addEventListener('pointerdown',event=>{
    const handle=event.target.closest('.arrow');
    if(!handle||event.button!==0)return;
    event.preventDefault();
    const item=handle.closest('a');
    const items=listItems();
    const rect=item.getBoundingClientRect();
    drag={item,pointerId:event.pointerId,moved:false,startY:event.clientY,startTop:rect.top,height:rect.height,listTop:items[0].getBoundingClientRect().top,count:items.length};
    items.forEach(x=>{x.style.transition='none'});
    item.classList.add('is-dragging');
    document.body.classList.add('is-bookmark-dragging');
    // 항목이 이동(DOM 재배치)해도 끊기지 않도록 document 에서 마우스 움직임을 받는다
    document.addEventListener('pointermove',onMove);
    document.addEventListener('pointerup',onEnd);
    document.addEventListener('pointercancel',onEnd);
  });
}
};
