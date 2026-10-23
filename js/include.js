/*
 * 공통 영역 include
 *  - <div data-include="include/header.html"></div> 자리에 해당 파일의 HTML 을 채운다.
 *  - 페이지별 선택 상태는 <body> 속성으로 지정한다.
 *      data-gnb="교육관리"       : GNB(상단 메뉴)에서 선택 표시할 1차 메뉴명
 *      data-lnb-menu="교육관리"  : LNB(좌측 메뉴)에서 펼칠 1차 메뉴명
 *      data-lnb="과목관리"       : LNB 하위 메뉴에서 선택 표시할 메뉴명
 *  - 로컬에서는 VS Code Live Server 등 http 로 열어야 동작한다 (file:// 에서는 fetch 가 차단됨).
 */
(async () => {
  const slots = [...document.querySelectorAll('[data-include]')];
  try {
    await Promise.all(slots.map(async slot => {
      const response = await fetch(slot.dataset.include);
      if (!response.ok) throw new Error(slot.dataset.include + ' (' + response.status + ')');
      const template = document.createElement('template');
      template.innerHTML = await response.text();
      slot.replaceWith(template.content);
    }));
  } catch (error) {
    console.error('include 실패:', error);
  }

  const { gnb, lnb, lnbMenu } = document.body.dataset;
  const text = element => element.textContent.trim();

  if (gnb) {
    document.querySelectorAll('.lnb .lnb-link').forEach(link => link.classList.toggle('is-active', text(link) === gnb));
  }
  if (lnb) {
    const groups = [...document.querySelectorAll('.side-nav .side-group')];
    const group = groups.find(item => !lnbMenu || text(item.querySelector('.side-parent')) === lnbMenu);
    const link = group && [...group.querySelectorAll('.side-sub a')].find(item => text(item) === lnb);
    if (link) {
      link.classList.add('is-active');
      group.classList.add('is-open');
      group.querySelector('.side-parent').setAttribute('aria-expanded', 'true');
    }
  }

  if (window.initCommon) window.initCommon();
})();
