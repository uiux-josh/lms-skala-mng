document.addEventListener('DOMContentLoaded',()=>{
  /* 즐겨찾기 토글 */
  const bookmark=document.querySelector('.bookmark-toggle');
  bookmark?.addEventListener('click',()=>{
    const on=bookmark.classList.toggle('is-on');
    bookmark.setAttribute('aria-label',on?'즐겨찾기 해제':'즐겨찾기 추가');
  });

  /* 총 교육시간 = 교육일수 x 1일 교육시간 */
  const days=document.getElementById('eduDays');
  const hours=document.getElementById('dayHours');
  const total=document.getElementById('totalHours');
  const onlyNumber=input=>{input.value=input.value.replace(/[^0-9]/g,'')};
  const calc=()=>{
    const d=parseInt(days.value,10);
    const h=parseInt(hours.value,10);
    total.value=(d>0&&h>0)?String(d*h):'';
  };
  [days,hours].forEach(input=>input?.addEventListener('input',()=>{onlyNumber(input);calc()}));

  /* 과목내용 글자수 */
  const desc=document.getElementById('courseDesc');
  const count=document.getElementById('descCount');
  desc?.addEventListener('input',()=>{count.textContent=String(desc.value.length)});

  /* 사용여부 라디오 */
  document.querySelectorAll('.radio-group').forEach(group=>{
    group.addEventListener('change',()=>{
      group.querySelectorAll('label').forEach(label=>label.classList.toggle('is-checked',label.querySelector('input').checked));
    });
  });

  /* 파일 첨부 (강의교안 / 강의자료) */
  const MAX_SIZE=100*1024*1024;
  const formatSize=bytes=>bytes>=1048576?(bytes/1048576).toFixed(1)+' MB':Math.max(1,Math.round(bytes/1024))+' KB';
  document.querySelectorAll('.file-box').forEach(box=>{
    const max=Number(box.dataset.max)||3;
    const input=box.querySelector('.file-input');
    const list=box.querySelector('.file-list');
    const all=box.querySelector('[data-file-all]');
    const drop=box.querySelector('.file-drop');
    const rows=()=>[...list.querySelectorAll('.file-row')];
    const syncAll=()=>{all.checked=rows().length>0&&rows().every(row=>row.querySelector('input').checked)};
    const addFiles=files=>{
      [...files].forEach(file=>{
        if(rows().length>=max){alert('파일 첨부는 최대 '+max+'개까지 가능합니다.');return}
        if(file.size>MAX_SIZE){alert('파일당 100 MB까지 첨부할 수 있습니다.\n('+file.name+')');return}
        const row=document.createElement('div');
        row.className='file-row';
        row.innerHTML='<label class="chk"><input type="checkbox" aria-label="선택"></label><span class="file-name"></span><span class="file-size"></span>';
        row.querySelector('.file-name').textContent=file.name;
        row.querySelector('.file-size').textContent=formatSize(file.size);
        row.querySelector('input').addEventListener('change',syncAll);
        list.append(row);
      });
      input.value='';
      syncAll();
    };
    box.querySelector('[data-file-add]').addEventListener('click',()=>input.click());
    drop.addEventListener('dblclick',()=>input.click());
    drop.addEventListener('keydown',event=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();input.click()}});
    input.addEventListener('change',()=>addFiles(input.files));
    ['dragenter','dragover'].forEach(type=>drop.addEventListener(type,event=>{event.preventDefault();drop.classList.add('is-over')}));
    ['dragleave','drop'].forEach(type=>drop.addEventListener(type,event=>{event.preventDefault();drop.classList.remove('is-over')}));
    drop.addEventListener('drop',event=>addFiles(event.dataTransfer.files));
    all.addEventListener('change',()=>rows().forEach(row=>{row.querySelector('input').checked=all.checked}));
    box.querySelector('[data-file-remove]').addEventListener('click',()=>{
      rows().filter(row=>row.querySelector('input').checked).forEach(row=>row.remove());
      syncAll();
    });
    box.querySelector('[data-file-clear]').addEventListener('click',()=>{
      list.innerHTML='';
      syncAll();
    });
  });
});
