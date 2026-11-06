/* ===================================================================
   account.js — 账户中心弹框逻辑
   - 页面加载即显示登录/注册弹框
   - 标签页切换（登录 / 注册）
   - 关闭弹框（× / 点击遮罩 / Esc）→ 返回首页
   - 表单提交为演示，仅做前端拦截提示
   =================================================================== */

const overlay   = document.getElementById("authOverlay");
const closeBtn  = document.getElementById("authClose");
const tabLogin  = document.getElementById("tabLogin");
const tabReg    = document.getElementById("tabRegister");
const loginForm = document.getElementById("loginForm");
const regForm   = document.getElementById("registerForm");
const authMsg   = document.getElementById("authMsg");

/* 用页面内的提示条替代 alert（预览沙箱会拦截 alert） */
function showMsg(text, type){
  authMsg.textContent = text;
  authMsg.className = "auth-msg show " + (type || "error");
  authMsg.scrollIntoView({ block:"nearest" });
  clearTimeout(showMsg._t);
  showMsg._t = setTimeout(() => { authMsg.className = "auth-msg"; }, 4500);
}

/* 切换标签 */
function showTab(tab){
  const isLogin = tab === "login";
  tabLogin.classList.toggle("active", isLogin);
  tabReg.classList.toggle("active", !isLogin);
  loginForm.classList.toggle("hidden", !isLogin);
  regForm.classList.toggle("hidden", isLogin);
}
tabLogin.addEventListener("click", () => showTab("login"));
tabReg.addEventListener("click",   () => showTab("register"));

/* 关闭弹框 → 返回首页 */
function closeAuth(){ window.location.href = "index.html"; }
closeBtn.addEventListener("click", closeAuth);
overlay.addEventListener("click", e => { if(e.target === overlay) closeAuth(); });
document.addEventListener("keydown", e => { if(e.key === "Escape") closeAuth(); });

/* 演示：拦截提交 */
loginForm.addEventListener("submit", e => {
  e.preventDefault();
  showMsg("演示环境：登录请求已拦截。接入后端后此处发起鉴权。", "info");
});

/* ---- 手机验证码（演示）----
   规则：一个手机号对应唯一一个验证码；企业账号一个手机号仅可开通一个。 */
const phoneStore = {};            // phone -> { code, businessRegistered }
const getCodeBtn = document.getElementById("getCodeBtn");
let codeTimer = null;

function genCode(phone){
  if(phoneStore[phone] && phoneStore[phone].code) return phoneStore[phone].code; // 同一手机号复用同一验证码
  const code = String(Math.floor(100000 + Math.random() * 900000));
  phoneStore[phone] = Object.assign(phoneStore[phone] || {}, { code });
  return code;
}

getCodeBtn.addEventListener("click", () => {
  const phone = regForm.phone.value.trim();
  if(!/^\d{6,15}$/.test(phone)){ showMsg("请先输入有效的手机号（6–15 位数字）。", "error"); regForm.phone.focus(); return; }
  const code = genCode(phone);
  showMsg("演示环境：验证码已「发送」至 " + phone + "，验证码为 " + code + "（一个手机号仅对应此验证码）。", "info");
  let left = 60;                                  // 60 秒倒计时，期间不可重发
  getCodeBtn.disabled = true;
  getCodeBtn.textContent = left + " 秒后重发";
  codeTimer = setInterval(() => {
    left--;
    if(left <= 0){ clearInterval(codeTimer); getCodeBtn.disabled = false; getCodeBtn.textContent = "获取验证码"; }
    else getCodeBtn.textContent = left + " 秒后重发";
  }, 1000);
});

regForm.addEventListener("submit", e => {
  e.preventDefault();
  const type  = regForm.elements["type"].value;
  const phone = regForm.phone.value.trim();
  const code  = regForm.code.value.trim();
  const pw    = regForm.password.value;
  const cpw   = regForm.confirm.value;

  if(!phone){ showMsg("请输入手机号。", "error"); return; }
  // 验证码与该手机号一一对应
  if(!phoneStore[phone] || phoneStore[phone].code !== code){
    showMsg("验证码错误或已失效，请重新获取并输入与该手机号对应的验证码。", "error"); return;
  }
  // 企业账号：一个手机号仅可开通一个
  if(type === "business" && phoneStore[phone].businessRegistered){
    showMsg("该手机号已开通企业账号：一个手机号仅对应一个企业账号，无法重复开通。", "error"); return;
  }
  if(pw !== cpw){ showMsg("两次输入的密码不一致，请检查。", "error"); return; }
  if(!/^(?=.*[A-Za-z])(?=.*\d).{8,}$/.test(pw)){ showMsg("密码至少 8 位，且需同时包含字母与数字。", "error"); return; }

  if(type === "business") phoneStore[phone].businessRegistered = true;
  showMsg("演示环境：注册成功（" + (type === "business" ? "企业/批发" : "个人") + "账户）。接入后端后此处创建账户并自动登录。", "success");
});

/* 社交登录（演示） */
document.querySelectorAll(".auth-social-btn").forEach(btn=>{
  btn.addEventListener("click", ()=> showMsg("演示环境：第三方登录（" + btn.textContent.trim() + "）未接入。", "info"));
});
