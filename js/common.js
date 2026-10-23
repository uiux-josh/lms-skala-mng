document.addEventListener('DOMContentLoaded',()=>{document.querySelectorAll('.lnb .lnb-link,.bookmark-nav a').forEach(item=>item.addEventListener('click',event=>{event.preventDefault();const group=item.closest('nav');group.querySelectorAll('a').forEach(link=>link.classList.remove('is-active'));item.classList.add('is-active')}));const sidebarTabs=document.querySelectorAll('[data-sidebar-tab]');const sidebarPanels=document.querySelectorAll('[data-sidebar-panel]');sidebarTabs.forEach(tab=>tab.addEventListener('click',()=>{const target=tab.dataset.sidebarTab;sidebarTabs.forEach(button=>{const active=button===tab;button.classList.toggle('is-active',active);button.setAttribute('aria-selected',String(active));const icon=button.querySelector('img');if(button.dataset.sidebarTab==='bookmark'&&icon)icon.src=active?'images/icons/star-fill.svg':'images/icons/star-outline.svg'});sidebarPanels.forEach(panel=>{panel.hidden=panel.dataset.sidebarPanel!==target})}));const adminPage=document.querySelector('.admin-page');const rail=document.querySelector('.sidebar-rail');rail?.addEventListener('click',()=>{const closed=adminPage.classList.toggle('is-sidebar-closed');rail.setAttribute('aria-expanded',String(!closed));rail.setAttribute('aria-label',closed?'메뉴 열기':'메뉴 닫기');rail.querySelector('img').src=closed?'images/icons/rail-open.svg':'images/icons/rail-close.svg';rail.querySelector('span').innerHTML=closed?'메<br>뉴<br>열<br>기':'메<br>뉴<br>닫<br>기'});const panel=document.querySelector('.search-panel');const fold=document.querySelector('.fold-button');const label=document.querySelector('.fold-label');fold?.addEventListener('click',()=>{const collapsed=panel.classList.toggle('is-collapsed');panel.style.height=collapsed?'66px':'210px';fold.classList.toggle('is-collapsed',collapsed);label.textContent=collapsed?'검색영역 펼치기':'검색영역 접기'});

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

/* 즐겨찾기: X 클릭 삭제, 위아래 화살표 드래그로 순서 변경 */
const bookmarkNav=document.querySelector('.bookmark-nav');
if(bookmarkNav){
  let drag=null,justDragged=false;
  // 캡처 단계에서 처리해 기존 메뉴 활성화 클릭 핸들러보다 먼저 막는다
  bookmarkNav.addEventListener('click',event=>{
    if(justDragged){event.preventDefault();event.stopPropagation();justDragged=false;return}
    const remove=event.target.closest('.bookmark-remove');
    if(remove){event.preventDefault();event.stopPropagation();remove.closest('a').remove()}
  },true);
  bookmarkNav.addEventListener('pointerdown',event=>{
    const handle=event.target.closest('.arrow');
    if(!handle||event.button!==0)return;
    event.preventDefault();
    const item=handle.closest('a');
    drag={item,handle,pointerId:event.pointerId,moved:false};
    handle.setPointerCapture(event.pointerId);
    item.classList.add('is-dragging');
  });
  bookmarkNav.addEventListener('pointermove',event=>{
    if(!drag||event.pointerId!==drag.pointerId)return;
    drag.moved=true;
    const items=[...bookmarkNav.querySelectorAll('a')];
    for(const other of items){
      if(other===drag.item)continue;
      const box=other.getBoundingClientRect();
      if(event.clientY<box.top||event.clientY>box.bottom)continue;
      const after=event.clientY>box.top+box.height/2;
      const movingDown=items.indexOf(drag.item)<items.indexOf(other);
      if(movingDown&&after)other.after(drag.item);
      else if(!movingDown&&!after)other.before(drag.item);
      break;
    }
  });
  const endDrag=event=>{
    if(!drag||event.pointerId!==drag.pointerId)return;
    drag.item.classList.remove('is-dragging');
    if(drag.handle.hasPointerCapture(event.pointerId))drag.handle.releasePointerCapture(event.pointerId);
    justDragged=drag.moved;
    drag=null;
    // 클릭이 발생하지 않는 경우를 대비해 플래그 초기화
    setTimeout(()=>{justDragged=false},0);
  };
  bookmarkNav.addEventListener('pointerup',endDrag);
  bookmarkNav.addEventListener('pointercancel',endDrag);
}
});
