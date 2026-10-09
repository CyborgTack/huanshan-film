
(function(){
  function init(){
    var panel=document.getElementById('studioPanel');
    if(!panel)return;
    function openStudio(){panel.classList.add('open');document.body.style.overflow='hidden'}
    function closeStudio(){panel.classList.remove('open');document.body.style.overflow=''}
    document.addEventListener('click',function(e){
      if(e.target.closest('[data-sp-close]')){closeStudio();return}
      if(e.target.closest('[data-open-studio]')){e.preventDefault();openStudio();return}
    });
    document.addEventListener('keydown',function(e){if(e.key==='Escape')closeStudio()});
  }
  if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',init)}
  else{init()}
})();

(function(){
  "use strict";
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ===== 开场：序曲盖章 → 卷轴展开（最短展示 + 数据就绪后进入） ===== */
  if(reduceMotion){ document.body.classList.remove("intro"); }
  var __hsIntroMin = false, __hsIntroClicked = false;
  function __hsFinishIntro(){
    if(reduceMotion){ return; }
    // 点了就立刻撤走黑幕，不等数据；数据后台慢慢加载
    if(__hsIntroClicked){
      document.body.classList.add("intro-done");
    }
  }
  // 数据加载完成只用于标记，不再阻塞进入
  window.__hsIntroDataReady = function(){};
  // 自动进入兜底（用户不点，30秒后强制进入）
  setTimeout(function(){ __hsIntroClicked = true; __hsFinishIntro(); }, 30000);
  var __hsEnter = document.getElementById("preludeEnter");
  if(__hsEnter){
    // 按钮现在由CSS animation自动显示，这里不再setTimeout加show
    __hsEnter.addEventListener("click", function(){
      __hsIntroClicked = true;
      __hsFinishIntro();
    });
  }

  /* ===== 导航滚动状态 ===== */
  var nav = document.getElementById("nav");
  var heroBg = document.getElementById("heroBg");
  var prog = document.getElementById("progress");
  var ticking = false;
  function onScroll(){
    var y = window.scrollY || window.pageYOffset;
    nav.classList.toggle("scrolled", y > 40);
    var max = document.documentElement.scrollHeight - window.innerHeight;
    prog.style.width = (max > 0 ? Math.min(100, y / max * 100) : 0) + "%";
    if(heroBg && !reduceMotion && window.innerWidth >= 1024){
      var move = Math.min(y * 0.2, 180);
      heroBg.style.transform = "translate3d(0," + (-move) + "px,0)";
    }
    ticking = false;
  }
  window.addEventListener("scroll", function(){
    if(!ticking){ ticking = true; requestAnimationFrame(onScroll); }
  }, { passive:true });
  onScroll();

  /* ===== 锚点按钮 ===== */
  document.querySelectorAll("[data-scroll]").forEach(function(el){
    el.addEventListener("click", function(){
      var target = document.querySelector(el.getAttribute("data-scroll"));
      if(target){ target.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" }); }
    });
  });

  /* ===== 移动端菜单 ===== */
  var menuBtn = document.getElementById("menuBtn");
  var menuClose = document.getElementById("menuClose");
  var overlay = document.getElementById("menuOverlay");
  function setMenu(open){
    overlay.classList.toggle("open", open);
    menuBtn.setAttribute("aria-expanded", open ? "true" : "false");
    document.body.style.overflow = open ? "hidden" : "";
  }
  menuBtn.addEventListener("click", function(){ setMenu(true); });
  menuClose.addEventListener("click", function(){ setMenu(false); });
  overlay.querySelectorAll("a").forEach(function(a){
    a.addEventListener("click", function(){ setMenu(false); });
  });

  /* ===== 滚动显现 ===== */
  var revealEls = document.querySelectorAll("[data-reveal]");
  if("IntersectionObserver" in window && !reduceMotion){
    var ro = new IntersectionObserver(function(entries){
      entries.forEach(function(en){
        if(en.isIntersecting){ en.target.classList.add("in"); ro.unobserve(en.target); }
      });
    }, { threshold:.12, rootMargin:"0px 0px -6% 0px" });
    revealEls.forEach(function(el){ ro.observe(el); });
  } else {
    revealEls.forEach(function(el){ el.classList.add("in"); });
  }


  /* ===== 影像长卷 · 视频数据 ===== */
const VIDEOS = [
  {
    "p": "他过分野",
    "pk": "taguofenye",
    "m": "李尚书",
    "t": "第3集",
    "d": "1:32",
    "img": "assets/covers/poster-taguofenye-ep03.jpg",
    "u": "https://huanshantu.com/media/video_01.mp4",
    "ts": "2026-09-28 21:01:57 +0800"
  },
  {
    "p": "他过分野",
    "pk": "taguofenye",
    "m": "王奥",
    "t": "第1-3集",
    "d": "4:04",
    "img": "assets/covers/cover-taguofenye.jpg",
    "u": "https://huanshantu.com/media/video_02.mp4",
    "ts": "2026-09-28 21:01:57 +0800"
  },
  {
    "p": "工厂宣传",
    "pk": "gongchang",
    "m": "史顺棋",
    "t": "广告",
    "d": "0:27",
    "img": "assets/covers/cover-gongchang.jpg",
    "u": "https://huanshantu.com/media/video_03.mp4",
    "ts": "2026-09-28 21:01:57 +0800"
  },
  {
    "p": "工厂宣传",
    "pk": "gongchang",
    "m": "廖棋稚",
    "t": "工厂短片",
    "d": "0:39",
    "img": "assets/covers/cover-gongchang.jpg",
    "u": "https://huanshantu.com/media/video_04.mp4",
    "ts": "2026-09-28 21:01:57 +0800"
  },
  {
    "p": "工厂宣传",
    "pk": "gongchang",
    "m": "李尚书",
    "t": "第2集",
    "d": "0:30",
    "img": "assets/covers/poster-gongchang-ep02.jpg",
    "u": "https://huanshantu.com/media/video_05.mp4",
    "ts": "2026-09-28 21:01:57 +0800"
  },
  {
    "p": "工厂宣传",
    "pk": "gongchang",
    "m": "李尚书",
    "t": "第3集",
    "d": "1:03",
    "img": "assets/covers/cover-gongchang.jpg",
    "u": "https://huanshantu.com/media/video_06.mp4",
    "ts": "2026-09-28 21:01:57 +0800"
  },
  {
    "p": "工厂宣传",
    "pk": "gongchang",
    "m": "杨子琪",
    "t": "9月3日",
    "d": "0:23",
    "img": "assets/covers/cover-gongchang.jpg",
    "u": "https://huanshantu.com/media/video_07.mp4",
    "ts": "2026-09-28 21:01:57 +0800"
  },
  {
    "p": "工厂宣传",
    "pk": "gongchang",
    "m": "王奥",
    "t": "第9集",
    "d": "0:33",
    "img": "assets/covers/cover-gongchang.jpg",
    "u": "https://huanshantu.com/media/video_08.mp4",
    "ts": "2026-09-28 21:01:57 +0800"
  },
  {
    "p": "工厂宣传",
    "pk": "gongchang",
    "m": "郭子键",
    "t": "第8集",
    "d": "0:27",
    "img": "assets/covers/cover-gongchang.jpg",
    "u": "https://huanshantu.com/media/video_09.mp4",
    "ts": "2026-09-28 21:01:57 +0800"
  },
  {
    "p": "武林",
    "pk": "wulin",
    "m": "史顺棋",
    "t": "第一集",
    "d": "1:22",
    "img": "assets/covers/cover-wulin.jpg",
    "u": "https://huanshantu.com/media/video_10.mp4",
    "ts": "2026-09-28 21:01:57 +0800"
  },
  {
    "p": "武林",
    "pk": "wulin",
    "m": "王奥",
    "t": "第三集",
    "d": "1:10",
    "img": "assets/covers/cover-wulin.jpg",
    "u": "https://huanshantu.com/media/video_11.mp4",
    "ts": "2026-09-28 21:03:41 +0800"
  },
  {
    "p": "武林",
    "pk": "wulin",
    "m": "郭子键",
    "t": "第二集",
    "d": "1:38",
    "img": "assets/covers/cover-wulin.jpg",
    "u": "https://huanshantu.com/media/video_12.mp4",
    "ts": "2026-09-28 21:03:41 +0800"
  },
  {
    "p": "潮汐",
    "pk": "chaoxi",
    "m": "李尚书",
    "t": "第14集",
    "d": "1:45",
    "img": "assets/covers/poster-chaoxi-ep14.jpg",
    "u": "https://huanshantu.com/media/video_23.mp4",
    "ts": "2026-09-28 21:03:41 +0800"
  },
  {
    "p": "潮汐",
    "pk": "chaoxi",
    "m": "李尚书",
    "t": "第4集",
    "d": "1:19",
    "img": "assets/covers/poster-chaoxi-ep04.jpg",
    "u": "https://huanshantu.com/media/video_24.mp4",
    "ts": "2026-09-28 21:03:41 +0800"
  },
  {
    "p": "潮汐",
    "pk": "chaoxi",
    "m": "史顺棋",
    "t": "第16集",
    "d": "1:02",
    "img": "assets/covers/cover-chaoxi.jpg",
    "u": "https://huanshantu.com/media/video_13.mp4",
    "ts": "2026-09-28 21:03:41 +0800"
  },
  {
    "p": "潮汐",
    "pk": "chaoxi",
    "m": "史顺棋",
    "t": "第27集",
    "d": "0:57",
    "img": "assets/covers/cover-chaoxi.jpg",
    "u": "https://huanshantu.com/media/video_14.mp4",
    "ts": "2026-09-28 21:03:41 +0800"
  },
  {
    "p": "潮汐",
    "pk": "chaoxi",
    "m": "李尚书",
    "t": "39集",
    "d": "1:39",
    "img": "assets/covers/cover-chaoxi.jpg",
    "u": "https://huanshantu.com/media/video_22.mp4",
    "ts": "2026-09-28 21:03:41 +0800"
  },
  {
    "p": "潮汐",
    "pk": "chaoxi",
    "m": "史顺棋",
    "t": "第6集",
    "d": "1:35",
    "img": "assets/covers/cover-chaoxi.jpg",
    "u": "https://huanshantu.com/media/video_16.mp4",
    "ts": "2026-09-28 21:03:41 +0800"
  },
  {
    "p": "潮汐",
    "pk": "chaoxi",
    "m": "廖棋稚",
    "t": "9月15日",
    "d": "0:44",
    "img": "assets/covers/cover-chaoxi.jpg",
    "u": "https://huanshantu.com/media/video_17.mp4",
    "ts": "2026-09-28 21:03:41 +0800"
  },
  {
    "p": "潮汐",
    "pk": "chaoxi",
    "m": "廖棋稚",
    "t": "9月18日",
    "d": "0:56",
    "img": "assets/covers/cover-chaoxi.jpg",
    "u": "https://huanshantu.com/media/video_18.mp4",
    "ts": "2026-09-28 21:03:41 +0800"
  },
  {
    "p": "潮汐",
    "pk": "chaoxi",
    "m": "廖棋稚",
    "t": "9月20日",
    "d": "0:58",
    "img": "assets/covers/cover-chaoxi.jpg",
    "u": "https://huanshantu.com/media/video_19.mp4",
    "ts": "2026-09-28 21:03:41 +0800"
  },
  {
    "p": "潮汐",
    "pk": "chaoxi",
    "m": "廖棋稚",
    "t": "9月8日",
    "d": "1:37",
    "img": "assets/covers/cover-chaoxi.jpg",
    "u": "https://huanshantu.com/media/video_20.mp4",
    "ts": "2026-09-28 21:03:41 +0800"
  },
  {
    "p": "潮汐",
    "pk": "chaoxi",
    "m": "李尚书",
    "t": "24集",
    "d": "1:44",
    "img": "assets/covers/cover-chaoxi.jpg",
    "u": "https://huanshantu.com/media/video_21.mp4",
    "ts": "2026-09-28 21:03:41 +0800"
  },
  {
    "p": "潮汐",
    "pk": "chaoxi",
    "m": "史顺棋",
    "t": "第36集",
    "d": "0:45",
    "img": "assets/covers/cover-chaoxi.jpg",
    "u": "https://huanshantu.com/media/video_15.mp4",
    "ts": "2026-09-28 21:03:41 +0800"
  },
  {
    "p": "潮汐",
    "pk": "chaoxi",
    "m": "杨子琪",
    "t": "第19集",
    "d": "0:55",
    "img": "assets/covers/cover-chaoxi.jpg",
    "u": "https://huanshantu.com/media/video_25.mp4",
    "ts": "2026-09-28 21:03:41 +0800"
  },
  {
    "p": "潮汐",
    "pk": "chaoxi",
    "m": "杨子琪",
    "t": "第30集",
    "d": "1:17",
    "img": "assets/covers/cover-chaoxi.jpg",
    "u": "https://huanshantu.com/media/video_26.mp4",
    "ts": "2026-09-28 21:08:44 +0800"
  },
  {
    "p": "潮汐",
    "pk": "chaoxi",
    "m": "杨子琪",
    "t": "第31集",
    "d": "1:50",
    "img": "assets/covers/cover-chaoxi.jpg",
    "u": "https://huanshantu.com/media/video_27.mp4",
    "ts": "2026-09-28 21:08:44 +0800"
  },
  {
    "p": "潮汐",
    "pk": "chaoxi",
    "m": "杨子琪",
    "t": "第9集",
    "d": "0:39",
    "img": "assets/covers/cover-chaoxi.jpg",
    "u": "https://huanshantu.com/media/video_28.mp4",
    "ts": "2026-09-28 21:08:44 +0800"
  },
  {
    "p": "潮汐",
    "pk": "chaoxi",
    "m": "王奥",
    "t": "20集",
    "d": "1:29",
    "img": "assets/covers/cover-chaoxi.jpg",
    "u": "https://huanshantu.com/media/video_29.mp4",
    "ts": "2026-09-28 21:08:44 +0800"
  },
  {
    "p": "潮汐",
    "pk": "chaoxi",
    "m": "王奥",
    "t": "29集",
    "d": "0:41",
    "img": "assets/covers/cover-chaoxi.jpg",
    "u": "https://huanshantu.com/media/video_30.mp4",
    "ts": "2026-09-28 21:08:44 +0800"
  },
  {
    "p": "潮汐",
    "pk": "chaoxi",
    "m": "王奥",
    "t": "32集",
    "d": "1:13",
    "img": "assets/covers/cover-chaoxi.jpg",
    "u": "https://huanshantu.com/media/video_31.mp4",
    "ts": "2026-09-28 21:08:44 +0800"
  },
  {
    "p": "潮汐",
    "pk": "chaoxi",
    "m": "王奥",
    "t": "第10集",
    "d": "1:13",
    "img": "assets/covers/cover-chaoxi.jpg",
    "u": "https://huanshantu.com/media/video_32.mp4",
    "ts": "2026-09-28 21:08:44 +0800"
  },
  {
    "p": "潮汐",
    "pk": "chaoxi",
    "m": "郭子键",
    "t": "17集",
    "d": "1:12",
    "img": "assets/covers/cover-chaoxi.jpg",
    "u": "https://huanshantu.com/media/video_33.mp4",
    "ts": "2026-09-28 21:08:44 +0800"
  },
  {
    "p": "潮汐",
    "pk": "chaoxi",
    "m": "郭子键",
    "t": "28集",
    "d": "1:07",
    "img": "assets/covers/cover-chaoxi.jpg",
    "u": "https://huanshantu.com/media/video_34.mp4",
    "ts": "2026-09-28 21:08:44 +0800"
  },
  {
    "p": "潮汐",
    "pk": "chaoxi",
    "m": "郭子键",
    "t": "37集",
    "d": "1:24",
    "img": "assets/covers/cover-chaoxi.jpg",
    "u": "https://huanshantu.com/media/video_35.mp4",
    "ts": "2026-09-28 21:08:44 +0800"
  },
  {
    "p": "潮汐",
    "pk": "chaoxi",
    "m": "郭子键",
    "t": "7集",
    "d": "0:52",
    "img": "assets/covers/cover-chaoxi.jpg",
    "u": "https://huanshantu.com/media/video_36.mp4",
    "ts": "2026-09-28 21:08:44 +0800"
  },
  {
    "p": "眼镜店宣传",
    "pk": "yanjing",
    "m": "史顺棋",
    "t": "广告第3集",
    "d": "1:18",
    "img": "assets/covers/cover-yanjing.jpg",
    "u": "https://huanshantu.com/media/video_37.mp4",
    "ts": "2026-09-28 21:08:44 +0800"
  },
  {
    "p": "眼镜店宣传",
    "pk": "yanjing",
    "m": "廖棋稚",
    "t": "视频节点3",
    "d": "0:12",
    "img": "assets/covers/cover-yanjing.jpg",
    "u": "https://huanshantu.com/media/video_38.mp4",
    "ts": "2026-09-28 21:08:44 +0800"
  },
  {
    "p": "眼镜店宣传",
    "pk": "yanjing",
    "m": "杨子琪",
    "t": "9月21日",
    "d": "2:01",
    "img": "assets/covers/cover-yanjing.jpg",
    "u": "https://huanshantu.com/media/video_39.mp4",
    "ts": "2026-09-28 21:08:44 +0800"
  },
  {
    "p": "眼镜店宣传",
    "pk": "yanjing",
    "m": "王奥",
    "t": "眼镜店广告",
    "d": "0:43",
    "img": "assets/covers/cover-yanjing.jpg",
    "u": "https://huanshantu.com/media/video_40.mp4",
    "ts": "2026-09-28 21:08:44 +0800"
  },
  {
    "p": "眼镜店宣传",
    "pk": "yanjing",
    "m": "郭子键",
    "t": "广告2",
    "d": "1:01",
    "img": "assets/covers/cover-yanjing.jpg",
    "u": "https://huanshantu.com/media/video_41.mp4",
    "ts": "2026-09-28 21:08:44 +0800"
  },
  {
    "p": "房产 TVC",
    "pk": "tvc",
    "m": "史顺棋",
    "t": "房产 TVC",
    "d": "1:15",
    "img": "assets/covers/cover-tvc.jpg",
    "u": "https://huanshantu.com/media/video_42.mp4",
    "ts": "2026-09-28 21:08:44 +0800"
  },
  {
    "pk": "p1790673650687",
    "p": "《猫窝TVC》",
    "m": "郭子键",
    "t": "猫窝TVC",
    "img": "https://huanshantu.com/media/img_08.png",
    "u": "https://huanshantu.com/media/video_43.mp4",
    "ts": "2026-09-29 17:20:50 +0800"
  }
];
  const GALLERY = [
  {
    "img": "assets/concepts/concept-02.jpg",
    "t": "《浮屠城》",
    "k": "浮空都市 · 造物卷"
  },
  {
    "img": "assets/concepts/concept-03.jpg",
    "t": "《冰城声谶》",
    "k": "寒域声场 · 咒音卷"
  },
  {
    "img": "assets/concepts/concept-04.jpg",
    "t": "《悬圃仙山》",
    "k": "仙山悬圃 · 造物卷"
  },
  {
    "img": "assets/concepts/concept-05.jpg",
    "t": "《星屿》",
    "k": "星海孤屿 · 造物卷"
  },
  {
    "img": "assets/concepts/concept-06.jpg",
    "t": "《荒星》",
    "k": "荒漠行星 · 造物卷"
  },
  {
    "img": "assets/concepts/concept-07.jpg",
    "t": "《列屿》",
    "k": "磁浮之城 · 造物卷"
  },
  {
    "img": "assets/concepts/concept-08.jpg",
    "t": "《云轨》",
    "k": "云海轨道 · 造物卷"
  },
  {
    "img": "assets/concepts/concept-09.jpg",
    "t": "《盘天》",
    "k": "天线之城 · 造物卷"
  },
  {
    "img": "assets/concepts/concept-10.jpg",
    "t": "《灵根》",
    "k": "古木灵光 · 造物卷"
  },
  {
    "img": "https://huanshantu.com/media/img_20.png",
    "t": "《图》",
    "k": "其他"
  },
  {
    "img": "https://huanshantu.com/media/img_21.png",
    "t": "《图》",
    "k": "其他"
  },
{"img":"assets/ip/ip-beast.jpg","t":"讙山神兽 · 三视图","k":"IP 设定 · 讙山灵物"},{"img":"assets/ip/ip-cat.jpg","t":"讙山灵猫 · 三视图","k":"IP 设定 · 讙山灵物"}
];
  const CONCEPTS = [
  {
    "img": "https://huanshantu.com/media/img_09.jpg",
    "t": "情感类短片",
    "k": "其他",
    "u": "https://huanshantu.com/media/video_44.mp4",
    "m": "李尚书",
    "p": "其他",
    "ts": "2026-10-08 10:54:23 +0800"
  },
  {
    "img": "https://huanshantu.com/media/img_10.png",
    "t": "国风MV",
    "k": "其他",
    "u": "https://huanshantu.com/media/video_45.mp4",
    "m": "李尚书",
    "p": "其他",
    "ts": "2026-10-08 10:58:44 +0800"
  },
  {
    "img": "https://huanshantu.com/media/thumb_46.jpg",
    "t": "写真MV",
    "k": "其他",
    "u": "https://huanshantu.com/media/video_46.mp4",
    "u2": "https://huanshantu.com/media/video_47.mp4",
    "m": "李尚书",
    "p": "其他",
    "ts": "2026-10-08 11:00:15 +0800"
  },
  {
    "img": "https://huanshantu.com/media/thumb_48.jpg",
    "t": "一路同行",
    "k": "其他",
    "u": "https://huanshantu.com/media/video_48.mp4",
    "m": "李尚书",
    "p": "其他",
    "ts": "2026-10-08 11:06:08 +0800"
  },
  {
    "img": "https://huanshantu.com/media/thumb_49.jpg",
    "t": "回忆录",
    "k": "其他",
    "u": "https://huanshantu.com/media/video_49.mp4",
    "m": "龙",
    "p": "其他",
    "ts": "2026-10-08 11:41:00 +0800"
  },
  {
    "img": "https://huanshantu.com/media/thumb_51.jpg",
    "t": "情感短片",
    "k": "其他",
    "u": "https://huanshantu.com/media/video_51.mp4",
    "m": "郭",
    "p": "其他",
    "ts": "2026-10-08 13:18:07 +0800"
  },
  {
    "img": "https://huanshantu.com/media/thumb_50.jpg",
    "t": "TVC汽车",
    "k": "其他",
    "u": "https://huanshantu.com/media/video_50.mp4",
    "m": "艾文",
    "p": "其他",
    "ts": "2026-10-08 13:18:07 +0800"
  },
  {
    "img": "https://huanshantu.com/media/thumb_52.jpg",
    "t": "古风电视剧",
    "k": "其他",
    "u": "https://huanshantu.com/media/video_52.mp4",
    "m": "艾文",
    "p": "其他",
    "ts": "2026-10-08 13:18:07 +0800"
  }
];
  const PROJECTS = [
  {
    "k": "chaoxi",
    "n": "《潮汐》",
    "d": "克苏鲁海怪 · 暗黑奇幻剧集"
  },
  {
    "k": "gongchang",
    "n": "《工厂宣传》",
    "d": "实业纪实 · 企业形象"
  },
  {
    "k": "yanjing",
    "n": "《眼镜店宣传》",
    "d": "产品广告 · 门店形象"
  },
  {
    "k": "wulin",
    "n": "《武林》",
    "d": "武侠动作 · 古装短剧"
  },
  {
    "k": "taguofenye",
    "n": "《他过分野》",
    "d": "都市情感 · 系列短剧"
  },
  {
    "k": "tvc",
    "n": "《房产 TVC》",
    "d": "商业广告 · 房产宣传"
  },
  {
    "k": "p1790673650687",
    "n": "《猫窝TVC》",
    "d": "新卷 · 待编修归卷"
  },];
  var PRODUCERS = [
  "史顺棋",
  "李尚书",
  "王奥",
  "杨子琪",
  "郭子键",
  "廖棋稚",
  "艾文",
  "狄龙舞"
];
  const INBOX = [
  {
    "p": "其他",
    "m": "李尚书",
    "t": "弓箭手",
    "img": "https://huanshantu.com/media/img_01.jpg",
    "u": "",
    "ts": "2026-09-28 21:01:57 +0800"
  },
  {
    "p": "其他",
    "m": "测试",
    "t": "测试",
    "img": "https://huanshantu.com/media/img_02.png",
    "u": "",
    "ts": "2026-09-28 21:01:57 +0800"
  },
  {
    "p": "其他",
    "m": "杨子琪",
    "t": "图片 01",
    "img": "https://huanshantu.com/media/img_03.png",
    "u": "",
    "ts": "2026-09-28 21:01:57 +0800"
  },
  {
    "p": "其他",
    "m": "杨子琪",
    "t": "图片 02",
    "img": "https://huanshantu.com/media/img_04.png",
    "u": "",
    "ts": "2026-09-28 21:01:57 +0800"
  },
  {
    "p": "其他",
    "m": "杨子琪",
    "t": "图片 03",
    "img": "https://huanshantu.com/media/img_05.png",
    "u": "",
    "ts": "2026-09-28 21:01:57 +0800"
  },
  {
    "p": "其他",
    "m": "杨子琪",
    "t": "图片 04",
    "img": "https://huanshantu.com/media/img_06.png",
    "u": "",
    "ts": "2026-09-28 21:01:57 +0800"
  },
  {
    "p": "其他",
    "m": "杨子琪",
    "t": "图片 05",
    "img": "https://huanshantu.com/media/img_07.png",
    "u": "",
    "ts": "2026-09-28 21:01:57 +0800"
  },
  {
    "pk": "",
    "p": "其他",
    "m": "测试",
    "t": "测试",
    "img": "https://huanshantu.com/media/carry_GMPz1n_mmexport1782447745382.jpg",
    "u": "",
    "ts": "2026-09-29 00:05:30 +0800"
  },
  {
    "p": "其他",
    "m": "李尚书",
    "t": "图 01",
    "img": "https://huanshantu.com/media/img_11.png",
    "u": "",
    "ts": "2026-10-08 13:18:07 +0800"
  },
  {
    "p": "其他",
    "m": "李尚书",
    "t": "图 02",
    "img": "https://huanshantu.com/media/img_12.png",
    "u": "",
    "ts": "2026-10-08 13:18:07 +0800"
  },
  {
    "p": "其他",
    "m": "李尚书",
    "t": "图 03",
    "img": "https://huanshantu.com/media/img_13.png",
    "u": "",
    "ts": "2026-10-08 13:18:07 +0800"
  },
  {
    "p": "其他",
    "m": "李尚书",
    "t": "图 04",
    "img": "https://huanshantu.com/media/img_14.png",
    "u": "",
    "ts": "2026-10-08 13:18:07 +0800"
  },
  {
    "p": "其他",
    "m": "李尚书",
    "t": "图 05",
    "img": "https://huanshantu.com/media/img_15.png",
    "u": "",
    "ts": "2026-10-08 13:18:07 +0800"
  },
  {
    "p": "其他",
    "m": "李尚书",
    "t": "图 06",
    "img": "https://huanshantu.com/media/img_16.png",
    "u": "",
    "ts": "2026-10-08 13:18:07 +0800"
  },
  {
    "p": "其他",
    "m": "李尚书",
    "t": "图 07",
    "img": "https://huanshantu.com/media/img_17.png",
    "u": "",
    "ts": "2026-10-08 13:18:07 +0800"
  },
  {
    "p": "其他",
    "m": "李尚书",
    "t": "图 08",
    "img": "https://huanshantu.com/media/img_18.png",
    "u": "",
    "ts": "2026-10-08 13:18:07 +0800"
  },
  {
    "p": "其他",
    "m": "李尚书",
    "t": "图 09",
    "img": "https://huanshantu.com/media/img_19.jpg",
    "u": "",
    "ts": "2026-10-08 13:18:07 +0800"
  },
  {
    "pk": "p_other",
    "p": "其他",
    "m": "王",
    "t": "写真",
    "img": "assets/brand/logo-totem.png",
    "u": "https://huanshantu.com/media/video_53.mp4"
  }
];
  const FEATURED = [];
  const FEATURED_QUEUE = [];
  function cardHTML(v, feat){
    var svg = '<svg viewBox="0 0 24 24" fill="none"><path d="M8 5v14l11-7z"/></svg>';
    var i = VIDEOS.indexOf(v);
    var isImg = !v.u;
    return '<button class="vg-card' + (feat ? " vg-feat" : "") + '" data-vi="' + i + '" aria-label="' + (isImg ? "查看" : "播放") + ' ' + v.p + ' ' + v.t + '">' +
      '<span class="vg-poster"><img src="' + (v.img||"assets/brand/logo-totem.png") + '" alt="' + v.p + ' · ' + v.t + '" loading="lazy" onerror="this.onerror=null;this.src=&apos;assets/brand/logo-totem.png&apos;">' +
      (isImg ? '<span class="vg-badge">' + (feat ? "精品" : v.p) + '</span>' : '<span class="vg-play">' + svg + '</span><span class="vg-badge">' + (feat ? "精品" : v.p) + '</span>') + '</span>' +
      '<span class="vg-meta"><h4>' + v.t + '</h4>' +
      '<span class="vg-sub"><span class="vg-member">' + (v.m ? v.m + " · " : "") + v.p + '</span><span class="vg-dur">' + v.d + '</span></span></span></button>';
  }
  var vgArchive = document.getElementById("vgArchive");
  var rest = VIDEOS;
  function renderArchive(){
    var html = '<div class="vg-head"><div><span class="vg-no">VOL. 01</span><h3>全卷收录</h3></div><span class="vg-count">' + rest.length + ' 卷 · 按项目编目</span></div>';
    var VOL_LIMIT = 10;
    PROJECTS.forEach(function(proj, pidx){
      var list = rest.filter(function(v){ return v.pk === proj.k; });
      var isEmpty = !list.length;
      var isFirst = pidx === 0;
      var gridHTML;
      if(isEmpty){
        gridHTML = '<div class="vg-empty">新卷待收 · 上呈作品归入此卷后展陈</div>';
      } else {
        var shown = list.slice(0, VOL_LIMIT).map(function(v){ return cardHTML(v, false); }).join("");
        if(list.length > VOL_LIMIT){
          var extra = list.slice(VOL_LIMIT).map(function(v){ return cardHTML(v, false); }).join("");
          shown += '<div class="vg-extra-wrap" style="grid-column:1/-1">' +
            '<div class="vg-extra" style="display:none">' + extra + '</div>' +
            '<button class="vg-more-btn" style="display:block;width:100%;padding:14px;margin-top:8px;background:transparent;border:1px solid rgba(212,175,55,.3);color:var(--ink-gold);font-size:11px;letter-spacing:.22em;cursor:pointer;border-radius:2px">展开其余 ' + (list.length - VOL_LIMIT) + ' 部 ▾</button>' +
            '</div>';
        }
        gridHTML = shown;
      }
      html += '<div class="vg-block' + (pidx>0?' collapsed':'') + '" data-vgroup="' + proj.k + '">' +
        '<div class="vg-head" role="button" aria-expanded="' + (pidx===0?'true':'false') + '"><div><span class="vg-no">' + ("0" + (pidx + 1)).slice(-2) + '</span><h3>' + proj.n + '</h3></div>' +
        '<span class="vg-count">' + proj.d + ' · ' + (isEmpty ? "待归卷" : list.length + " 卷") + '</span>' +
        '<svg class="vg-toggle" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg></div>' +
        '<div class="vg-grid">' + gridHTML + '</div></div>';
    });
    vgArchive.innerHTML = html;
    // 绑定每卷的"展开更多"
    vgArchive.querySelectorAll(".vg-more-btn").forEach(function(btn){
      btn.addEventListener("click", function(e){
        e.stopPropagation();
        var wrap = btn.closest(".vg-extra-wrap");
        var extra = wrap.querySelector(".vg-extra");
        if(extra.style.display === "none"){
          extra.style.display = "grid";
          extra.style.gridTemplateColumns = "repeat(5,1fr)";
          extra.style.gap = "var(--space-4)";
          btn.textContent = "收起 ▴";
        } else {
          extra.style.display = "none";
          btn.textContent = btn.textContent.replace("收起 ▴", "展开其余");
        }
      });
    });
  }
  var vgInbox = document.getElementById("inboxStrip");
  var inboxCount = document.getElementById("inboxCount");
  function renderInbox(){
    if(!vgInbox)return;
    if(!INBOX.length){
      vgInbox.innerHTML = '<div class="inbox-empty">新作将在此等候归卷 · 管理卷宗中「上呈合集」可收录新作</div>';
      if(inboxCount)inboxCount.textContent = '0 件新作 · 待编修归卷';
      return;
    }
    var withIdx = INBOX.map(function(v,i){ return {v:v,i:i}; });
    var vids = withIdx.filter(function(x){ return x.v.u; });
    var imgs = withIdx.filter(function(x){ return !x.v.u; });
    function group(list, label, empty){
      if(!list.length){
        return '<div class="inbox-group"><div class="inbox-gtitle">' + label + ' <span class="inbox-gcount">0</span></div>' +
          '<div class="inbox-empty small">' + empty + '</div></div>';
      }
      var cards = list.map(function(x){
        var v = x.v; var oi = x.i;
        var img = v.img || 'assets/brand/logo-totem.png';
        var pname = v.p || '未命名';
        var t = v.t || '';
        var sub = (v.m ? v.m + ' · ' : '') + (v.d || '');
        return '<button class="inbox-card'+(v.p==='旧作待处理'?' inbox-old-card':'')+'" data-ii="' + oi + '" aria-label="查看新作 ' + pname + '">' +
          '<span class="inbox-poster"><img src="' + img + '" alt="' + pname + ' · ' + t + '" loading="lazy" onerror="this.onerror=null;this.src=&apos;assets/brand/logo-totem.png&apos;">' +
          '<span class="inbox-new'+(v.p==='旧作待处理'?' old':'')+'">'+(v.p==='旧作待处理'?'旧':'新')+'</span></span>' +
          '<span class="inbox-meta"><h4>' + (t || pname) + '</h4><span>' + sub + '</span></span></button>';
      }).join('');
      return '<div class="inbox-group"><div class="inbox-gtitle">' + label + ' <span class="inbox-gcount">' + list.length + '</span></div>' +
        '<div class="inbox-strip">' + cards + '</div></div>';
    }
    if(inboxCount)inboxCount.textContent = INBOX.length + ' 件新作 · 待编修归卷';
    vgInbox.innerHTML = group(vids, '视频栏', '暂无视频新作') + group(imgs, '图片栏', '暂无图片新作');
  }
  var inboxSec = document.getElementById("inbox");
  var inboxHeadEl = document.getElementById("inboxHead");
  if(inboxHeadEl && inboxSec){
    inboxHeadEl.addEventListener("click", function(){
      var collapsed = inboxSec.classList.toggle("collapsed");
      inboxHeadEl.setAttribute("aria-expanded", collapsed ? "false" : "true");
    });
    inboxHeadEl.addEventListener("keydown", function(e){
      if(e.key === "Enter" || e.key === " "){ e.preventDefault(); inboxHeadEl.click(); }
    });
  }
  renderArchive(); renderInbox(); updateStaticCounts();
  /* 项目筛选（动态渲染：新增项目自动加标签） */
  function renderFilters(){
    var fw = document.getElementById("vFilters");
    if(!fw)return;
    var firstK = PROJECTS.length ? PROJECTS[0].k : "";
    var html = PROJECTS.map(function(pr, idx){
      return '<button class="vfilter' + (idx===0?' active':'') + '" data-vfilter="' + pr.k + '" role="tab" aria-selected="' + (idx===0?'true':'false') + '">' + pr.n.replace(/[《》]/g,"") + '</button>';
    }).join("");
    fw.innerHTML = html;
    var vfilters = Array.prototype.slice.call(fw.querySelectorAll(".vfilter"));
    function applyFilter(f){
      var blocks = document.querySelectorAll("#vgArchive .vg-block");
      blocks.forEach(function(b){
        b.style.display = (b.dataset.vgroup === f) ? "" : "none";
        if(b.dataset.vgroup === f){
          b.classList.remove("collapsed");
          var h2 = b.querySelector(".vg-head");
          if(h2){ h2.setAttribute("aria-expanded", "true"); }
          var c2 = b.querySelector(".vg-count");
          if(c2){
            var tx = c2.textContent;
            if(tx.indexOf("点此展卷") > -1){ c2.textContent = tx.replace("点此展卷", "点此合卷"); }
          }
        }
      });
    }
    vfilters.forEach(function(btn){
      btn.addEventListener("click", function(){
        vfilters.forEach(function(b){ b.classList.remove("active"); b.setAttribute("aria-selected","false"); });
        btn.classList.add("active"); btn.setAttribute("aria-selected","true");
        applyFilter(btn.dataset.vfilter);
      });
    });
    // 默认只显示第一卷
    if(firstK) applyFilter(firstK);
  }
  renderFilters();
  var videosSec = document.getElementById("videos");
  var videosHeadEl = document.getElementById("videosHead");
  if(videosSec && videosHeadEl){
    videosHeadEl.addEventListener("click", function(e){
      if(e.target.closest(".vfilter")){ return; }
      var collapsed = videosSec.classList.toggle("collapsed");
      videosHeadEl.setAttribute("aria-expanded", collapsed ? "false" : "true");
    });
    videosHeadEl.addEventListener("keydown", function(e){
      if(e.key === "Enter" || e.key === " "){ e.preventDefault(); videosHeadEl.click(); }
    });
  }
  var worksSec = document.getElementById("works");
  var worksHeadEl = document.getElementById("worksHead");
  if(worksSec && worksHeadEl){
    worksHeadEl.addEventListener("click", function(e){
      if(e.target.closest(".filter")){ return; }
      var c = worksSec.classList.toggle("collapsed");
      worksHeadEl.setAttribute("aria-expanded", c ? "false" : "true");
    });
    worksHeadEl.addEventListener("keydown", function(e){
      if(e.key === "Enter" || e.key === " "){ e.preventDefault(); worksHeadEl.click(); }
    });
  }
  /* 概念画廊渲染 */
  var conceptGrid = document.getElementById("conceptGrid");
  function renderConcepts(){
    if(!conceptGrid)return;
    conceptGrid.innerHTML = CONCEPTS.map(function(c, i){
      var imgSrc=(c.img||'assets/brand/logo-totem.png');
      var isImg = !c.u;
      return '<button class="cg-card" data-ci="' + i + '" aria-label="' + (isImg ? '查看' : '播放') + '概念 ' + (c.t||'') + '">' +
        '<figure><img src="' + imgSrc + '" alt="' + (c.t||'') + '" loading="lazy" onerror="this.onerror=null;this.src=&apos;assets/brand/logo-totem.png&apos;">' +
        (isImg ? '' : '<span class="cg-play"><svg viewBox="0 0 24 24" fill="none"><path d="M8 5v14l11-7z"/></svg></span>') +
        '<figcaption><b>' + (c.t||'') + '</b><span>' + (c.k||'') + '</span></figcaption></figure></button>';
    }).join("");
  }
  renderConcepts();
  /* 图藏卷 · 图谱渲染（纯图） */
  var galleryGrid = document.getElementById("galleryGrid");
  var GALLERY_LIMIT = 16;
  function galleryCardHTML(c, i){
    var imgSrc=(c.img||'assets/brand/logo-totem.png');
    return '<button class="cg-card gl-card" data-gi="' + i + '" aria-label="查看图谱 ' + (c.t||'') + '">' +
      '<figure><img src="' + imgSrc + '" alt="' + (c.t||'') + '" loading="lazy" onerror="this.onerror=null;this.src=&apos;assets/brand/logo-totem.png&apos;">' +
      '<figcaption><b>' + (c.t||'') + '</b><span>' + (c.k||'') + '</span></figcaption></figure></button>';
  }
  function renderGallery(){
    if(!galleryGrid)return;
    if(!GALLERY.length){
      galleryGrid.innerHTML = '<div class="inbox-empty">图藏卷 · 待编修入藏</div>';
      return;
    }
    var html = GALLERY.slice(0, GALLERY_LIMIT).map(function(c, i){ return galleryCardHTML(c, i); }).join("");
    if(GALLERY.length > GALLERY_LIMIT){
      var rest = GALLERY.slice(GALLERY_LIMIT).map(function(c, i){ return galleryCardHTML(c, i + GALLERY_LIMIT); }).join("");
      html += '<div class="gallery-more-wrap" style="grid-column:1/-1">' +
        '<div class="gallery-extra" style="display:none">' + rest + '</div>' +
        '<button class="gallery-toggle" style="display:block;width:100%;padding:18px;margin-top:8px;background:transparent;border:1px solid rgba(212,175,55,.35);color:var(--ink-gold);font-size:12px;letter-spacing:.25em;cursor:pointer;border-radius:2px">展开全部 ' + GALLERY.length + ' 帧 ▾</button>' +
        '</div>';
    }
    galleryGrid.innerHTML = html;
    var toggle = galleryGrid.querySelector(".gallery-toggle");
    if(toggle){
      toggle.addEventListener("click", function(){
        var extra = galleryGrid.querySelector(".gallery-extra");
        if(extra.style.display === "none"){ extra.style.display = "grid"; extra.style.gridTemplateColumns = "repeat(4,1fr)"; extra.style.gap = "var(--space-4)"; toggle.textContent = "收起 ▴"; }
        else { extra.style.display = "none"; toggle.textContent = "展开全部 " + GALLERY.length + " 帧 ▾"; }
      });
    }
  }
  renderGallery();
  /* 藏卷四部 · 精选渲染 */
  var featGrid = document.getElementById("featuredGrid");
  var featCountTitle = document.getElementById("featCountTitle");
  function renderFeatured(){
    if(!featGrid)return;
    if(!FEATURED.length){
      featGrid.innerHTML = '<div class="inbox-empty">四部之最 · 待主理人甄选上架</div>';
      if(featCountTitle){ featCountTitle.textContent = '四部之最 · 馆藏甄选'; }
      return;
    }
    var svgIco='<svg viewBox="0 0 24 24" fill="none"><path d="M8 5v14l11-7z"/></svg>';
    featGrid.innerHTML = FEATURED.map(function(v,i){
      var isImg = !v.u;
      return '<button class="feat-card" data-fi="' + i + '" aria-label="' + (isImg ? '查看' : '播放') + ' ' + v.p + ' ' + v.t + '">' +
        '<img src="' + (v.img||"assets/brand/logo-totem.png") + '" alt="' + v.p + ' · ' + v.t + '" loading="lazy" onerror="this.onerror=null;this.src=&apos;assets/brand/logo-totem.png&apos;">' +
        (isImg ? '' : '<span class="feat-play">' + svgIco + '</span>') +
        '<span class="feat-badge">' + (isImg ? '图' : '影') + '</span>' +
        '<span class="feat-meta"><h4>' + v.t + '</h4><span>' + (v.m ? v.m + ' · ' : '') + v.p + '</span></span></button>';
    }).join("");
    if(featCountTitle){ featCountTitle.textContent = FEATURED.length + ' 件甄选 · 四部之最'; }
  }
  renderFeatured();
  /* 点击委托：视频卡 / 概念卡 */
  var lbVideoWrap = document.getElementById("lbVideoWrap");
  var lbVideo = document.getElementById("lbVideo");
  document.addEventListener("click", function(e){
    var card = e.target.closest(".vg-card");
    if(card){
      var vi = Number(card.dataset.vi);
      if(!isNaN(vi) && VIDEOS[vi]){
        if(VIDEOS[vi].u){ openVideoLightbox(VIDEOS[vi]); }
        else{ openArchiveImageLightbox(VIDEOS[vi]); }
      }
      return;
    }
    var cg = e.target.closest(".cg-card");
    if(cg){
      if(cg.classList.contains("gl-card")){
        var gi = Number(cg.dataset.gi);
        if(!isNaN(gi) && GALLERY[gi]){ openGalleryLightbox(gi); }
        return;
      }
      var ci = Number(cg.dataset.ci);
      if(!isNaN(ci) && CONCEPTS[ci]){ openConceptLightbox(ci); }
      return;
    }
    var fc = e.target.closest(".feat-card");
    if(fc){
      var fi = Number(fc.dataset.fi);
      if(!isNaN(fi) && window.FEATURED[fi]){
        if(window.FEATURED[fi].u){ openVideoLightbox(window.FEATURED[fi]); }
        else{ openArchiveImageLightbox(window.FEATURED[fi]); }
      }
      return;
    }
    var ib = e.target.closest(".inbox-card");
    if(ib){
      var ii = Number(ib.dataset.ii);
      if(!isNaN(ii) && INBOX[ii]){
        if(INBOX[ii].u){ openVideoLightbox(INBOX[ii]); }
        else if(INBOX[ii].img){ openInboxImageLightbox(INBOX[ii]); }
      }
      return;
    }
    var vh = e.target.closest(".vg-head");
    if(vh){
      var blk = vh.closest(".vg-block");
      if(blk){
        var willOpen = blk.classList.contains("collapsed");
        var vblocks = document.querySelectorAll("#vgArchive .vg-block");
        vblocks.forEach(function(b){
          if(b === blk){ return; }
          if(!b.classList.contains("collapsed")){
            b.classList.add("collapsed");
            var h2 = b.querySelector(".vg-head");
            if(h2){ h2.setAttribute("aria-expanded", "false"); }
            var c2 = b.querySelector(".vg-count");
            if(c2){
              var tx = c2.textContent;
              if(tx.indexOf("点此合卷") > -1){ c2.textContent = tx.replace("点此合卷", "点此展卷"); }
            }
          }
        });
        if(willOpen){
          blk.classList.remove("collapsed");
          vh.setAttribute("aria-expanded", "true");
          var cnt = blk.querySelector(".vg-count");
          if(cnt){
            var t2 = cnt.textContent;
            if(t2.indexOf("点此展卷") > -1){ cnt.textContent = t2.replace("点此展卷", "点此合卷"); }
          }
        }else{
          blk.classList.add("collapsed");
          vh.setAttribute("aria-expanded", "false");
          var cnt2 = blk.querySelector(".vg-count");
          if(cnt2){
            var t3 = cnt2.textContent;
            if(t3.indexOf("点此合卷") > -1){ cnt2.textContent = t3.replace("点此合卷", "点此展卷"); }
          }
        }
      }
      return;
    }
  });
  function openVideoLightbox(v){
    if(lbVideo){ lbVideo.pause(); lbVideo.removeAttribute("src"); lbVideo.load(); }
    lbVideo.src = v.u; lbVideo.poster = v.img; lbVideo.preload = "auto";
    lbTitle.textContent = v.t;
    lbCat.textContent = v.p;
    lbMeta.textContent = (v.m ? v.m + " · " : "") + v.d;
    lbDesc.textContent = "影像长卷 · 馆藏展陈，点击播放，全屏可览全貌。";
    lbFigure.style.display = "none";
    lbVideoWrap.hidden = false;
    lightbox.classList.remove("pure-image");
    lightbox.classList.add("video-mode");
    lightbox.classList.add("open");
    document.body.style.overflow = "hidden";
    // 等缓冲够了再播，期间显示poster封面
    if(lbVideo){
      var _started=false;
      var _tp=function(){ if(!_started){_started=true; lbVideo.play().catch(function(){});} };
      lbVideo.addEventListener("canplay", _tp, {once:true});
      setTimeout(_tp, 6000);
    }
    var lbCloseBtn = document.getElementById("lbClose");
    if(lbCloseBtn){ lbCloseBtn.focus(); }
  }
  function openConceptLightbox(i){
    var c = CONCEPTS[i];
    if(c.u){
      if(lbVideo){ lbVideo.pause(); lbVideo.removeAttribute("src"); lbVideo.load(); }
      lbVideo.src = c.u; lbVideo.poster = c.img;
      lbTitle.textContent = c.t;
      lbCat.textContent = "幻境卷 · 概念造物";
      lbMeta.textContent = (c.m ? c.m + " · " : "") + c.k;
      lbDesc.textContent = "幻境卷影像 · 编修司收存，点击播放，全屏可览全貌。";
      lbFigure.style.display = "none";
      lbVideoWrap.hidden = false;
      lightbox.classList.remove("pure-image");
    lightbox.classList.remove("pure-image");
    lightbox.classList.add("video-mode");
    }else{
      lightbox.classList.add("pure-image");
      var img = document.createElement("img");
      img.src = c.img; img.alt = c.t;
      lbFigure.innerHTML = ""; lbFigure.appendChild(img);
      lbFigure.style.display = "";
      if(lbVideo){ lbVideo.pause(); lbVideo.removeAttribute("src"); lbVideo.load(); }
      lbVideoWrap.hidden = true;
      lbTitle.textContent = c.t;
      lbCat.textContent = "幻境卷 · 概念造物";
      lbMeta.textContent = c.k;
      lbDesc.textContent = "AI 概念原画 · 编修司收存，点击图片可全屏细览。";
      lightbox.classList.remove("video-mode");
    }
    lightbox.classList.add("open");
    document.body.style.overflow = "hidden";
    var lbCloseBtn = document.getElementById("lbClose");
    if(lbCloseBtn){ lbCloseBtn.focus(); }
    if(lbVideo && c.u){ lbVideo.play().catch(function(){}); }
  }
  var lbGalleryMode = false;
  function openGalleryLightbox(i){
    lightbox.classList.add("pure-image");
    lbGalleryMode = true;
    visibleIndexes = [];
    for(var gi=0; gi<GALLERY.length; gi++){ visibleIndexes.push(gi); }
    lbPos = i;
    var c = GALLERY[i];
    var img = document.createElement("img");
    img.src = c.img; img.alt = c.t;
    lbFigure.innerHTML = ""; lbFigure.appendChild(img);
    lbFigure.style.display = "";
    if(lbVideo){ lbVideo.pause(); lbVideo.removeAttribute("src"); lbVideo.load(); }
    lbVideoWrap.hidden = true;
    lbTitle.textContent = c.t;
    lbCat.textContent = "图藏卷 · 图谱典藏";
    lbMeta.textContent = (c.m ? c.m + " · " : "") + (c.k || "");
    lbDesc.textContent = "图谱原画 · 编修司收存，点击图片可全屏细览。";
    lightbox.classList.remove("video-mode");
    lightbox.classList.add("open");
    document.body.style.overflow = "hidden";
    var lbCloseBtn = document.getElementById("lbClose");
    if(lbCloseBtn){ lbCloseBtn.focus(); }
    var lbCounter = document.getElementById("lbCounter");
    if(lbCounter){ lbCounter.textContent = ("0" + (i+1)).slice(-2) + " / " + ("0" + GALLERY.length).slice(-2); }
  }
  function openArchiveImageLightbox(v){
    visibleIndexes = []; lbPos = 0;
    lightbox.classList.add("pure-image");
    var img = document.createElement("img");
    img.src = v.img; img.alt = v.t;
    lbFigure.innerHTML = ""; lbFigure.appendChild(img);
    lbFigure.style.display = "";
    if(lbVideo){ lbVideo.pause(); lbVideo.removeAttribute("src"); lbVideo.load(); }
    lbVideoWrap.hidden = true;
    lbTitle.textContent = v.t;
    lbCat.textContent = v.p;
    lbMeta.textContent = (v.m ? v.m + " · " : "") + v.d;
    lbDesc.textContent = "影像长卷 · 馆藏展陈，点击图片可全屏细览。";
    lightbox.classList.remove("video-mode");
    lightbox.classList.add("open");
    document.body.style.overflow = "hidden";
    var lbCloseBtn = document.getElementById("lbClose");
    if(lbCloseBtn){ lbCloseBtn.focus(); }
  }
  function openInboxImageLightbox(v){
    visibleIndexes = []; lbPos = 0;
    lightbox.classList.add("pure-image");
    var img = document.createElement("img");
    img.src = v.img; img.alt = v.t;
    lbFigure.innerHTML = ""; lbFigure.appendChild(img);
    lbFigure.style.display = "";
    if(lbVideo){ lbVideo.pause(); lbVideo.removeAttribute("src"); lbVideo.load(); }
    lbVideoWrap.hidden = true;
    lbTitle.textContent = v.t;
    lbCat.textContent = v.p;
    lbMeta.textContent = (v.m ? v.m + " · " : "") + v.d;
    lbDesc.textContent = "AI 新作 · 待归卷收存，点击图片可全屏细览。";
    lightbox.classList.remove("video-mode");
    lightbox.classList.add("open");
    document.body.style.overflow = "hidden";
    var lbCloseBtn = document.getElementById("lbClose");
    if(lbCloseBtn){ lbCloseBtn.focus(); }
  }

  /* ===== 馆藏目录 + 展陈 ===== */
  var filters = document.querySelectorAll(".filter");
  var idxItems = Array.prototype.slice.call(document.querySelectorAll(".idx-item"));
  var stageImg = document.getElementById("stageImg");
  var stageFrame = document.getElementById("stageFrame");
  var stageCat = document.getElementById("stageCat");
  var stageNo = document.getElementById("stageNo");
  var stageTitle = document.getElementById("stageTitle");
  var stageMeta = document.getElementById("stageMeta");
  var stageDesc = document.getElementById("stageDesc");
  var WORK_IMAGES = ["assets/work-01.jpg","assets/work-02.jpg","assets/work-03.jpg","assets/work-04.jpg","assets/work-05.jpg","assets/work-06.jpg"];
  var WORKS = [
    { key:"film", no:"卷·甲寅", title:"《雨夜行》", cat:"影像卷 · 志怪短片", meta:"志怪短片 · 02:47 · 2026", img:"assets/work-01.jpg",
      desc:"夜雨中的都市异闻：一位无名旅人穿行于霓虹与雨幕之间，身后有物随行。全片由 AI 生成，编修司完成节奏与调色。" },
    { key:"visual", no:"卷·丙辰", title:"《巨灵》", cat:"图谱卷 · 概念主视觉", meta:"概念艺术 · 品牌主视觉 · 2026", img:"assets/work-02.jpg",
      desc:"沙海中沉睡的巨灵侧影，为品牌世界观绘制的概念主视觉。AI 起稿，人工校勘肌理与光。" },
    { key:"music", no:"卷·丁巳", title:"《谶声》", cat:"咒音卷 · 专辑视觉", meta:"单曲视觉 · 动态封面 · 2026", img:"assets/work-03.jpg",
      desc:"为电子专辑《谶声》绘制的动态封面。声波被转译为金与暗的涟漪，如谶语成形。" },
    { key:"3d", no:"卷·戊午", title:"《云上城》", cat:"造物卷 · 幻境造景", meta:"3D 场景 · 虚拟发布 · 2026", img:"assets/work-04.jpg",
      desc:"云海之上的城郭。AI 生成的 3D 幻境，用于虚拟发布会与空间漫游，观众可走入其中。" },
    { key:"film", no:"卷·己未", title:"《凝光》", cat:"影像卷 · 器物志", meta:"概念广告 · 30s · 2026", img:"assets/work-05.jpg",
      desc:"一件被光收存的器物。以单一光源与静物叙事，三十秒成篇，写尽器物的气质。" },
    { key:"visual", no:"卷·庚申", title:"《萤夜》", cat:"图谱卷 · 草木志", meta:"生成艺术 · 实验项目 · 2025", img:"assets/work-06.jpg",
      desc:"深林萤夜，草木生光。生成艺术实验：让 AI 重新想象山野间的夜。" }
  ];
  window.GANZHI=['甲子','乙丑','丙寅','丁卯','戊辰','己巳','庚午','辛未','壬申','癸酉','甲戌','乙亥','丙子','丁丑','戊寅','己卯','庚辰','辛巳','壬午','癸未','甲申','乙酉','丙戌','丁亥','戊子','己丑','庚寅','辛卯','壬辰','癸巳','甲午','乙未','丙申','丁酉','戊戌','己亥','庚子','辛丑','壬寅','癸卯','甲辰','乙巳','丙午','丁未','戊申','己酉','庚戌','辛亥','壬子','癸丑','甲寅','乙卯','丙辰','丁巳','戊午','己未','庚申','辛酉','壬戌','癸亥'];
  var activeFilter='all';
  var catalogIndexEl=document.getElementById('catalogIndex');
  var lbStripEl=document.getElementById('lbStrip');
  var worksCountTitle=document.getElementById('worksCountTitle');
  function workImg(i){var w=WORKS[i];return (w&&w.img)||WORK_IMAGES[i%WORK_IMAGES.length];}
  function renderCatalogIndex(){
    if(!catalogIndexEl)return;
    catalogIndexEl.innerHTML='';
    WORKS.forEach(function(w,i){
      var b=document.createElement('button');
      b.className='idx-item'+(i===0?' active':'');
      b.setAttribute('data-index',i);
      b.setAttribute('data-key',w.key||'film');
      b.setAttribute('role','button');
      b.setAttribute('aria-label','查看作品'+(w.title||'')+'详情');
      b.innerHTML='<span class="idx-marker"></span><span class="idx-no">'+(w.no||'卷')+'</span><span class="idx-title">'+(w.title||'')+'</span><span class="idx-cat">'+(w.cat||'')+'</span>';
      b.addEventListener('mouseenter',function(){setStage(Number(this.dataset.index));});
      b.addEventListener('click',function(){var k=Number(this.dataset.index);setStage(k);openLightbox(k);});
      b.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();var k=Number(this.dataset.index);setStage(k);openLightbox(k);}});
      catalogIndexEl.appendChild(b);
    });
    idxItems=Array.prototype.slice.call(catalogIndexEl.querySelectorAll('.idx-item'));
  }
  function renderThumbs(){
    if(!lbStripEl)return;
    lbStripEl.innerHTML='';
    WORKS.forEach(function(w,i){
      var b=document.createElement('button');
      b.className='lb-thumb';
      b.setAttribute('data-i',i);
      b.setAttribute('aria-label',w.title||'');
      var im=document.createElement('img');im.src=workImg(i);im.alt='';
      b.appendChild(im);
      b.addEventListener('click',function(){openLightbox(Number(this.dataset.i));});
      lbStripEl.appendChild(b);
    });
    stripThumbs=Array.prototype.slice.call(lbStripEl.querySelectorAll('.lb-thumb'));
  }
  function renderWorks(){
    renderCatalogIndex();
    renderThumbs();
    visibleIndexes=[];
    for(var wi=0;wi<WORKS.length;wi++){if(activeFilter==='all'||WORKS[wi].key===activeFilter){visibleIndexes.push(wi)}}
    if(stageIndex>=WORKS.length||visibleIndexes.indexOf(stageIndex)<0){stageIndex=visibleIndexes.length?visibleIndexes[0]:0}
    setStage(stageIndex);
    if(worksCountTitle){worksCountTitle.textContent='近岁入藏之卷 · '+WORKS.length+' 卷';}
  }
  var stageIndex = 0;
  var visibleIndexes = [0,1,2,3,4,5];
  function renderMeta(meta){
    stageMeta.innerHTML = "";
    meta.forEach(function(seg, k){
      if(k > 0){ var dot = document.createElement("i"); stageMeta.appendChild(dot); }
      var s = document.createElement("span");
      s.textContent = seg;
      stageMeta.appendChild(s);
    });
  }
  function setStage(i){
    stageIndex = i;
    var data = WORKS[i];
    var wImg = workImg(i);
    if(stageImg.getAttribute("src") !== wImg){
      stageImg.classList.add("flip-in");
      void stageImg.offsetWidth;
      stageImg.onload = function(){ stageImg.classList.remove("flip-in"); };
      stageImg.src = wImg;
      stageImg.alt = data.title + "：馆藏展陈";
    }
    stageFrame.setAttribute("data-key", data.key);
    stageCat.textContent = data.cat;
    stageNo.textContent = data.no;
    stageTitle.textContent = data.title;
    renderMeta(data.meta.split(" · "));
    stageDesc.textContent = data.desc;
    idxItems.forEach(function(b){
      var active = Number(b.dataset.index) === i;
      b.classList.toggle("active", active);
    });
  }
  renderCatalogIndex();
  stageFrame.addEventListener("click", function(){ openLightbox(stageIndex); });
  stageFrame.addEventListener("keydown", function(e){
    if(e.key === "Enter" || e.key === " "){ e.preventDefault(); openLightbox(stageIndex); }
  });
  setStage(0);

  /* ===== 作品筛选 ===== */
  function applyFilter(cat){
    visibleIndexes = [];
    for(var i = 0; i < WORKS.length; i++){
      if(cat === "all" || WORKS[i].key === cat){ visibleIndexes.push(i); }
    }
    idxItems.forEach(function(b){
      var i = Number(b.dataset.index);
      b.classList.toggle("hidden", visibleIndexes.indexOf(i) < 0);
    });
    if(visibleIndexes.length && visibleIndexes.indexOf(stageIndex) < 0){
      setStage(visibleIndexes[0]);
    }
  }
  filters.forEach(function(btn){
    btn.addEventListener("click", function(){
      filters.forEach(function(b){ b.classList.remove("active"); b.setAttribute("aria-selected","false"); });
      btn.classList.add("active");
      btn.setAttribute("aria-selected","true");
      activeFilter=btn.dataset.filter;
      applyFilter(activeFilter);
    });
  });

  /* ===== 灯箱 ===== */
  var lightbox = document.getElementById("lightbox");
  var lbFigure = document.getElementById("lbFigure");
  var lbTitle = document.getElementById("lbTitle");
  var lbCat = document.getElementById("lbCat");
  var lbMeta = document.getElementById("lbMeta");
  var lbDesc = document.getElementById("lbDesc");
  var lbCounter = document.getElementById("lbCounter");
  var stripThumbs = Array.prototype.slice.call(document.querySelectorAll(".lb-thumb"));
  var lbPos = 0;
  function openLightbox(index){
    lbGalleryMode = false; visibleIndexes = []; for(var _wi=0; _wi<WORKS.length; _wi++){ if(activeFilter==="all"||WORKS[_wi].key===activeFilter){ visibleIndexes.push(_wi); } }
    lbPos = visibleIndexes.indexOf(index);
    if(lbPos < 0){ lbPos = 0; }
    var data = WORKS[visibleIndexes[lbPos]];
    var img = document.createElement("img");
    img.src = workImg(visibleIndexes[lbPos]);
    img.alt = data.title + "：馆藏展陈";
    lbFigure.innerHTML = "";
    lbFigure.appendChild(img);
    lbTitle.textContent = data.title;
    lbCat.textContent = data.cat;
    lbMeta.textContent = (data.no ? data.no + " · " : "") + data.meta;
    lbDesc.textContent = data.desc;
    stripThumbs.forEach(function(t){
      t.classList.toggle("active", Number(t.dataset.i) === visibleIndexes[lbPos]);
    });
    lbCounter.textContent = ("0" + (lbPos + 1)).slice(-2) + " / " + ("0" + visibleIndexes.length).slice(-2);
    lightbox.classList.add("open");
    document.body.style.overflow = "hidden";
    var lbCloseBtn = document.getElementById("lbClose");
    if(lbCloseBtn){ lbCloseBtn.focus(); }
  }
  renderThumbs();
  function closeLightbox(){
    lightbox.classList.remove("open","pure-image","video-mode");
    lightbox.classList.remove("video-mode");
    var vid = document.getElementById("lbVideo");
    if(vid){ vid.pause(); vid.removeAttribute("src"); vid.load(); }
    document.body.style.overflow = "";
    lbGalleryMode = false;
  }
  function stepLightbox(dir){
    if(visibleIndexes.length === 0){ return; }
    lbPos = (lbPos + dir + visibleIndexes.length) % visibleIndexes.length;
    if(lbGalleryMode){ openGalleryLightbox(visibleIndexes[lbPos]); }
    else { openLightbox(visibleIndexes[lbPos]); }
  }
  document.getElementById("lbClose").addEventListener("click", closeLightbox);
  document.getElementById("lbPrev").addEventListener("click", function(){ stepLightbox(-1); });
  document.getElementById("lbNext").addEventListener("click", function(){ stepLightbox(1); });
  /* 手机端：右滑关闭灯箱（视频底部控制条区域除外；桌面鼠标不受影响） */
  var __lbSwipeStart = null;
  lightbox.addEventListener("touchstart", function(e){
    if(!lightbox.classList.contains("open")){ return; }
    var t = e.changedTouches[0];
    __lbSwipeStart = { x: t.clientX, y: t.clientY, el: e.target };
  }, { passive: true });
  lightbox.addEventListener("touchend", function(e){
    if(!__lbSwipeStart || !lightbox.classList.contains("open")){ return; }
    var t = e.changedTouches[0];
    var dx = t.clientX - __lbSwipeStart.x;
    var dy = t.clientY - __lbSwipeStart.y;
    var s = __lbSwipeStart;
    __lbSwipeStart = null;
    if(dx > 70 && Math.abs(dx) > Math.abs(dy) * 1.4){
      var el = s.el;
      if(el && el.tagName === "VIDEO"){
        var r = el.getBoundingClientRect();
        if(r.height > 0 && (s.y - r.top) / r.height > 0.72){ return; }
      }
      closeLightbox();
    }
  }, { passive: true });
  lightbox.addEventListener("click", function(e){ if(e.target === lightbox){ closeLightbox(); } });
  document.addEventListener("keydown", function(e){
    if(!lightbox.classList.contains("open")){
      if(e.key === "Escape"){ setMenu(false); }
      return;
    }
    if(e.key === "Escape"){ closeLightbox(); }
    if(e.key === "ArrowLeft"){ stepLightbox(-1); }
    if(e.key === "ArrowRight"){ stepLightbox(1); }
  });

  /* ===== 防随手下载（非管理员） ===== */
(function(){
  document.addEventListener('contextmenu', function(e){ e.preventDefault(); });
  document.addEventListener('dragstart', function(e){ e.preventDefault(); });
  document.addEventListener('selectstart', function(e){
    if(!e.target.closest('input,textarea,[contenteditable]')) e.preventDefault();
  });
  document.addEventListener('keydown', function(e){
    var k = e.key;
    // F12
    if(k==='F12'){ e.preventDefault(); return; }
    // Ctrl+Shift+I/J/C/K (devtools)
    if(e.ctrlKey && e.shiftKey && ['I','J','C','K'].includes(k.toUpperCase())){ e.preventDefault(); return; }
    // Ctrl+U 查看源码
    if(e.ctrlKey && k.toUpperCase()==='U'){ e.preventDefault(); return; }
    // Ctrl+S 另存
    if(e.ctrlKey && k.toUpperCase()==='S'){ e.preventDefault(); return; }
  });
})();

/* ===== 卡片 hover 预加载视频首帧（点开秒开） ===== */
  (function(){
    var preloadVideo = null, preloadSrc = "";
    function ensurePreloader(){
      if(!preloadVideo){
        preloadVideo = document.createElement("video");
        preloadVideo.preload = "auto";
        preloadVideo.muted = true;
        preloadVideo.playsInline = true;
        preloadVideo.style.cssText = "position:fixed;left:-9999px;top:-9999px;width:2px;height:2px;opacity:0;pointer-events:none;";
        document.body.appendChild(preloadVideo);
      }
    }
    function arm(src){
      if(!src || src === preloadSrc) return;
      ensurePreloader();
      preloadSrc = src;
      preloadVideo.src = src;
      preloadVideo.load();
    }
    function disarm(){ preloadSrc=""; if(preloadVideo){ preloadVideo.removeAttribute("src"); try{preloadVideo.load();}catch(e){} } }
    document.addEventListener("mouseover", function(e){
      var card = e.target.closest(".vg-card,.cg-card");
      if(!card) return;
      var idx = card.getAttribute("data-vg") || card.getAttribute("data-cg");
      if(idx == null) return;
      var arr = card.classList.contains("cg-card") ? (typeof CONCEPTS!=="undefined"&&CONCEPTS) : (typeof VIDEOS!=="undefined"&&VIDEOS);
      if(!arr) return;
      var item = arr[+idx];
      if(item && item.u){ arm(item.u); }
    });
    document.addEventListener("mouseout", function(e){
      var card = e.target.closest(".vg-card,.cg-card");
      if(card && !card.contains(e.relatedTarget)){ disarm(); }
    });
  })();

  /* ===== 归卷：回到页首 ===== */
  var scrollTopBtn = document.getElementById("scrollTop");
  if(scrollTopBtn){
    scrollTopBtn.addEventListener("click", function(){
      window.scrollTo({ top:0, behavior: reduceMotion ? "auto" : "smooth" });
    });
  }

  /* ===== 符火粒子（Hero 飘浮余烬与符纹） ===== */
  var emberCanvas = document.getElementById("emberCanvas");
  var emberCtx = emberCanvas ? emberCanvas.getContext("2d") : null;
  var embers = [], emberOn = false;
  function makeEmber(w,h,resetY){
    var talisman = Math.random() < 0.16;
    return {
      x: Math.random() * w,
      y: resetY ? Math.random() * h : h + 12,
      vy: 0.12 + Math.random() * 0.4,
      sway: 0.2 + Math.random() * 0.5,
      phase: Math.random() * Math.PI * 2,
      size: talisman ? 7 + Math.random() * 8 : 1 + Math.random() * 2.4,
      gold: Math.random() < 0.3,
      talisman: talisman,
      rot: Math.random() * Math.PI * 2,
      vr: (Math.random() - 0.5) * 0.005
    };
  }
  function initEmbers(){
    if(!emberCanvas || !emberCtx) return;
    var hero = document.getElementById("top");
    var w = hero.clientWidth, h = hero.clientHeight;
    if(w === 0 || h === 0) return;
    emberCanvas.width = w;
    emberCanvas.height = h;
    var count = Math.max(14, Math.min(30, Math.round(w / 72)));
    embers = [];
    for(var i = 0; i < count; i++){ embers.push(makeEmber(w,h,true)); }
  }
  function drawEmbers(t){
    if(!emberCtx || !emberCanvas) return;
    var w = emberCanvas.width, h = emberCanvas.height;
    emberCtx.clearRect(0,0,w,h);
    for(var i = 0; i < embers.length; i++){
      var p = embers[i];
      p.y -= p.vy;
      p.x += Math.sin(t * 0.001 + p.phase) * p.sway * 0.35;
      p.rot += p.vr;
      if(p.y < -24){ embers[i] = makeEmber(w,h,false); continue; }
      var base = p.gold ? "184,155,107" : "194,59,46";
      var flick = 0.32 + 0.4 * Math.abs(Math.sin(t * 0.0016 + p.phase * 2.3));
      if(p.talisman){
        emberCtx.save();
        emberCtx.translate(p.x,p.y);
        emberCtx.rotate(p.rot);
        emberCtx.strokeStyle = "rgba(" + base + "," + (0.20 * flick).toFixed(3) + ")";
        emberCtx.lineWidth = 1;
        emberCtx.strokeRect(-p.size/2,-p.size/2,p.size,p.size);
        emberCtx.fillStyle = "rgba(" + base + "," + (0.16 * flick).toFixed(3) + ")";
        emberCtx.fillRect(-0.9,-0.9,1.8,1.8);
        emberCtx.restore();
      } else {
        emberCtx.beginPath();
        emberCtx.arc(p.x,p.y,p.size,0,Math.PI*2);
        emberCtx.fillStyle = "rgba(" + base + "," + flick.toFixed(3) + ")";
        emberCtx.fill();
        emberCtx.beginPath();
        emberCtx.arc(p.x,p.y,p.size*3,0,Math.PI*2);
        emberCtx.fillStyle = "rgba(" + base + "," + (flick * 0.07).toFixed(3) + ")";
        emberCtx.fill();
      }
    }
  }
  function loopEmbers(t){
    if(!emberOn) return;
    drawEmbers(t);
    requestAnimationFrame(loopEmbers);
  }
  if(emberCanvas && !reduceMotion){
    initEmbers();
    emberOn = true;
    requestAnimationFrame(loopEmbers);
    var emberResize;
    window.addEventListener("resize", function(){
      clearTimeout(emberResize);
      emberResize = setTimeout(initEmbers, 200);
    });
    document.addEventListener("visibilitychange", function(){
      if(document.hidden){ emberOn = false; }
      else if(!reduceMotion){ emberOn = true; requestAnimationFrame(loopEmbers); }
    });
  }
window.VIDEOS=VIDEOS;window.CONCEPTS=CONCEPTS;window.GALLERY=GALLERY;window.renderGallery=renderGallery;window.PROJECTS=PROJECTS;window.PRODUCERS=PRODUCERS;window.INBOX=INBOX;window.WORKS=WORKS;window.renderWorks=renderWorks;window.renderConcepts=renderConcepts;
window.FEATURED=FEATURED;window.FEATURED_QUEUE=FEATURED_QUEUE;
  window.renderArchive=renderArchive;window.renderInbox=renderInbox;window.renderFilters=renderFilters;window.renderFeatured=renderFeatured;
  function updateStaticCounts(){
    var av=document.getElementById('abVol');if(av&&window.PROJECTS)av.textContent=window.PROJECTS.length;
    var as=document.getElementById('abStaff');if(as&&window.PRODUCERS)as.textContent=window.PRODUCERS.length;
    var vt=document.getElementById('vgCountTitle');if(vt&&window.VIDEOS)vt.textContent=window.VIDEOS.length+'卷 · 逐一可览';
  }
  window.updateStaticCounts=updateStaticCounts;
})();

/* ===== 管理卷宗 ===== */
(function(){
  function init(){
  var PW_HASH = "a470d9d7d1215aba80a86a7f8edbb4acbdab2181ff7f12cf637c228743303644";
  function checkPwd(s){
    return crypto.subtle.digest('SHA-256', new TextEncoder().encode(s)).then(function(d){
      var hex='';
      var arr=new Uint8Array(d);
      for(var i=0;i<arr.length;i++){hex+=('0'+arr[i].toString(16)).slice(-2)}
      return hex===PW_HASH;
    });
  }
  var pwdPanel=document.getElementById('adminPwdPanel');
  var admPanel=document.getElementById('adminPanel');
  var listEl=document.getElementById('amList');
  var doneEl=document.getElementById('amDone');
  renderMembers();
  var snapshot=null;
  function lockBody(){document.body.style.overflow='hidden'}
  function unlockBody(){document.body.style.overflow=''}
  var ADMIN_OK_KEY='hs_admin_ok';
  function openPwd(){if(sessionStorage.getItem(ADMIN_OK_KEY)==='1'){openAdmin();return}if(pwdPanel)pwdPanel.classList.add('open');lockBody();var i=document.getElementById('adminPwdInput');if(i){i.value='';i.focus();}var e=document.getElementById('adminPwdErr');if(e)e.textContent=''}
  function closePwd(){if(pwdPanel)pwdPanel.classList.remove('open');unlockBody()}
  function hsToast(msg,isErr){
    var t=document.createElement('div');
    t.style.cssText='position:fixed;left:50%;bottom:30px;transform:translateX(-50%);z-index:9999;background:'+(isErr?'rgba(120,30,30,.95)':'rgba(20,25,30,.95)')+';color:#e8d9b8;font-size:13px;letter-spacing:.08em;padding:10px 18px;border:1px solid rgba(212,175,55,.45);border-radius:4px;max-width:88vw;text-align:center;white-space:nowrap';
    t.textContent=msg;
    document.body.appendChild(t);
    setTimeout(function(){t.remove()},4200);
  }
  function openAdmin(){
    if(!admPanel)return;
    if(snapshot===null){snapshot={videos:JSON.parse(JSON.stringify(window.VIDEOS)),producers:window.PRODUCERS.slice(),inbox:JSON.parse(JSON.stringify(window.INBOX))}}
    admPanel.classList.add('open');lockBody();renderList();renderInboxList();doneEl.textContent='';
    var ibx=document.querySelector('#adminPanel .am-inbox');
    if(ibx){
      var ibt=document.getElementById('amInboxTitle');
      if(ibt&&!ibt._bound){ibt._bound=true;ibt.addEventListener('click',function(){ibx.classList.toggle('collapsed')});}
    }
  }
  function closeAdmin(){if(admPanel)admPanel.classList.remove('open');unlockBody()}
  function projOf(pk){
    for(var i=0;i<window.PROJECTS.length;i++){if(window.PROJECTS[i].k===pk)return window.PROJECTS[i]}
    return null;
  }
  function renderMembers(){
    var ul=document.getElementById('spMembers');
    if(!ul)return;
    ul.innerHTML=window.PRODUCERS.map(function(n){return '<li>'+n+'</li>'}).join('');
    var dl=document.getElementById('amAuthorList');
    if(dl){
      var all=window.PRODUCERS.slice();
      window.VIDEOS.forEach(function(v){if(v.m&&all.indexOf(v.m)<0)all.push(v.m)});
      dl.innerHTML=all.map(function(n){return '<option value="'+n.replace(/"/g,'&quot;')+'">'}).join('');
    }
  }
  function dayOf(v){
    if(v&&v.ts){
      try{
        var dt=new Date(v.ts);
        if(!isNaN(dt))return dt.getFullYear()+'-'+('0'+(dt.getMonth()+1)).slice(-2)+'-'+('0'+dt.getDate()).slice(-2);
      }catch(_e){}
    }
    return '未标注';
  }
  function renderList(){
    if(!listEl)return;
    if(!window.VIDEOS.length){listEl.innerHTML='<li class="am-hint" style="padding:12px 4px">暂无作品</li>';return}
    var byM={},order=[];
    window.VIDEOS.forEach(function(v,idx){
      var m=v.m||'佚名';
      if(!byM[m]){byM[m]=[];order.push(m)}
      byM[m].push(idx);
    });
    order.sort(function(a,b){return byM[b].length-byM[a].length||(a<b?-1:a>b?1:0)});
    listEl.innerHTML=order.map(function(m,pi){
      return '<li class="am-l1" data-l1="'+pi+'" role="button" aria-expanded="false">'+
        '<span class="am-tri">▸</span><b>'+m+'</b><span class="am-lcount">'+byM[m].length+' 件</span></li>'+
        '<li class="am-l2wrap" data-l2wrap="'+pi+'" data-m="'+m.replace(/"/g,'&quot;')+'" hidden></li>';
    }).join('');
  }
  function renderL2(wrap){
    var m=wrap.getAttribute('data-m');
    var idxList=window.VIDEOS.map(function(v,i){return i}).filter(function(i){return (window.VIDEOS[i].m||'佚名')===m});
    var byD={},order=[];
    idxList.forEach(function(idx){
      var d=dayOf(window.VIDEOS[idx]);
      if(!byD[d]){byD[d]=[];order.push(d)}
      byD[d].push(idx);
    });
    order.sort(function(a,b){return (a==='未标注'?1:b==='未标注'?-1:0)||(b<a?-1:b>a?1:0)});
    wrap.innerHTML='<ul class="am-sub">'+order.map(function(d,di){
      return '<li class="am-l2" data-l2="'+di+'" role="button" aria-expanded="false">'+
        '<span class="am-tri">▸</span><b>'+d+'</b><span class="am-lcount">'+byD[d].length+' 件</span></li>'+
        '<li class="am-l3wrap" data-l3wrap="'+di+'" hidden></li>';
    }).join('')+'</ul>';
  }
  function renderL3(l3wrap){
    var wrap=l3wrap.closest('.am-l2wrap');
    var m=wrap?wrap.getAttribute('data-m'):'';
    var prev=l3wrap.previousElementSibling;
    var date=prev?prev.querySelector('b').textContent:'';
    var idxList=window.VIDEOS.map(function(v,i){return i}).filter(function(i){var v=window.VIDEOS[i];return v&&(v.m||'佚名')===m&&dayOf(v)===date});
    l3wrap.innerHTML='<ul class="am-sub">'+idxList.map(function(idx){
      var v=window.VIDEOS[idx];if(!v)return '';
      var proj=projOf(v.pk);
      var projName=proj?proj.n:v.p;
      return '<li class="am-row"><span class="am-idx">'+('0'+(idx+1)).slice(-2)+'</span>'+
        '<div class="am-main"><b>'+projName+' · '+v.t+'</b>'+
        '<span>'+(v.m||'佚名')+' · '+v.d+'</span></div>'+
        '<div class="am-ops">'+
        '<select class="am-op" data-am-move="'+idx+'">'+window.PROJECTS.map(function(pr){return '<option value="'+pr.k+'"'+(pr.k===v.pk?' selected':'')+'>'+pr.n+'</option>'}).join('')+'</select>'+
        '<button class="am-op" type="button" data-am-edit="'+idx+'">修改</button>'+
        '<button class="am-op danger" type="button" data-am-del="'+idx+'">删除</button>'+
        '</div></li>';
    }).join('')+'</ul>';
  }
  listEl.addEventListener('click',function(e){
    var t=e.target;
    var l1=t.closest('.am-l1');
    if(l1){
      var pi=l1.getAttribute('data-l1');
      var wrap=listEl.querySelector('[data-l2wrap="'+pi+'"]');
      if(!wrap)return;
      var open=!l1.classList.contains('open');
      l1.classList.toggle('open',open);
      l1.setAttribute('aria-expanded',open?'true':'false');
      if(open){if(!wrap.dataset.rendered){renderL2(wrap);wrap.dataset.rendered='1'}wrap.hidden=false}
      else{wrap.hidden=true}
      return;
    }
    var l2=t.closest('.am-l2');
    if(l2){
      var l3=l2.nextElementSibling;
      if(!l3||!l3.classList.contains('am-l3wrap'))return;
      var open2=!l2.classList.contains('open');
      l2.classList.toggle('open',open2);
      l2.setAttribute('aria-expanded',open2?'true':'false');
      if(open2){if(!l3.dataset.rendered){renderL3(l3);l3.dataset.rendered='1'}l3.hidden=false}
      else{l3.hidden=true}
      return;
    }
    if(t.dataset.amDel!==undefined){
      var idx=+t.dataset.amDel;var v=window.VIDEOS[idx];
      if(!v)return;
      if(!window.confirm('删除「'+v.p+' · '+v.t+'」？可在底部「撤销全部」恢复。'))return;
      window.VIDEOS.splice(idx,1);
      window.renderArchive();renderList();markDone();
    }else if(t.dataset.amEdit!==undefined){
      var idx2=+t.dataset.amEdit;var v2=VIDEOS[idx2];if(!v2)return;
      editRow(t,v2);
    }
  });
  listEl.addEventListener('change',function(e){
    var t=e.target;
    if(t.dataset.amMove!==undefined){
      var idx2=+t.dataset.amMove;var v2=VIDEOS[idx2];if(!v2)return;
      var pk=t.value;var proj=projOf(pk);
      if(proj){v2.p=proj.n;v2.pk=proj.k}
      window.renderArchive();renderList();markDone();
    }
  });
  function editRow(btn,v){
    var proj=projOf(v.pk);
    var form=document.createElement('div');
    form.className='am-edit-form';
    form.innerHTML='<select data-f="pk">'+window.PROJECTS.map(function(pr){return '<option value="'+pr.k+'"'+(pr.k===v.pk?' selected':'')+'>'+pr.n+'</option>'}).join('')+'</select>'+
      '<input data-f="t" value="'+v.t.replace(/"/g,'&quot;')+'" placeholder="标题">'+
      '<input data-f="m" list="amAuthorList" value="'+(v.m||'').replace(/"/g,'&quot;')+'" placeholder="作者">'+
      '<input data-f="d" value="'+(v.d||'').replace(/"/g,'&quot;')+'" placeholder="时长" style="width:64px">'+
      '<button class="am-op active" type="button" data-save>保存</button><button class="am-op" type="button" data-cancel>取消</button>';
    var wrap=btn.closest('.am-row');
    btn.style.display='none';
    wrap.appendChild(form);
    form.addEventListener('click',function(ev){
      if(ev.target.dataset.save!==undefined){
        var proj2=projOf(form.querySelector('[data-f="pk"]').value);
        if(proj2){v.p=proj2.n;v.pk=proj2.k}
        v.t=form.querySelector('[data-f="t"]').value||v.t;
        v.m=form.querySelector('[data-f="m"]').value||'';
        v.d=form.querySelector('[data-f="d"]').value||v.d;
        window.renderArchive();renderList();markDone();
      }else if(ev.target.dataset.cancel!==undefined){
        renderList();
      }
    });
  }
  function markDone(){autoSync();}
  document.addEventListener('click',function(e){
    if(e.target.closest('#btnAdmin')){e.preventDefault();openPwd();return}
    if(e.target.closest('[data-ap-close]')){closePwd();return}
    if(e.target.closest('[data-am-close]')){closeAdmin();return}
  });
  var pwdForm=document.getElementById('adminPwdForm');
  if(pwdForm){
    pwdForm.addEventListener('submit',function(e){
      e.preventDefault();
      var input=document.getElementById('adminPwdInput');
      var err=document.getElementById('adminPwdErr');
      if(!input)return;
      checkPwd(input.value).then(function(ok){
        if(ok){try{sessionStorage.setItem(ADMIN_OK_KEY,'1')}catch(_e){}closePwd();openAdmin()}
        else{err.textContent='密印不符，请重试';input.select()}
      });
    });
  }
  /* ===== 数据源：Cloudflare Function 反代 COS /data.json ===== */
  function tryFetch(u){
    return fetch(u).then(function(r){
      if(!r.ok)return Promise.reject(r.status);
      return r.json();
    });
  }
  var lastApplied='';var introFired=false;
  function loadRemote(){
    // 单路优先 /data.json → pages.dev 兜底，不并发抢带宽
    tryFetch('/data.json')
    .catch(function(){ return tryFetch('https://huanshan-film.pages.dev/data.json'); })
    .then(function(d){
      if(d&&Array.isArray(d.videos)&&d.videos.length){
        var nu=d.updatedAt||'';
        if(nu&&nu===lastApplied){introDone();return}
        lastApplied=nu;
        applyData(d);
      } else { showDataErr(); }
      introDone();
    }).catch(function(){ showDataErr(); introDone(); });
  }
  function introDone(){ if(!introFired&&window.__hsIntroDataReady){introFired=true;window.__hsIntroDataReady()} }
  function showDataErr(){
    var el=document.getElementById('hsDataErr');
    if(!el){
      el=document.createElement('div');
      el.id='hsDataErr';
      el.style.cssText='position:fixed;left:50%;bottom:24px;transform:translateX(-50%);z-index:999;background:rgba(90,30,30,.92);border:1px solid rgba(212,175,55,.4);color:#e8d9b8;font-size:12px;letter-spacing:.12em;padding:10px 18px;border-radius:4px;max-width:90vw;text-align:center';
      el.textContent='馆藏数据加载失败 · 请检查网络后刷新重试';
      document.body.appendChild(el);
    }
  }
  function applyData(d){
    if(!d||!Array.isArray(d.videos)||!d.videos.length)return;
    try{
      window.VIDEOS.splice.apply(window.VIDEOS,[0,window.VIDEOS.length].concat(d.videos));
      if(Array.isArray(d.concepts)){window.CONCEPTS.splice.apply(window.CONCEPTS,[0,window.CONCEPTS.length].concat(d.concepts))}
      if(Array.isArray(d.gallery)){window.GALLERY.splice.apply(window.GALLERY,[0,window.GALLERY.length].concat(d.gallery))}
      if(Array.isArray(d.projects)){window.PROJECTS.splice.apply(window.PROJECTS,[0,window.PROJECTS.length].concat(d.projects))}
      if(Array.isArray(d.producers)){window.PRODUCERS.splice.apply(window.PRODUCERS,[0,window.PRODUCERS.length].concat(d.producers))}
      if(Array.isArray(d.inbox)){window.INBOX.splice.apply(window.INBOX,[0,window.INBOX.length].concat(d.inbox))}
      if(Array.isArray(d.featured)){window.FEATURED.splice.apply(window.FEATURED,[0,window.FEATURED.length].concat(d.featured))}
      if(Array.isArray(d.featuredQueue)){window.FEATURED_QUEUE.splice.apply(window.FEATURED_QUEUE,[0,window.FEATURED_QUEUE.length].concat(d.featuredQueue))}
      if(Array.isArray(d.works)){window.WORKS.splice.apply(window.WORKS,[0,window.WORKS.length].concat(d.works));window.renderWorks();}
      // 立即渲染首屏：精选 + 影像长卷默认卷
      window.renderFeatured();renderMembers();updateStaticCounts();
      window.renderFilters();window.renderArchive();
      // IntersectionObserver 懒渲染下方 section（滚动接近时才渲染）
      var _rendered={videos:false,concepts:false,gallery:false,inbox:false};
      function _lazyRender(sectionId,fn,key){
        if(_rendered[key])return;
        var el=document.getElementById(sectionId);
        if(!el){fn();_rendered[key]=true;return;}
        var io=new IntersectionObserver(function(entries){
          entries.forEach(function(e){
            if(e.isIntersecting){_rendered[key]=true;io.disconnect();fn();}
          });
        },{rootMargin:"400px"});
        io.observe(el);
      }
      _lazyRender("concepts",function(){window.renderConcepts();},"concepts");
      _lazyRender("gallery",function(){if(window.renderGallery)window.renderGallery();},"gallery");
      _lazyRender("inbox",function(){window.renderInbox();},"inbox");
    }catch(e){ if(window.console&&console.error){console.error('applyData failed',e)} }
  }

  var _autoSyncTimer=null;
  function autoSync(){
    if(_autoSyncTimer)clearTimeout(_autoSyncTimer);
    if(doneEl)doneEl.textContent='已记录变更 · 3 秒后自动入库…';
    _autoSyncTimer=setTimeout(function(){
      if(doneEl)doneEl.textContent='正在写入 COS…';
      var payload={version:3,updatedAt:new Date().toISOString(),videos:window.VIDEOS,concepts:window.CONCEPTS,gallery:window.GALLERY,projects:window.PROJECTS,works:window.WORKS,producers:window.PRODUCERS,inbox:window.INBOX,featured:window.FEATURED,featuredQueue:window.FEATURED_QUEUE};
      fetch('/data.json',{method:'PUT',headers:{'X-Admin-Password':UPLOAD_PWD,'Content-Type':'application/json'},body:JSON.stringify(payload)})
      .then(function(r){if(!r.ok)return r.text().then(function(t){throw new Error(t)});return r.json()})
      .then(function(){
        if(doneEl)doneEl.textContent='已入库 · 实时生效';
      }).catch(function(e){
        if(doneEl)doneEl.textContent='入库失败：'+String(e)+'（再做一次操作自动重试）';
      });
    },3000);
  }

  /* ===== 本地上传（浏览器 ffmpeg 压缩 + COS 直传 + 自动封面） ===== */
  var UPLOAD_PWD = 'hs2026admin';
  var uploadBtn=document.getElementById('amUploadLocal');
  var uploadPanel=document.getElementById('amUploadPanel');
  if(uploadBtn&&uploadPanel){
    uploadBtn.addEventListener('click',function(){
      uploadPanel.hidden=!uploadPanel.hidden;
    });
    document.getElementById('ulCancel').addEventListener('click',function(){
      uploadPanel.hidden=true;
    });
  }
  var selectedFiles=[];
  var dropEl=document.getElementById('ulDrop');
  var fileInput=document.getElementById('ulFile');
  if(dropEl&&fileInput){
    dropEl.addEventListener('click',function(){fileInput.click()});
    fileInput.addEventListener('change',function(){
      selectedFiles=Array.from(fileInput.files);
      renderFileList();
    });
    ['dragover','dragleave','drop'].forEach(function(ev){
      dropEl.addEventListener(ev,function(e){
        e.preventDefault();
        if(ev==='dragover')dropEl.style.borderColor='var(--gold)';
        else dropEl.style.borderColor='rgba(212,175,55,.3)';
        if(ev==='drop'){
          selectedFiles=Array.from(e.dataTransfer.files);
          renderFileList();
        }
      });
    });
  }
  function renderFileList(){
    var el=document.getElementById('ulFileList');
    if(!el)return;
    el.innerHTML=selectedFiles.map(function(f,i){
      return '<div>'+(i+1)+'. '+f.name+' ('+Math.round(f.size/1024/1024)+'MB)</div>';
    }).join('');
  }
  function uploadProgress(msg){
    var el=document.getElementById('ulProgress');
    if(el)el.textContent=msg;
  }
  var ffmpegReady=null;
  function loadFFmpeg(){
    if(ffmpegReady)return ffmpegReady;
    uploadProgress('加载 ffmpeg 核心（首次约 30MB）...');
    ffmpegReady=import('https://unpkg.com/@ffmpeg/ffmpeg@0.12.10/dist/ffmpeg.min.js').then(function(FFmpegWASM){
      var ff=new FFmpegWASM.FFmpeg();
      return ff.load({
        coreURL:'https://unpkg.com/@ffmpeg/core@0.12.6/dist/ffmpeg-core.js',
        wasmURL:'https://unpkg.com/@ffmpeg/core@0.12.6/dist/ffmpeg-core.wasm'
      }).then(function(){return ff});
    });
    return ffmpegReady;
  }
  async function uploadToCOS(blob,name){
    var r=await fetch('/media/upload?name='+encodeURIComponent(name),{
      method:'POST',
      headers:{'X-Admin-Password':UPLOAD_PWD,'Content-Type':blob.type||'application/octet-stream'},
      body:blob
    });
    if(!r.ok)throw new Error('COS upload '+r.status+': '+await r.text());
    return r.json();
  }
  async function getLatestData(){
    var r=await fetch('/data.json?t='+Date.now());
    if(!r.ok)throw new Error('load data '+r.status);
    return r.json();
  }
  async function putData(data){
    var r=await fetch('/data.json',{
      method:'PUT',
      headers:{'X-Admin-Password':UPLOAD_PWD,'Content-Type':'application/json'},
      body:JSON.stringify(data)
    });
    if(!r.ok)throw new Error('save data '+r.status+': '+await r.text());
  }
  var ulSubmit=document.getElementById('ulSubmit');
  if(ulSubmit){
    ulSubmit.addEventListener('click',async function(){
      if(!selectedFiles.length){uploadProgress('请先选文件');return}
      var author=document.getElementById('ulAuthor').value.trim()||'佚名';
      var section=document.getElementById('ulSection').value;
      ulSubmit.disabled=true;
      var entries=[];
      for(var fi=0;fi<selectedFiles.length;fi++){
        var file=selectedFiles[fi];
        var title=file.name.replace(/\.[^.]+$/,'').replace(/^NO\.?\d+[\s_-]*/i,'').trim();
        uploadProgress('['+(fi+1)+'/'+selectedFiles.length+'] '+title);
        var stamp=Date.now()+fi;
        var entry={t:title,m:author,p:'其他',img:'assets/brand/logo-totem.png',u:''};
        try{
          if(/^video\//.test(file.type)){
            var ext=file.name.split('.').pop().toLowerCase();
            var vName='video_'+stamp+'.mp4';
            uploadProgress('压缩中: '+title);
            var ff=await loadFFmpeg();
            await ff.writeFile('input.'+ext,file);
            await ff.exec(['-i','input.'+ext,'-vf',"scale='min(1920,iw)':-2",'-c:v','libx264','-crf','23','-preset','fast','-c:a','aac','-b:a','128k','-movflags','+faststart','-y','out.mp4']);
            var vData=await ff.readFile('out.mp4');
            var vBlob=new Blob([vData.buffer],{type:'video/mp4'});
            // 自动截封面
            uploadProgress('截封面: '+title);
            await ff.exec(['-ss','1','-i','out.mp4','-frames:v','1','-q:v','3','-y','cover.jpg']);
            var cData=await ff.readFile('cover.jpg');
            var cBlob=new Blob([cData.buffer],{type:'image/jpeg'});
            var cName='cover_'+stamp+'.jpg';
            uploadProgress('上传: '+title);
            await uploadToCOS(vBlob,vName);
            await uploadToCOS(cBlob,cName);
            entry.u='/media/'+vName;
            entry.img='/media/'+cName;
            await ff.delete('input.'+ext);await ff.delete('out.mp4');await ff.delete('cover.jpg');
          }else{
            var iext=file.name.split('.').pop().toLowerCase();
            var iName='img_'+stamp+'.'+iext;
            uploadProgress('上传: '+title);
            await uploadToCOS(file,iName);
            entry.img='/media/'+iName;
          }
          entries.push(entry);
        }catch(e){
          uploadProgress('❌ '+title+' 失败: '+e.message);
        }
      }
      if(!entries.length){ulSubmit.disabled=false;return}
      uploadProgress('写入 data.json...');
      try{
        var data=await getLatestData();
        entries.forEach(function(en){
          if(section==='gallery'){
            data.gallery=data.gallery||[];
            data.gallery.push({img:en.img,t:en.t,k:en.p||'未分类'});
          }else if(section==='concepts'){
            data.concepts=data.concepts||[];
            data.concepts.push({img:en.img,t:en.t,k:en.p||'其他',u:en.u||'',m:en.m||''});
          }else if(section==='featured'){
            data.featuredQueue=data.featuredQueue||[];
            data.featuredQueue.push(en);
          }else if(section.indexOf('videos:')===0){
            var vol=section.slice(7);
            en.p=vol;
            data.videos=data.videos||[];
            data.videos.push(en);
          }else{
            data.inbox=data.inbox||[];
            data.inbox.push(en);
          }
        });
        data.updatedAt=new Date().toISOString();
        await putData(data);
        uploadProgress('✅ 完成！'+entries.length+' 件作品已上线，3 秒后刷新');
        setTimeout(function(){location.reload()},3000);
      }catch(e){
        uploadProgress('❌ 保存失败: '+e.message);
        ulSubmit.disabled=false;
      }
    });
  }

  var inboxListEl=document.getElementById('amInboxList');
  var inboxBulkEl=document.getElementById('amInboxBulk');
  var bulkTargetEl=document.getElementById('ibBulkTarget');
  var selCountEl=document.getElementById('ibSelCount');
  var checkedSet=new Set();
  function renderBulkBar(){
    if(!inboxBulkEl||!selCountEl)return;
    if(!window.INBOX.length){inboxBulkEl.hidden=true;return}
    var n=0;checkedSet.forEach(function(v){if(window.INBOX.indexOf(v)>-1)n++});
    selCountEl.textContent=n;
    inboxBulkEl.hidden=(n===0);
  }
  function renderInboxList(){
    if(!inboxListEl)return;
    if(bulkTargetEl&&!bulkTargetEl.dataset.rendered){
      bulkTargetEl.innerHTML='<option value="">批量归入卷…</option>'+volumeOpts();
      bulkTargetEl.dataset.rendered='1';
    }
    if(!window.INBOX.length){inboxListEl.innerHTML='';renderBulkBar();return}
    var byD={},order=[];
    window.INBOX.forEach(function(v,i){
      var d=dayOf(v);
      if(!byD[d]){byD[d]=[];order.push(d)}
      byD[d].push(i);
    });
    order.sort(function(a,b){return (a==='未标注'?1:b==='未标注'?-1:0)||(b<a?-1:b>a?1:0)});
    var html='';
    order.forEach(function(d){
      var items=byD[d];
      var q=d.replace(/"/g,'&quot;');
      html+='<li class="ib-ghead"><b>'+d+'</b><span class="am-lcount">'+items.length+' 件</span>'+
        '<button class="am-op" type="button" data-ib-gcheck="'+q+'">全选本组</button>'+
        '<select data-ib-gtarget="'+q+'"><option value="">归入卷…</option>'+volumeOpts()+'</select>'+
        '<button class="am-op active" type="button" data-ib-gmove="'+q+'">整组归卷</button></li>';
      items.forEach(function(i){
        var v=window.INBOX[i];
        var opts=volumeOpts();
        var checked=checkedSet.has(v)?' checked':'';
        html+='<li class="am-row"><label class="ib-check"><input type="checkbox" data-ib-check="'+i+'"'+checked+'></label>'+
          '<div class="am-main"><b>'+((v.p||'未命名')+' · '+(v.t||''))+'</b>'+
          '<span>'+(v.m||'佚名')+(v.d?' · '+v.d:'')+'</span></div>'+
          '<div class="am-ops">'+
          '<select class="am-op" data-ib-into="'+i+'"><option value="">归入卷…</option>'+opts+'</select>'+
          '<button class="am-op active" type="button" data-ib-move="'+i+'">归卷</button>'+
          '<button class="am-op danger" type="button" data-ib-del="'+i+'">移除</button>'+
          '</div></li>';
      });
    });
    inboxListEl.innerHTML=html;
    renderBulkBar();
  }

  function volumeOpts(){
    var s = window.PROJECTS.map(function(pr){return '<option value="'+pr.k+'">'+pr.n+'</option>'}).join('');
    s += '<option value="__gallery">— 图藏卷（图集）</option>';
    s += '<option value="__concepts">— 幻境卷（概念图）</option>';
    s += '<option value="__featured">— 藏卷四部·精选（待审）</option>';
    return s;
  }

  function moveInbox(items,pk){
    // 特殊板块分流：图藏卷 / 幻境卷 / 精选待审
    if(pk==='__gallery'||pk==='__concepts'||pk==='__featured'){
      items.forEach(function(v){
        var idx=window.INBOX.indexOf(v);
        if(idx<0)return;
        var copy=JSON.parse(JSON.stringify(v));
        window.INBOX.splice(idx,1);
        checkedSet.delete(v);
        if(pk==='__gallery'){
          window.GALLERY.push({img:copy.img, t:copy.t, k:copy.p||'未分类'});
        }else if(pk==='__concepts'){
          window.CONCEPTS.push({img:copy.img, t:copy.t, k:copy.p||'其他', u:copy.u||'', m:copy.m||''});
        }else if(pk==='__featured'){
          copy.pk=copy.pk||'p_other';
          window.FEATURED_QUEUE.push(copy);
        }
      });
      window.renderArchive();window.renderInbox();renderInboxList();
      if(window.renderGallery)window.renderGallery();
      if(window.renderConcepts)window.renderConcepts();
      if(window.renderFeatured)window.renderFeatured();
      if(typeof renderFeaturedQueueList==='function')renderFeaturedQueueList();
      markInboxDone();
      return;
    }
    var proj=pk?projOf(pk):null;
    items.forEach(function(v){
      if(window.INBOX.indexOf(v)<0)return;
      var copy=JSON.parse(JSON.stringify(v));
      if(proj){copy.p=proj.n;copy.pk=proj.k}
      window.VIDEOS.push(copy);
      window.INBOX.splice(window.INBOX.indexOf(v),1);
      checkedSet.delete(v);
    });
    window.renderArchive();window.renderInbox();renderInboxList();markInboxDone();
  }
  var featListEl=document.getElementById('amFeatList');
  var featUlEl=document.getElementById('amFeatUl');
  var featReviewBtn=document.getElementById('amFeatReview');
  function renderFeaturedQueueList(){
    if(!featUlEl)return;
    if(!window.FEATURED_QUEUE.length){featUlEl.innerHTML='<li class="am-mini" style="padding:8px 2px">暂无精选待审作品</li>';return}
    featUlEl.innerHTML=window.FEATURED_QUEUE.map(function(v,i){
      return '<li class="am-row"><span><b>《'+(v.t||'未命名')+'》</b> <em class="am-mini">'+(v.m||'佚名')+' · '+(v.p||'未归卷')+(v.u?' · 视频':' · 图')+'</em></span>'+
        '<span class="am-row-actions">'+
        '<button class="am-op active" type="button" data-feat-ok="'+i+'">通过上架</button>'+
        '<button class="am-op danger" type="button" data-feat-no="'+i+'">驳回</button></span></li>';
    }).join('');
  }
  if(featReviewBtn){
    featReviewBtn.addEventListener('click',function(){
      featListEl.hidden=!featListEl.hidden;
      if(!featListEl.hidden){renderFeaturedQueueList()}
    });
  }
  if(featUlEl){
    featUlEl.addEventListener('click',function(e){
      var ok=e.target.closest('[data-feat-ok]');
      var no=e.target.closest('[data-feat-no]');
      if(ok){
        var fi=Number(ok.getAttribute('data-feat-ok'));
        if(!isNaN(fi)&&window.FEATURED_QUEUE[fi]){
          var it=window.FEATURED_QUEUE.splice(fi,1)[0];
          window.FEATURED.push(it);
          window.renderFeatured();renderFeaturedQueueList();markDone();
        }
        return;
      }
      if(no){
        var nj=Number(no.getAttribute('data-feat-no'));
        if(!isNaN(nj)&&window.FEATURED_QUEUE[nj]){
          window.FEATURED_QUEUE.splice(nj,1);
          window.renderFeatured();renderFeaturedQueueList();markDone();
        }
      }
    });
  }
  function markInboxDone(){autoSync();}
  var inboxBtn=document.getElementById('amAddInbox');
  if(inboxBtn){
    inboxBtn.addEventListener('click',function(){
      var old=document.getElementById('amInboxRow');
      if(old){old.remove();return}
      var row=document.createElement('div');
      row.className='am-add-row';
      row.id='amInboxRow';
      row.style.flexWrap='wrap';
      row.innerHTML='<input id="ibP" placeholder="作品名（卷名）" maxlength="20">'+
        '<input id="ibT" placeholder="标题 / 集数" maxlength="30">'+
        '<input id="ibM" list="amAuthorList" placeholder="作者" maxlength="12">'+
        '<input id="ibD" placeholder="时长" maxlength="10" style="width:70px">'+
        '<input id="ibImg" placeholder="封面路径（assets/…）" maxlength="120" style="flex-basis:100%">'+
        '<input id="ibU" placeholder="视频直链 URL（可暂留空）" maxlength="400" style="flex-basis:100%">'+
        '<button class="am-op active" type="button" data-ib-save>收进合集</button>'+
        '<button class="am-op" type="button" data-ib-cancel>取消</button>';
      listEl.parentNode.insertBefore(row,listEl);
      var first=row.querySelector('#ibP');first.focus();
      row.addEventListener('click',function(e){
        if(e.target.dataset.ibSave!==undefined){
          var pv=row.querySelector('#ibP').value.trim();
          if(!pv){row.querySelector('#ibP').focus();return}
          var item={p:pv,pk:'',m:row.querySelector('#ibM').value.trim(),t:row.querySelector('#ibT').value.trim(),
            d:row.querySelector('#ibD').value.trim(),img:row.querySelector('#ibImg').value.trim(),u:row.querySelector('#ibU').value.trim()};
          window.INBOX.push(item);
          window.renderInbox();renderInboxList();markInboxDone();row.remove();
        }else if(e.target.dataset.ibCancel!==undefined){row.remove()}
      });
    });
  }
  if(inboxListEl){
    inboxListEl.addEventListener('click',function(e){
      var t=e.target;
      if(t.dataset.ibGcheck!==undefined){
        var d=t.getAttribute('data-ib-gcheck');
        window.INBOX.forEach(function(v){if(dayOf(v)===d)checkedSet.add(v)});
        renderInboxList();
        return;
      }
      if(t.dataset.ibGmove!==undefined){
        var d2=t.getAttribute('data-ib-gmove');
        var gsel=inboxListEl.querySelector('[data-ib-gtarget="'+d2.replace(/"/g,'&quot;')+'"]');
        var target=gsel?gsel.value:'';
        if(!target){if(doneEl)doneEl.textContent='请先选择整组归入的卷';return}
        var items=window.INBOX.filter(function(v){return dayOf(v)===d2});
        if(!items.length)return;
        if(!window.confirm('将 '+items.length+' 件作品整组归入所选卷？'))return;
        moveInbox(items,target);
        return;
      }
      if(t.dataset.ibMove!==undefined){
        var i=+t.dataset.ibMove;var v=window.INBOX[i];if(!v)return;
        var sel=document.querySelector('[data-ib-into="'+i+'"]');
        var target=sel?sel.value:'';
        if(!target){
          if(doneEl)doneEl.textContent='请先选择归入的卷';
          return;
        }
        moveInbox([v],target);
      }else if(t.dataset.ibDel!==undefined){
        var i2=+t.dataset.ibDel;var v2=window.INBOX[i2];if(!v2)return;
        if(!window.confirm('移除「'+(v2.p||'未命名')+'」？'))return;
        window.INBOX.splice(i2,1);
        checkedSet.delete(v2);
        window.renderInbox();renderInboxList();markInboxDone();
      }
    });
    inboxListEl.addEventListener('change',function(e){
      var t=e.target;
      if(t.dataset.ibCheck!==undefined){
        var i=+t.dataset.ibCheck;var v=window.INBOX[i];if(!v)return;
        if(t.checked)checkedSet.add(v);else checkedSet.delete(v);
        renderBulkBar();
      }
    });
  }
  if(inboxBulkEl){
    inboxBulkEl.addEventListener('click',function(e){
      var t=e.target;
      if(t.dataset.ibBulk!==undefined){
        var bt=bulkTargetEl?bulkTargetEl.value:'';
        if(!bt){if(doneEl)doneEl.textContent='请先选择批量归入的卷';return}
        var items=window.INBOX.filter(function(v){return checkedSet.has(v)});
        if(!items.length){renderBulkBar();return}
        if(!window.confirm('将选中的 '+items.length+' 件作品批量归入所选卷？'))return;
        moveInbox(items,bt);
      }else if(t.dataset.ibClear!==undefined){checkedSet.clear();renderInboxList()}
    });
  }
  var addBtn=document.getElementById('amAddProducer');
  if(addBtn){
    addBtn.addEventListener('click',function(){
      var old=document.getElementById('amAddRow');
      if(old){old.remove();return}
      var row=document.createElement('div');
      row.className='am-add-row';
      row.id='amAddRow';
      row.innerHTML='<input id="amNewProducer" placeholder="制作人姓名" maxlength="12">'+
        '<button class="am-op active" type="button" data-ap-save>加入名录</button>'+
        '<button class="am-op" type="button" data-ap-cancel>取消</button>';
      listEl.parentNode.insertBefore(row,listEl);
      var inp=row.querySelector('#amNewProducer');inp.focus();
      row.addEventListener('click',function(e){
        if(e.target.dataset.apSave!==undefined){
          var name=inp.value.trim();
          if(!name){inp.focus();return}
          if(window.PRODUCERS.indexOf(name)>-1){inp.select();return}
          window.PRODUCERS.push(name);
          renderMembers();renderList();markDone();row.remove();
        }else if(e.target.dataset.apCancel!==undefined){row.remove()}
      });
    });
  }
  var projBtn=document.getElementById('amAddProject');
  if(projBtn){
    projBtn.addEventListener('click',function(){
      var old=document.getElementById('amProjRow');
      if(old){old.remove();return}
      var row=document.createElement('div');
      row.className='am-add-row';
      row.id='amProjRow';
      row.innerHTML='<select id="amProjCat" title="归属大类"><option value="archive">影像长卷</option><option value="concept">幻境卷</option><option value="works">馆藏卷宗 · 近岁入藏</option></select>'+
        '<input id="amProjName" placeholder="项目名（如 仙侠短剧）" maxlength="24">'+
        '<input id="amProjDesc" placeholder="一句话定位（如 古装仙侠 · 系列短剧）" maxlength="40" style="flex-basis:100%">'+
        '<button class="am-op active" type="button" data-pj-save>立卷</button>'+
        '<button class="am-op" type="button" data-pj-cancel>取消</button>';
      listEl.parentNode.insertBefore(row,listEl);
      row.querySelector('#amProjName').focus();
      row.addEventListener('click',function(e){
        if(e.target.dataset.pjSave!==undefined){
          var name=row.querySelector('#amProjName').value.trim();
          if(!name){row.querySelector('#amProjName').focus();return}
          var clean=name.replace(/^《|》$/g,'');
          var desc=row.querySelector('#amProjDesc').value.trim();
          var cat=row.querySelector('#amProjCat').value;
          if(cat==='works'){
            var wdup=window.WORKS.some(function(w){return w.title==='《'+clean+'》'});
            if(wdup){if(doneEl)doneEl.textContent='馆藏卷宗已有同名卷「《'+clean+'》」，请换个名字';row.querySelector('#amProjName').select();return}
            window.WORKS.push({key:'film',no:'卷·'+window.GANZHI[(51+window.WORKS.length)%60],title:'《'+clean+'》',cat:(desc||'影像卷 · 新藏'),meta:'新藏 · '+new Date().getFullYear(),desc:(desc||'新增入藏 · 待编修'),img:''});
            window.renderWorks();
            if(doneEl)doneEl.textContent='已立卷《'+clean+'》至馆藏卷宗 · 近岁入藏';
          }else if(cat==='concept'){
            var cdup=window.CONCEPTS.some(function(c){return c.t==='《'+clean+'》'});
            if(cdup){if(doneEl)doneEl.textContent='幻境卷已有同名条目「《'+clean+'》」，请换个名字';row.querySelector('#amProjName').select();return}
            window.CONCEPTS.push({img:'',t:'《'+clean+'》',k:(desc||'幻境 · 待编修')});
            window.renderConcepts();
            if(doneEl)doneEl.textContent='已立卷《'+clean+'》至幻境卷';
          }else{
            var dup=window.PROJECTS.some(function(pr){return pr.n==='《'+clean+'》'});
            if(dup){if(doneEl)doneEl.textContent='已有同名卷「《'+clean+'》」，请换个名字';row.querySelector('#amProjName').select();return}
            window.PROJECTS.push({k:'p'+Date.now(),n:'《'+clean+'》',d:(desc||'新卷 · 待编修归卷')});
            window.renderArchive();window.renderFilters();renderList();
            if(doneEl)doneEl.textContent='已立卷《'+clean+'》至影像长卷';
            markDone();row.remove();
            return;
          }
          markDone();row.remove();
        }else if(e.target.dataset.pjCancel!==undefined){row.remove()}
      });
    });
  }
  var projListBtn=document.getElementById('amProjectsBtn');
  var projListEl=document.getElementById('amProjList');
  function renderProjList(){
    if(!projListEl)return;
    var html='';
    function itemRow(it, realIdx, src){
      if(!it)return '';
      var thumb = it.img ? '<img class="am-item-thumb" src="'+it.img+'" loading="lazy" onerror="this.style.display=\'none\'">' : '';
      var meta = it.m ? (it.m+' · ') : '';
      meta += (it.u ? '影' : '图');
      return '<div class="am-item-row">'+thumb+
        '<span class="am-item-title">'+(it.t||'(无标题)')+'</span>'+
        '<span class="am-item-meta">'+meta+'</span>'+
        '<button class="am-op" type="button" data-itm-edit="'+src+'|'+realIdx+'">✎编辑</button>'+
        '<button class="am-op danger" type="button" data-itm-del="'+src+'|'+realIdx+'">删条</button></div>';
    }
    function itemsBlock(src, k){
      var all = src==='vid' ? window.VIDEOS : (src==='cpt' ? window.CONCEPTS : window.GALLERY);
      if(!all || !all.length)return '';
      var rows=[];
      all.forEach(function(it, i){
        if(src==='vid'){ if(it.pk !== k) return; }
        else { if((it.k||'') !== k) return; }
        rows.push(itemRow(it, i, src));
      });
      return '<div class="am-proj-items">'+rows.join('')+'</div>';
    }
    /* 影像长卷 */
    if(window.PROJECTS.length){
      html+='<div class="am-proj-sec">影像长卷 · 馆藏卷宗</div>';
      html+=window.PROJECTS.map(function(pr){
        var items=window.VIDEOS.filter(function(v){return v.pk===pr.k});
        return '<div class="am-proj-row am-proj-toggle" data-row="vid|'+pr.k+'"><span class="am-proj-arrow">▸</span>'+
          '<span class="am-proj-name">'+pr.n+'</span>'+
          '<span class="am-proj-count">'+items.length+' 件</span>'+
          '<button class="am-op" type="button" data-pj-rename="'+pr.k+'">✎改名</button>'+
          '<button class="am-op danger" type="button" data-pj-del="'+pr.k+'">删卷</button></div>'+
          itemsBlock('vid',pr.k);
      }).join('');
    }
    /* 幻境卷 · 视频作品 */
    if(window.CONCEPTS && window.CONCEPTS.length){
      var grp={};
      window.CONCEPTS.forEach(function(c){var k=c.k||'(未分类)';(grp[k]=grp[k]||[]).push(c)});
      html+='<div class="am-proj-sec">幻境卷 · 影像作品</div>';
      Object.keys(grp).forEach(function(k){
        var items=grp[k];
        html+='<div class="am-proj-row am-proj-toggle" data-row="cpt|'+k+'"><span class="am-proj-arrow">▸</span>'+
          '<span class="am-proj-name">'+k+'</span>'+
          '<span class="am-proj-tag">幻境</span>'+
          '<span class="am-proj-count">'+items.length+' 件</span>'+
          '<button class="am-op" type="button" data-cj-rename="'+k+'">✎改名</button>'+
          '<button class="am-op danger" type="button" data-cj-del="'+k+'">删卷</button></div>'+
          itemsBlock('cpt',k);
      });
    }
    /* 图藏卷 · 图谱 */
    if(window.GALLERY && window.GALLERY.length){
      var ggrp={};
      window.GALLERY.forEach(function(g){var k=g.k||'(未分类)';(ggrp[k]=ggrp[k]||[]).push(g)});
      html+='<div class="am-proj-sec">图藏卷 · 图谱典藏</div>';
      Object.keys(ggrp).forEach(function(k){
        var items=ggrp[k];
        html+='<div class="am-proj-row am-proj-toggle" data-row="gal|'+k+'"><span class="am-proj-arrow">▸</span>'+
          '<span class="am-proj-name">'+k+'</span>'+
          '<span class="am-proj-tag" style="color:var(--ink-gold)">图藏</span>'+
          '<span class="am-proj-count">'+items.length+' 件</span>'+
          '<button class="am-op" type="button" data-gal-rename="'+k+'">✎改名</button></div>'+
          itemsBlock('gal',k);
      });
    }
    projListEl.innerHTML = html || '<div class="am-hint">暂无卷宗</div>';
  }
  if(projListBtn&&projListEl){
    projListBtn.addEventListener('click',function(){
      if(projListEl.hasAttribute('hidden')){projListEl.removeAttribute('hidden')}
      else{projListEl.setAttribute('hidden','')}
      renderProjList();
    });
    projListEl.addEventListener('click',function(e){
      /* 单条编辑 */
      var itmEdit=e.target.dataset.itmEdit;
      if(itmEdit){
        var parts=itmEdit.split('|');
        var src=parts[0], idx=Number(parts[1]);
        var arr = src==='vid' ? window.VIDEOS : (src==='cpt' ? window.CONCEPTS : window.GALLERY);
        if(!arr || !arr[idx])return;
        var it=arr[idx];
        var nt=window.prompt('作品标题：', it.t||'');
        if(nt===null)return;
        var nm=window.prompt('作者：', it.m||'');
        if(nm===null)return;
        it.t=nt; it.m=nm;
        window.renderArchive();window.renderInbox();renderList();renderInboxList();
        if(window.renderConcepts)window.renderConcepts();
        if(window.renderGallery)window.renderGallery();
        if(window.renderFeatured)window.renderFeatured();
        renderProjList();markDone();
        return;
      }
      /* 影像长卷·改名 */
      var pjR=e.target.dataset.pjRename;
      if(pjR){
        var pr=projOf(pjR);if(!pr)return;
        var nn=window.prompt('新卷名：', pr.n);
        if(nn===null||!nn.trim())return;
        pr.n=nn.trim();
        window.renderArchive();renderList();renderProjList();markDone();
        return;
      }
      /* 幻境卷·改名 */
      var cjR=e.target.dataset.cjRename;
      if(cjR!==undefined && cjR!==''){
        var nn2=window.prompt('新卷名：', cjR);
        if(nn2===null||!nn2.trim())return;
        window.CONCEPTS.forEach(function(c){ if((c.k||'')===cjR){ c.k=nn2.trim(); } });
        window.renderConcepts();renderProjList();markDone();
        return;
      }
      /* 图藏卷·改名 */
      var galR=e.target.dataset.galRename;
      if(galR!==undefined && galR!==''){
        var nn3=window.prompt('新卷名：', galR);
        if(nn3===null||!nn3.trim())return;
        window.GALLERY.forEach(function(g){ if((g.k||'')===galR){ g.k=nn3.trim(); } });
        window.renderGallery();renderProjList();markDone();
        return;
      }
      /* 单条删除 */
      var itm=e.target.dataset.itmDel;
      if(itm){
        var parts=itm.split('|');
        var src=parts[0], idx=Number(parts[1]);
        var arr = src==='vid' ? window.VIDEOS : (src==='cpt' ? window.CONCEPTS : window.GALLERY);
        if(!arr || !arr[idx])return;
        var t=arr[idx].t||'(无标题)';
        if(!window.confirm('删除「'+t+'」？此操作将从本站移除该条作品（媒体文件保留在仓库）。'))return;
        arr.splice(idx,1);
        window.renderArchive();window.renderInbox();renderList();renderInboxList();
        if(window.renderConcepts)window.renderConcepts();
        if(window.renderGallery)window.renderGallery();
        if(window.renderFeatured)window.renderFeatured();
        renderProjList();markDone();
        return;
      }
      /* 展开/折叠卷 */
      var row=e.target.closest('.am-proj-row.am-proj-toggle');
      if(row && !e.target.dataset.pjDel && !e.target.dataset.cjDel){
        row.classList.toggle('open');
        return;
      }
      var k=e.target.dataset.pjDel;
      if(k){
        var pr=projOf(k);if(!pr)return;
        var items=window.VIDEOS.filter(function(v){return v.pk===k});
        if(!window.confirm('删除卷「'+pr.n+'」？其中 '+items.length+' 件作品将自动转入「新作待归卷」并标记旧作，可在底部「撤销全部」恢复。'))return;
        window.PROJECTS=window.PROJECTS.filter(function(p){return p.k!==k});
        items.forEach(function(v){delete v.pk;v.p='旧作待处理';window.INBOX.push(v)});
        window.renderArchive();window.renderInbox();renderList();renderInboxList();renderProjList();markDone();
        return;
      }
      var cj=e.target.dataset.cjDel;
      if(cj!==undefined && cj!==''){
        var cjItems=window.CONCEPTS.filter(function(c){return (c.k||'')===cj});
        if(!cjItems.length)return;
        if(!window.confirm('删除幻境卷「'+cj+'」？其中 '+cjItems.length+' 条概念作品将一并移除，可在底部「撤销全部」恢复。'))return;
        for(var i=window.CONCEPTS.length-1;i>=0;i--){
          if((window.CONCEPTS[i].k||'')===cj){window.CONCEPTS.splice(i,1);}
        }
        window.renderConcepts();
        renderProjList();markDone();
      }
    });
  }
  var undoBtn=document.getElementById('amUndo');
  if(undoBtn){
    undoBtn.addEventListener('click',function(){
      if(!snapshot){if(doneEl)doneEl.textContent='无快照可撤销';return}
      if(!window.confirm('撤销本次管理面板内所有变更？（将恢复到打开时的状态）'))return;
      window.VIDEOS.splice.apply(window.VIDEOS,[0,window.VIDEOS.length].concat(snapshot.videos));
      window.PRODUCERS.splice(0,window.PRODUCERS.length);
      snapshot.producers.forEach(function(n){window.PRODUCERS.push(n)});
      renderMembers();
      if(snapshot.inbox){window.INBOX.splice.apply(window.INBOX,[0,window.INBOX.length].concat(snapshot.inbox))}
      if(snapshot.concepts){window.CONCEPTS.splice.apply(window.CONCEPTS,[0,window.CONCEPTS.length].concat(snapshot.concepts))}
      if(snapshot.gallery){window.GALLERY.splice.apply(window.GALLERY,[0,window.GALLERY.length].concat(snapshot.gallery))}
      if(snapshot.projects){window.PROJECTS.splice.apply(window.PROJECTS,[0,window.PROJECTS.length].concat(snapshot.projects))}
      if(snapshot.featuredQueue){window.FEATURED_QUEUE.splice.apply(window.FEATURED_QUEUE,[0,window.FEATURED_QUEUE.length].concat(snapshot.featuredQueue))}
      renderArchive();window.renderInbox();renderList();renderInboxList();
      if(window.renderConcepts)window.renderConcepts();
      if(window.renderGallery)window.renderGallery();
      if(window.renderFeatured)window.renderFeatured();
      if(typeof renderFeaturedQueueList==='function')renderFeaturedQueueList();
      markDone();
    });
  }
  var closeBtn=document.getElementById('amClose');
  if(closeBtn){closeBtn.addEventListener('click',closeAdmin)}
  loadRemote();
  // 仅管理面板打开时才轮询同步数据，公共访客不轮询
  }
  if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',init)}
  else{init()}
})();

