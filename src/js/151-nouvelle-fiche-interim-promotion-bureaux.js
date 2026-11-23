/* ============================================================
   NOUVELLE FICHE · INTÉRIM, PROMOTION, BUREAUX, STUDIO, ENTREPÔT, MARITIME, ÉNERGIES, AÉRIEN
   Une vue propre au métier, dessinée à partir de l'état réel, puis l'écran complet du métier.
   ============================================================ */
NF_CSS.push(`
.md.nf-staffing{--nf-bg:#F2F6FB;--nf-bg2:#D8E2EE;--nf-acc:#2563C9;--nf-acc2:#1A4794;--nf-h:#122A4C;--nf-hf:600 19px 'Fraunces',Georgia,serif;--nf-sh:#D8E2EE}
.st2-pool{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:8px}
.st2-c{background:#fff;border-radius:16px;padding:8px 4px;text-align:center;box-shadow:0 3px 0 var(--nf-sh);font:800 11.5px var(--fb);color:var(--ink);min-width:0}
.st2-c svg{display:block;width:52px;height:52px;margin:0 auto 4px;border-radius:50%}
.st2-c small{display:block;font:700 10px var(--fb);color:var(--ink-3);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.st2-c em{display:inline-block;margin-top:3px;font:800 9.5px var(--fb);font-style:normal;background:#E5EEFB;color:#1A4794;border-radius:6px;padding:1px 6px}
.st2-k{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-top:8px}
.st2-k div{background:#122A4C;color:#fff;border-radius:14px;padding:8px 10px}.st2-k small{display:block;font:700 11px var(--fb);color:#A9C2E6}.st2-k b{font:800 18px var(--fd)}
.st2-job{background:#fff;border-radius:18px;padding:12px;box-shadow:0 3px 0 var(--nf-sh)}
.st2-job+.st2-job,.st2-pick+.st2-job{margin-top:8px}
.st2-job.on{box-shadow:0 0 0 2px #2563C9,0 3px 0 var(--nf-sh)}
.st2-job .hd{display:flex;gap:6px;align-items:center}
.st2-job .hd span{font:800 10.5px var(--fb);border-radius:6px;padding:2px 7px}
.st2-job .lv{background:#122A4C;color:#fff}.st2-job .sec{background:#E5EEFB;color:#1A4794}.st2-job .exp{margin-left:auto;color:var(--ink-3);padding:0}
.st2-job b{display:block;font:600 16px 'Fraunces',Georgia,serif;margin-top:6px}.st2-job>small{display:block;font-size:12px;color:var(--ink-3);margin-top:2px}
.st2-prop{display:flex;gap:8px;align-items:center;margin-top:8px;background:#F2F6FB;border-radius:12px;padding:6px 8px;font-size:12.5px}
.st2-prop svg{border-radius:50%;flex:0 0 auto}.st2-prop b{display:inline;font:800 12.5px var(--fb);margin:0}
.st2-pick{display:grid;gap:6px;margin-top:8px}
.st2-pick button{display:flex;gap:10px;align-items:center;border:0;border-radius:14px;background:#fff;padding:6px 10px;text-align:left;font:inherit;color:var(--ink);box-shadow:0 3px 0 var(--nf-sh);min-height:56px}
.st2-pick svg{border-radius:50%;flex:0 0 auto}.st2-pick span{flex:1;min-width:0}.st2-pick b{display:block;font:800 13px var(--fb)}.st2-pick small{display:block;font-size:11px;color:var(--ink-3)}
.st2-pick em{font:800 13px var(--fd);font-style:normal;color:var(--ink-3)}.st2-pick em.ok{color:#16804D}
.wh2-st{margin-top:10px}.wh2-g{display:block;height:8px;border-radius:4px;background:#E6E8E1;margin-top:8px;overflow:hidden}.wh2-g em{display:block;height:100%;background:#E0761B}
.wh2-of{background:#fff;border-radius:18px;padding:12px;box-shadow:0 3px 0 var(--nf-sh)}
.wh2-of+.wh2-of{margin-top:8px}.wh2-of.big{background:#FFF4EA;box-shadow:inset 0 0 0 2px #F2B27A,0 3px 0 var(--nf-sh)}
.wh2-of .px{text-align:right;flex:0 0 auto}.wh2-of .px b{font:600 18px 'Oswald',sans-serif}.wh2-of .px small{display:block;font-size:10.5px}
.wh2-ac{display:flex;gap:8px;margin-top:8px}.md.nf-warehouse .wh2-ac .nf-b{flex:1}
.md.nf-promo{--nf-bg:#F6F3EE;--nf-bg2:#E4DCD0;--nf-acc:#B5542B;--nf-acc2:#83391C;--nf-h:#3A2416;--nf-hf:400 22px 'DM Serif Display',Georgia,serif;--nf-sh:#E4DCD0}
.pr2-op{background:#fff;border-radius:18px;padding:10px 12px;box-shadow:0 3px 0 var(--nf-sh)}
.pr2-op+.pr2-op{margin-top:8px}
.pr2-op b{font:800 14px var(--fb)}.pr2-op small{display:block;font-size:12px;color:var(--ink-3)}
.pr2-st{display:flex;align-items:center;margin-top:8px}
.pr2-st span{flex:0 0 auto;font:800 10px var(--fb);color:var(--ink-3);background:#F2EDE5;border-radius:8px;padding:4px 6px}
.pr2-st span.on{background:#B5542B;color:#fff}.pr2-st span.done{background:#E8C9B8;color:#83391C}
.pr2-st i{flex:1;height:2px;background:#E4DCD0}
.pr2-mk{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}
.pr2-mk div{background:#fff;border-radius:14px;padding:8px 10px;box-shadow:0 3px 0 var(--nf-sh)}.pr2-mk small{display:block;font:700 11px var(--fb);color:var(--ink-3)}.pr2-mk b{font:400 22px 'DM Serif Display',serif}
.pr2-k{display:grid;grid-template-columns:repeat(3,1fr);gap:6px;margin-top:10px}.pr2-k div{background:#F6F3EE;border-radius:12px;padding:6px 8px}.pr2-k small{display:block;font:700 10.5px var(--fb);color:var(--ink-3)}.pr2-k b{font:400 17px 'DM Serif Display',serif}
.pr2-bar{margin-top:10px;display:grid;grid-template-columns:1fr auto;gap:2px 8px;align-items:baseline}.pr2-bar span{font:800 12.5px var(--fb)}.pr2-bar b{font:400 17px 'DM Serif Display',serif}
.pr2-bar i{grid-column:1 / 3;display:block;height:6px;border-radius:3px;background:#F2EDE5;overflow:hidden}.pr2-bar em{display:block;height:100%;background:#B5542B}.pr2-bar small{grid-column:1 / 3;font-size:11.5px;color:var(--ink-3)}
.pr2-land{display:flex;gap:10px;background:#fff;border-radius:18px;padding:10px;box-shadow:0 3px 0 var(--nf-sh)}.pr2-land+.pr2-land{margin-top:8px}
.pr2-land .bp{flex:0 0 84px;border-radius:10px;overflow:hidden;align-self:flex-start}.pr2-land .t{flex:1;min-width:0}.pr2-land b{font:800 13.5px var(--fb)}.pr2-land small{display:block;font-size:11.5px;color:var(--ink-3);margin:2px 0 4px}
.sd2-sh{display:flex;gap:10px;align-items:center;background:#1E1E25;border-radius:16px;padding:8px 10px}.sd2-sh+.sd2-sh{margin-top:8px}
.sd2-sh .cl{flex:0 0 56px;border-radius:6px;overflow:hidden}.sd2-sh .cl svg{display:block;width:56px;height:auto}
.sd2-sh .t{flex:1;min-width:0}.sd2-sh b{display:block;font:800 13.5px var(--fb);color:#F2E6C8}.sd2-sh small{display:block;font-size:11.5px;color:#A9A39A}
.sd2-sh i{display:block;height:6px;border-radius:3px;background:#2A2A32;margin:5px 0 3px;overflow:hidden}.sd2-sh em{display:block;height:100%;background:#E3B341}
.sd2-new{background:#1E1E25;border-radius:20px;padding:12px;color:#EDE7DA}
.sd2-new .lab{font:800 10.5px var(--fb);letter-spacing:.12em;color:#E3B341;margin:12px 0 6px}.sd2-new .lab:first-child{margin-top:0}
.sd2-ch{display:flex;gap:6px}.sd2-ch button{flex:1;border:0;border-radius:12px;background:#2A2A32;color:#EDE7DA;font:800 12.5px var(--fb);min-height:46px;padding:4px}
.sd2-ch button small{display:block;font:700 10px var(--fb);color:#A9A39A}.sd2-ch button.on{background:#E3B341;color:#141418}.sd2-ch button.on small{color:#3A2E10}.sd2-ch button[disabled]{opacity:.4}
.sd2-gen{display:flex;gap:6px;overflow-x:auto;scrollbar-width:none}.sd2-gen::-webkit-scrollbar{display:none}
.sd2-gen button{flex:0 0 70px;border:0;border-radius:10px;background:none;padding:3px;text-align:center}.sd2-gen button svg{display:block;width:62px;height:auto;border-radius:6px;margin:0 auto}
.sd2-gen button.on{background:#E3B341}.sd2-gen small{display:block;font:800 10px var(--fb);color:#A9A39A;margin-top:3px}.sd2-gen button.on small{color:#141418}.sd2-gen small.up{color:#7dffa8}
.sd2-tal{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:6px}
.sd2-tal button{position:relative;border:0;border-radius:14px;background:#2A2A32;padding:8px;text-align:left;font:inherit;color:#EDE7DA}
.sd2-tal button svg{border-radius:50%;display:block}.sd2-tal b{display:block;font:800 12.5px var(--fb);margin-top:4px}.sd2-tal small{display:block;font-size:10.5px;color:#A9A39A}
.sd2-tal em{position:absolute;top:8px;right:8px;font:800 11px var(--fb);font-style:normal;color:#E3B341}
.sd2-tal button.on{box-shadow:inset 0 0 0 2px #E3B341}.sd2-tal button[disabled]{opacity:.45}
.sd2-go{display:flex;justify-content:space-between;align-items:center;gap:10px;margin-top:14px;padding-top:12px;border-top:1px solid #2A2A32}
.sd2-go b{display:block;font:400 24px 'Anton',sans-serif;color:#fff}.sd2-go small{font-size:11.5px;color:#A9A39A}
.md.nf-studio .nf-card{background:#1E1E25}.md.nf-studio .nf-row b{color:#EDE7DA}.md.nf-studio .nf-row small,.md.nf-studio .nf-row{color:#A9A39A}
.md.nf-studio .nf-list>.nf-row,.md.nf-studio .nf-list>.nf-ctl{border-color:#2A2A32}
.md.nf-studio .nf-seg{background:#2A2A32}.md.nf-studio .nf-seg button{color:#D8D2C6}
.md.nf-office{--nf-bg:#EEF1F5;--nf-bg2:#D6DCE5;--nf-acc:#24364F;--nf-acc2:#14223A;--nf-h:#14223A;--nf-hf:500 20px 'Cormorant Garamond',Georgia,serif;--nf-sh:#D6DCE5}
.md.nf-office .nf-sec{font-weight:700}
.of2-sky{display:flex;gap:10px;align-items:flex-end;overflow-x:auto;scrollbar-width:none;background:linear-gradient(#BFD4EA,#E9F0F7);border-radius:20px;padding:14px 12px 0;box-shadow:0 4px 0 var(--nf-sh)}
.of2-sky::-webkit-scrollbar{display:none}
.of2-t{flex:0 0 auto;text-align:center}
.of2-t .bd{width:96px;background:#3A4C66;border-radius:6px 6px 0 0;padding:8px 8px 0;display:flex;flex-direction:column-reverse;gap:3px}
.of2-t .fl{display:grid;grid-template-columns:repeat(5,1fr);gap:3px;height:9px}
.of2-t .fl i{border-radius:1px;background:#58698A}
.of2-t .fl.on i{background:#F7D77A}
.of2-t .fl.wk i{background:#C98B5A}
.of2-t b{display:block;font:700 13px 'Cormorant Garamond',serif;color:#14223A;background:#fff;padding:4px 6px;white-space:nowrap;max-width:110px;overflow:hidden;text-overflow:ellipsis}
.of2-t small{display:block;font:700 10.5px var(--fb);color:var(--ink-3);background:#fff;padding:0 6px 6px}
.of2-bt{border:0;background:none;padding:0;font:inherit}
.of2-t.on .bd{box-shadow:0 0 0 3px #F2C94C}
.of2-t .fl.bad i{background:#E9967A}
.of2-pan{margin-top:10px}.of2-pan .nm{display:block;font:700 18px 'Cormorant Garamond',serif}.of2-pan>small{display:block;font-size:12px;color:var(--ink-3)}
.of2-k{display:grid;grid-template-columns:repeat(3,1fr);gap:6px;margin-top:10px}.of2-k div{background:#EEF1F5;border-radius:12px;padding:6px 8px}.of2-k small{display:block;font:700 10.5px var(--fb);color:var(--ink-3)}.of2-k b{font:800 15px var(--fd)}
.of2-pan .lab{font:800 10.5px var(--fb);letter-spacing:.12em;color:#24364F;margin:12px 0 6px;display:flex;align-items:center;gap:6px}
.of2-ac{display:flex;flex-wrap:wrap;gap:6px}.md.nf-office .of2-ac .nf-b{flex:1 1 auto;font-size:12px;padding:0 10px;white-space:normal;line-height:1.15}
.of2-pr{background:#fff;border-radius:18px;padding:12px;box-shadow:0 3px 0 var(--nf-sh)}.of2-pr+.of2-pr{margin-top:8px}
.of2-pr.gc{box-shadow:inset 0 0 0 2px #C9A54E,0 3px 0 var(--nf-sh)}
.of2-l{margin-top:8px;padding-top:8px;border-top:1px solid #EEF1F5;font-size:12.5px;color:var(--ink-3)}.of2-l b{color:var(--ink)}.of2-l .of2-ac{margin-top:6px}
.md.nf-studio{--nf-bg:#141418;--nf-bg2:#2A2A32;--nf-acc:#E3B341;--nf-acc2:#A8811F;--nf-h:#F2E6C8;--nf-hf:400 24px 'Anton','Baloo 2',sans-serif;--nf-sh:#2A2A32;--nf-card:#1E1E25}
.md.nf-studio .md-b{color:#EDE7DA}
.md.nf-studio .nf-sec small,.md.nf-studio .nf-res small{color:#A9A39A}
.md.nf-studio .nf-res b{color:#fff}
.md.nf-studio .nf-mg,.md.nf-studio .nf-dlg{background:#1E1E25;color:#EDE7DA}.md.nf-studio .nf-mg small,.md.nf-studio .nf-dlg{color:#A9A39A}.md.nf-studio .nf-dlg b{color:#fff}
.md.nf-studio .nf-steps .p{color:#A9A39A}.md.nf-studio .nf-steps .p i{background:#2A2A32;color:#EDE7DA}
.md.nf-studio .nf-lnk{background:#2A2A32;color:#E3B341}
.md.nf-studio .nf-log>div{color:#D8D2C6;border-color:#2A2A32}
.md.nf-studio .nf-leg{background:#fff;color:var(--ink)}
.sd2-cat{display:flex;gap:10px;overflow-x:auto;scrollbar-width:none;padding-bottom:4px}
.sd2-cat::-webkit-scrollbar{display:none}
.sd2-p{flex:0 0 104px;text-align:center}
.sd2-p .im{position:relative;border-radius:8px;overflow:hidden;box-shadow:0 6px 14px rgba(0,0,0,.5)}
.sd2-p .im svg{display:block;width:104px;height:auto}
.sd2-p b{display:block;font:800 12px var(--fb);color:#F2E6C8;margin-top:6px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.sd2-p small{display:block;font:700 10.5px var(--fb);color:#A9A39A}
.sd2-p em{position:absolute;top:6px;right:6px;font:800 11px var(--fd);font-style:normal;background:#E3B341;color:#141418;border-radius:6px;padding:0 5px}
.sd2-p.prod .im{outline:2px dashed #E3B341;outline-offset:2px}
.md.nf-warehouse{--nf-bg:#F2F3EF;--nf-bg2:#DADDD3;--nf-acc:#E0761B;--nf-acc2:#A9540E;--nf-h:#25281F;--nf-hf:600 19px 'Oswald','Baloo 2',sans-serif;--nf-sh:#DADDD3}
.md.nf-warehouse .nf-sec{text-transform:uppercase;letter-spacing:.03em}
.wh2-floor{background:#B9BDB2 linear-gradient(90deg,rgba(255,255,255,.08) 1px,transparent 1px) 0 0/16px 16px;border-radius:18px;padding:10px;box-shadow:0 4px 0 #8E9387}
.wh2-ai{display:grid;grid-template-columns:repeat(16,1fr);gap:2px;background:#E0761B;border-radius:5px;padding:3px;margin-bottom:9px}
.wh2-ai i{height:15px;border-radius:2px;background:#E9EBE4}
.wh2-dock{display:grid;grid-template-columns:repeat(4,1fr);gap:6px;margin-top:4px}
.wh2-dock span{background:#5B6052;border-radius:6px 6px 0 0;height:40px;color:#fff;font:700 10px var(--fb);padding:4px}
.wh2-dock span.on{background:#3E4237}
.wh2-lg{display:flex;flex-wrap:wrap;gap:4px 10px;margin-top:8px;font:700 11px var(--fb);color:#25281F}
.wh2-lg i{display:inline-block;width:9px;height:9px;border-radius:2px;margin-right:4px;vertical-align:-1px}
.md.nf-shipping{--nf-bg:#EEF3F7;--nf-bg2:#D9E3EC;--nf-acc:#0B4F8A;--nf-acc2:#083a66;--nf-h:#0B2A4A;--nf-hf:800 18px 'Bitter',Georgia,serif;--nf-sh:#D9E3EC}
.sh2-map{background:#0b2a4a;border-radius:22px;padding:6px;box-shadow:0 4px 0 #061a30;overflow:hidden}
.sh2-fl{display:flex;gap:8px;overflow-x:auto;scrollbar-width:none;padding-bottom:4px}
.sh2-fl::-webkit-scrollbar{display:none}
.sh2-s{flex:0 0 150px;background:#fff;border-radius:18px;padding:8px;box-shadow:0 3px 0 var(--nf-sh)}
.sh2-s .im{height:70px;border-radius:12px;background:linear-gradient(#cfe5f6 0 60%,#3a7fb8 60%);display:flex;align-items:center;justify-content:center;overflow:hidden}
.sh2-s .im svg{width:132px;height:auto}
.sh2-s b{display:block;font:800 13px 'Bitter',serif;margin-top:6px}
.sh2-s small{display:block;font-size:11.5px;color:var(--ink-3)}
.sh2-ev{display:flex;flex-wrap:wrap;gap:6px;margin-top:8px}.sh2-ev span{font:800 11.5px var(--fb);background:#FFE4E0;color:#C8352A;border-radius:8px;padding:4px 8px}
.sh2-ln{background:#fff;border-radius:18px;padding:12px;box-shadow:0 3px 0 var(--nf-sh)}.sh2-ln+.sh2-ln{margin-top:8px}
.sh2-ln .px{text-align:right;flex:0 0 auto}.sh2-ln .px b{font:800 17px 'Bitter',serif}.sh2-ln .px small{display:block;font-size:10.5px}
.sh2-lf{display:block;height:6px;border-radius:3px;background:#E3EAF1;margin:8px 0 4px;overflow:hidden}.sh2-lf em{display:block;height:100%}
.sh2-ac{display:flex;flex-wrap:wrap;gap:6px;margin-top:8px}.md.nf-shipping .sh2-ac .nf-b{flex:1 1 auto;font-size:12px;padding:0 10px}
.sh2-of{display:flex;gap:10px;align-items:center;background:#fff;border-radius:18px;padding:10px;box-shadow:0 3px 0 var(--nf-sh)}.sh2-of+.sh2-of{margin-top:8px}
.sh2-of .im{flex:0 0 64px;height:44px;border-radius:10px;background:linear-gradient(#cfe5f6 0 60%,#3a7fb8 60%);display:grid;place-items:center;overflow:hidden}.sh2-of .im svg{width:60px;height:auto}
.sh2-of .t{flex:1;min-width:0}.sh2-of b{display:block;font:800 13px var(--fb)}.sh2-of small{display:block;font-size:11.5px;color:var(--ink-3)}
.sh2-ty{display:grid;gap:8px}.sh2-ty>.nf-mr>div,.sh2-ty>div{background:#fff;border-radius:18px;padding:10px;box-shadow:0 3px 0 var(--nf-sh)}
.sh2-ty .im{display:flex;justify-content:center;height:64px;border-radius:12px;background:linear-gradient(#cfe5f6 0 60%,#3a7fb8 60%);overflow:hidden;align-items:center}.sh2-ty .im svg{width:120px;height:auto}
.sh2-ty b{display:block;font:800 14px 'Bitter',serif;margin-top:6px}.sh2-ty small{display:block;font-size:11.5px;color:var(--ink-3)}
.sh2-rg{font:800 10.5px var(--fb);letter-spacing:.1em;text-transform:uppercase;color:#0B4F8A;padding:10px 0 2px}.sh2-rg:first-child{padding-top:0}
.md.nf-renew{--nf-bg:#F0F6F1;--nf-bg2:#DCE9DF;--nf-acc:#13865B;--nf-acc2:#0d6143;--nf-h:#123B2C;--nf-hf:800 18px 'Exo 2','Baloo 2',sans-serif;--nf-sh:#DCE9DF}
.rn2-regs{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}
.rn2-rg{border:0;padding:0;border-radius:18px;overflow:hidden;background:#fff;box-shadow:0 3px 0 var(--nf-bg2);text-align:left;font:inherit;color:inherit}
.rn2-rg.sel{box-shadow:0 0 0 3px #13865B}
.rn2-rg .sc{height:96px}.rn2-rg .sc svg{display:block;width:100%;height:100%}
.rn2-rg .bd{padding:7px 9px 9px}
.rn2-rg b{display:block;font:800 13px 'Exo 2',sans-serif}
.rn2-rg .rt{display:flex;gap:6px;font:800 10.5px var(--fb);color:var(--ink-3);margin-top:2px}
.rn2-rg em{display:inline-block;font-style:normal;margin-top:4px;font:800 10.5px var(--fb);border-radius:6px;padding:1px 7px;background:#F0F6F1;color:#13865B}
.rn2-rg em.no{background:#FFE4E0;color:#C8352A}.rn2-rg em.wt{background:#FFF1C7;color:#875C00}.rn2-rg em.lk{background:#EEF0F3;color:var(--ink-3)}
.rn2-rg.lock .sc{filter:grayscale(.7) brightness(.95)}
.rn2-bat{display:grid;grid-template-columns:76px 1fr;gap:12px;align-items:center}
.rn2-bat .cell{position:relative;width:76px;height:112px;border-radius:14px;background:#1d2a33;box-shadow:inset 0 0 0 3px #3a4a55}
.rn2-bat .cell::before{content:'';position:absolute;top:-7px;left:25px;width:26px;height:9px;border-radius:4px 4px 0 0;background:#3a4a55}
.rn2-bat .lv{position:absolute;left:6px;right:6px;bottom:6px;border-radius:9px;background:linear-gradient(#5ef0a8,#13865B);box-shadow:0 0 14px rgba(94,240,168,.5)}
.rn2-bat .pc{position:absolute;left:0;right:0;top:44px;text-align:center;font:800 15px 'Exo 2',sans-serif;color:#fff;text-shadow:0 1px 2px rgba(0,0,0,.5)}
.al2-ln{background:#fff;border-radius:18px;padding:12px;box-shadow:0 3px 0 var(--nf-sh)}.al2-ln+.al2-ln{margin-top:8px}
.al2-ln .px{text-align:right;flex:0 0 auto}.al2-ln .px b{font:800 17px 'Archivo',sans-serif}.al2-ln .px small{display:block;font-size:10.5px}
.al2-seats{display:grid;grid-template-columns:repeat(15,1fr);gap:2px;margin:8px 0 4px}.al2-seats i{height:9px;border-radius:3px 3px 1px 1px;background:#E3E8F0}.al2-seats i.on{background:#5d7da8}.al2-seats i.biz.on{background:#C8102E}.al2-seats i.biz{background:#F4D3D9}
.sh2-ty .im.al{background:linear-gradient(#bfe0ff,#e9f4ff)}.sh2-ty .im.al svg{width:150px}
.rn2-pan{margin-top:10px}
.rn2-bld{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px;margin-top:10px}
.rn2-bld button{position:relative;border:0;border-radius:14px;background:#F0F6F1;padding:10px;text-align:left;font:inherit;color:var(--ink);min-height:44px}
.rn2-bld button[disabled]{opacity:.5}.rn2-bld .ic svg{width:26px;height:26px;fill:none;stroke:#13865B;stroke-width:1.8}
.rn2-bld b{display:block;font:800 13px var(--fb);margin-top:2px}.rn2-bld small{display:block;font-size:11px;color:var(--ink-3)}
.rn2-bld em{position:absolute;top:10px;right:10px;font:800 11px var(--fb);font-style:normal;color:#13865B}
.rn2-day{background:#0e2433;border-radius:20px;padding:12px;color:#cfe3d8;box-shadow:0 4px 0 #061620}
.rn2-day svg{display:block;width:100%;height:70px}.rn2-day .lg{display:flex;justify-content:space-between;font-size:11px;color:#9fb8ab}.rn2-day .lg b{color:#fff}
.rn2-day .nf-row b{color:#fff}.rn2-day .nf-row small{color:#9fb8ab}.rn2-day .nf-seg{background:rgba(255,255,255,.08)}.rn2-day .nf-seg button{color:#cfe3d8}
.md.nf-airline{--nf-bg:#F1F4FA;--nf-bg2:#DCE3F0;--nf-acc:#C8102E;--nf-acc2:#930b21;--nf-h:#14213D;--nf-hf:800 18px 'Archivo','Baloo 2',sans-serif;--nf-sh:#DCE3F0}
.al2-board{background:#111;border-radius:18px;padding:10px 8px;box-shadow:0 4px 0 #000}
.al2-board .hd,.al2-fl{display:grid;grid-template-columns:58px minmax(0,1fr) 50px 76px;gap:4px;align-items:center}
.al2-board .hd{color:#F2C94C;font:800 9.5px var(--fb);letter-spacing:.06em;padding:0 2px 6px}
.al2-fl{padding:3px 0;border-top:1px solid #222}
.al2-fl .ch{display:flex;gap:1px;overflow:hidden}
.al2-fl .ch i{font-style:normal;display:inline-block;width:9px;height:17px;line-height:17px;text-align:center;background:#1f1f1f;color:#f4f4f4;font:800 11px 'Courier New',monospace;border-radius:2px;position:relative;flex:0 0 auto}
.al2-fl .ch i::after{content:'';position:absolute;left:0;right:0;top:50%;height:1px;background:#000}
.al2-fl .st{white-space:nowrap;font:800 9.5px var(--fb);border-radius:4px;padding:2px 4px;text-align:center;color:#7dffa8}
.al2-fl .st.re{color:#ffcf4a}.al2-fl .st.bo{background:#7dffa8;color:#111}.al2-fl .st.off{color:#ff8a7d}
.al2-map{background:#0b1d3a;border-radius:22px;padding:6px;box-shadow:0 4px 0 #040f22;overflow:hidden}
.al2-fleet{display:flex;gap:8px;overflow-x:auto;scrollbar-width:none;padding-bottom:4px}
.al2-fleet::-webkit-scrollbar{display:none}
.al2-pl{flex:0 0 160px;background:#fff;border-radius:18px;padding:8px;box-shadow:0 3px 0 var(--nf-sh)}
.al2-pl .im{height:70px;border-radius:12px;background:linear-gradient(#bfe0ff,#e9f4ff);display:flex;align-items:center;justify-content:center;overflow:hidden}
.al2-pl .im svg{width:150px;height:auto}
.al2-pl b{display:block;font:800 13px 'Archivo',sans-serif;margin-top:6px}
.al2-pl small{display:block;font-size:11.5px;color:var(--ink-3)}
`);
NF_FONTS.push('fraunces:Fraunces:600','dmserif:DM Serif Display:400','cormorant:Cormorant Garamond:500','anton:Anton:400','oswald:Oswald:600','bitter:Bitter:800','exo2:Exo 2:800','archivo:Archivo:800');
const NF2_PAL=['#2563C9','#16804D','#8E44AD','#C8352A','#1F8A8A','#5B6052','#C9A227','#D45D8C'];
function nfWorld(pts,routes,o){ const W=NFA.world, P=W.PORT; Object.keys(pts).forEach(k=>{ P[k]=pts[k]; }); o=Object.assign({},o||{});
  if(!o.vb){ const X=Object.values(pts).map(p=>p[0]), Y=Object.values(pts).map(p=>p[1]); if(X.length){ let x0=Math.min(...X)-14, x1=Math.max(...X)+14, y0=Math.min(...Y)-12, y1=Math.max(...Y)+12, w=Math.max(160,x1-x0), h=Math.max(w/2,y1-y0); w=Math.max(w,h*2); const cx=(x0+x1)/2, cy=(y0+y1)/2; o.vb=(cx-w/2).toFixed(1)+' '+(cy-w/4).toFixed(1)+' '+w.toFixed(1)+' '+(w/2).toFixed(1); o.k=Math.max(.42,w/360*1.25); } } const k=o.k||1; let svg=W.worldMap(routes,Object.keys(pts).map(k2=>[k2,pts[k2][3]?1:0,1,(pts[k2][4]||5)*k,(pts[k2][5]||3)*k]),o);
  if(k!==1) svg=svg.replace(/font-size="7"/g,'font-size="'+(7*k).toFixed(2)+'"').replace(/ r="4"/g,' r="'+(4*k).toFixed(2)+'"').replace(/ r="2\.6"/g,' r="'+(2.6*k).toFixed(2)+'"').replace(/stroke-width="1\.6"/g,'stroke-width="'+(1.6*k).toFixed(2)+'"');
  return svg; }
const nfLL=(lat,lon,n,hub)=>[Math.round((lon+180)*10)/10,Math.round((90-lat)*10)/10,n,hub?1:0];
/* ---- intérim ---- */
FX2.staffing={
  chip:b=>plu(b.m.jobs.length,'poste')+' ouvert'+(b.m.jobs.length>1?'s':''),
  stat:b=>['Intérimaires en mission',String(b.m.int.length)],
  noRest:true,
  dlg:{txt:'peut proposer les candidats et fixer les tarifs à votre place'},
  body(b,X,U){ const m=b.m, F=NFA.people.face; let h=nfSec('Le vivier',plu(m.pool.length,'candidat'))+'<div class="st2-pool">'+m.pool.slice(0,8).map(c=>'<div class="st2-c">'+F(c.id*7919+523,52,'#E5EEFB')+esc(c.n.split(' ')[0])+'<small>'+ST_SEC[c.sec]+' · '+ST_LVL[c.l].n.toLowerCase()+'</small><em>'+c.q+' / 100</em></div>').join('')+'</div>'+
      '<div class="st2-k"><div><small>Postes ouverts</small><b>'+m.jobs.length+'</b></div><div><small>En mission</small><b>'+m.int.length+'</b></div><div><small>Recruteurs</small><b>'+stRec(b)+'</b></div></div>';
    X.get('prop'); const sel=ui.st&&ui.st.b===b.id? ui.st.j : 0;
    h+=nfSec('Les postes à pourvoir',plu(m.jobs.length,'poste'))+(m.jobs.length? '<div class="nf-mr" data-k="jobs" data-n="3">'+m.jobs.slice().sort((a,c)=>a.exp-c.exp).map(j=>{ const on=sel===j.id, f=j.cdi? 'placement définitif · commission d’environ '+eur(j.bud*(j.l>=3?.25:.15)*stPf(b),0) : 'intérim '+j.dur+' jours · environ '+eur(j.bud/220*.12*stPf(b),0)+' par jour';
      let x='<div class="st2-job'+(on?' on':'')+'"><div class="hd"><span class="lv">'+ST_LVL[j.l].n+'</span><span class="sec">'+ST_SEC[j.sec]+'</span><span class="exp">'+(j.prop? 'en attente' : 'expire dans '+plu(Math.max(0,j.exp-S.day),'jour'))+'</span></div><b>'+esc(j.cl)+'</b><small>qualité '+j.need+' minimum · budget '+eur(j.bud,0)+' par an · '+f+'</small>'+
        (j.prop? '<div class="st2-prop">'+NFA.people.face(j.prop.c.id*7919+523,36,'#E5EEFB')+'<span>Candidature de <b>'+esc(j.prop.c.n)+'</b> · '+Math.round(j.prop.p*100)+' % de chances</span></div>' : '<button class="btn nf-b'+(on?'':' a')+' w" style="margin-top:8px" data-a="stsel" data-i="'+b.id+'" data-v="'+(on?0:j.id)+'">'+(on?'Fermer':'Proposer un candidat')+'</button>')+'</div>';
      if(on){ const L=m.pool.map(c=>[c,stMatch(b,j,c)]).sort((a,c)=>c[1]-a[1]).slice(0,6);
        x+='<div class="st2-pick">'+(L.length? L.map(([c,pp])=>'<button data-a="met" data-i="'+b.id+'" data-v="prop" data-j="'+j.id+':'+c.id+'">'+NFA.people.face(c.id*7919+523,44,'#E5EEFB')+'<span><b>'+esc(c.n)+'</b><small>'+ST_LVL[c.l].n+' · '+ST_SEC[c.sec]+' · qualité '+c.q+' · demande '+eur(c.sal,0)+'</small></span><em class="'+(pp>=.6?'ok':'')+'">'+Math.round(pp*100)+' %</em></button>').join('') : '<div class="nf-row"><small>Vivier vide : augmentez la chasse de candidats.</small></div>')+'</div>'; }
      return x; }).join('')+'</div>' : '<div class="nf-card"><div class="nf-row"><small>Aucun poste pour le moment.</small></div></div>');
    h+='<div class="nf-row" style="margin:8px 4px 0"><small>Sans proposition de votre part, les recruteurs proposent eux-mêmes un profil proche au bout de 6 jours.</small></div>';
    h+=nfRest(b,X,'Décisions'); return h; }
};
/* ---- promotion immobilière ---- */
const PR2_ST=['etude','permis','vente','chantier','livre'];
FX2.promo={
  chip:b=>plu(b.m.ops.length,'opération')+' en cours',
  noRest:true,
  mgmt:{local:'Agence'},
  dlg:{txt:'peut acheter les terrains et lancer les opérations à votre place'},
  body(b,X,U){ const m=b.m, mk=m.mk, R0=metR0(b), cash=availFor(cityOf(b).ccy); ['prog','dens','eco','file','pr','start','sellrest','land'].forEach(a=>X.get(a));
    const Bt=(v,j,lab,o)=>{ o=o||{}; return '<button class="btn nf-b'+(o.a?' a':'')+'" data-a="met" data-i="'+b.id+'" data-v="'+v+'" data-j="'+j+'"'+(o.dis?' disabled':'')+'>'+lab+'</button>'; };
    const sg=(v,o,L,val)=>'<div class="nf-seg">'+L.map(([k,n,dis])=>'<button class="'+(String(val)===String(k)?'on':'')+'" data-a="met" data-i="'+b.id+'" data-v="'+v+'" data-j="'+o.id+':'+k+'"'+(dis?' disabled':'')+'>'+n+'</button>').join('')+'</div>';
    let h=nfSec('Les opérations',m.ops.length+' / '+prMax(b)+' en même temps');
    if(!m.ops.length) h+='<div class="pr2-op"><small>Aucune opération : achetez un terrain ci-dessous.</small></div>';
    m.ops.forEach(o=>{ const V=prVal(b,o), C=prCost(b,o), k=prStage(o);
      h+='<div class="pr2-op"><b>'+esc(o.n)+'</b><small>'+esc(o.cn)+' · '+prSize(o.s*PR_DENS[o.dens].f)+' · '+PR_PROG[o.prog].n.toLowerCase()+(o.eco?' · écoquartier':'')+'</small><div class="pr2-st">'+PR_ST.map((s2,i)=>(i?'<i></i>':'')+'<span class="'+(i<k?'done':i===k?'on':'')+'">'+s2+'</span>').join('')+'</div>';
      if(o.stage==='etude'){ const rk=o.r*PR_DENS[o.dens].r*(o.eco?.5:1);
        h+='<div class="nf-ctl" style="margin-top:10px">'+nfRowH('Programme','')+sg('prog',o,Object.keys(PR_PROG).map(x=>[x,PR_PROG[x].n,PR_PROG[x].rk&&!mxHas(b,PR_PROG[x].rk)]),o.prog)+'</div>'+
          '<div class="nf-ctl" style="margin-top:10px">'+nfRowH('Densité','plus dense : plus de surface à vendre, mais un permis plus long et plus de recours')+sg('dens',o,PR_DENS.map((x,i)=>[i,x.n,x.rk&&!mxHas(b,x.rk)]),o.dens)+'</div>'+
          (mxHas(b,2)? '<div style="margin-top:10px">'+nfRowH('Label écoquartier','prix +15 %, coût +8 %, deux fois moins de recours',Bt('eco',o.id,o.eco?'Retirer':'Ajouter'))+'</div>' : '')+
          '<div class="pr2-k"><div><small>Prix de vente estimé</small><b>'+eur(V,0)+'</b></div><div><small>Coût du chantier</small><b>'+eur(C,0)+'</b><small>'+prDur(o)+' jours</small></div><div><small>Risque de recours</small><b>'+Math.round(rk*100)+' %</b></div></div>'+
          '<div style="margin-top:10px">'+nfRowH('Déposer le permis',eur(R0*2,0)+' · réponse en 40 à 60 jours'+(PR_DENS[o.dens].pd?' (+'+PR_DENS[o.dens].pd+' j)':''),Bt('file',o.id,'Déposer',{a:1,dis:cash<R0*2}))+'</div>'; }
      else if(o.stage==='permis') h+='<div class="nf-row" style="margin-top:8px"><small>Instruction du permis : réponse dans '+plu(Math.max(0,o.pe-S.day),'jour')+(o.rc===2?' (recours en cours)':'')+'.</small></div>';
      else { const pace=prPace(b,o);
        h+='<div class="pr2-bar"><span>Vendu sur plan · '+Math.round(o.sold*100)+' %</span><b>'+eur(o.sv,0)+'</b><i><em style="width:'+Math.round(o.sold*100)+'%"></em></i><small>'+(o.sold<1? 'environ '+String(Math.round(pace*30000)/10).replace('.',NDEC)+' % par mois' : 'tout est vendu')+'</small></div>'+
          (o.stage==='chantier'? '<div class="pr2-bar"><span>Chantier</span><b>'+eur(o.cc,0)+'</b><i><em style="width:'+Math.round(o.cp*100)+'%;background:#E0A21B"></em></i><small>livraison dans '+plu(Math.max(0,Math.round((1-o.cp)*o.cd)),'jour')+(o.loan?' · crédit de '+eur(o.loan,0)+' à '+prRate():'')+(o.late?' · en retard':'')+'</small></div>' : '')+
          '<div class="nf-row" style="margin-top:6px"><small>Encaissé : '+eur(o.rec,0)+' (20 % à la signature, 70 % au fil du chantier, 10 % à la livraison)</small></div>';
        if(o.sold<1) h+='<div class="nf-ctl" style="margin-top:8px">'+nfRowH('Prix : '+(o.pr>=1?'+':'')+Math.round((o.pr-1)*100)+' % par rapport au marché','plus cher, chaque lot rapporte plus mais se vend moins vite')+'<div class="nf-seg">'+[[-.05,'−5 %'],[-.02,'−2 %'],[.02,'+2 %'],[.05,'+5 %']].map(([v,n])=>'<button data-a="met" data-i="'+b.id+'" data-v="pr" data-j="'+o.id+':'+v+'">'+n+'</button>').join('')+'</div></div>';
        if(o.stage==='vente'){ const ok3=o.sold>=.3; h+='<div style="margin-top:8px">'+nfRowH(ok3?'Lancer le chantier':'Lancer avec un crédit',(ok3?'assez de ventes signées : la banque suit':'il faut 30 % de surface vendue, ou un crédit promoteur (70 % du coût, intérêts '+prRate()+')')+' · coût '+eur(prCost(b,o),0),ok3?Bt('start',o.id+':0','Lancer',{a:1}):Bt('start',o.id+':1','Crédit'))+'</div>'; }
        if(o.stage==='livre'&&o.sold<1) h+='<div style="margin-top:8px">'+nfRowH('Céder le reste','opération livrée : les derniers lots partent en bloc à un investisseur (décote de 20 %)',Bt('sellrest',o.id,'Céder'))+'</div>'; }
      h+='</div>'; });
    h+=nfSec('Le marché','taux '+prRate())+'<div class="pr2-mk">'+[['Logements',mk.log.v],['Bureaux',mk.bur.v],['Commerces',mk.com.v]].map(x=>'<div><small>'+x[0]+'</small><b>'+Math.round(x[1]*100)+'</b></div>').join('')+'</div>';
    const full=m.ops.length>=prMax(b);
    h+=nfSec('Les terrains à vendre','nouveaux dans '+plu(Math.max(0,m.landNext-S.day),'jour'))+'<div class="nf-mr" data-k="land" data-n="2">'+m.land.map(L=>'<div class="pr2-land"><span class="bp">'+NFA.build.blueprint(L.s>=1.3?'imm':'mais',84).replace('<svg ','<svg style="width:84px;height:auto" ')+'</span><div class="t"><b>'+esc(L.n)+'</b><small>'+esc(L.cn)+' · '+prSize(L.s)+' · quartier '+(L.q>=1.2?'très recherché':L.q>=1?'recherché':L.q>=.85?'ordinaire':'populaire')+' · riverains '+(L.r>.2?'très vigilants':L.r>.12?'vigilants':'calmes')+'</small><div class="nf-row"><b style="font:400 20px \'DM Serif Display\',serif">'+eur(L.price,0)+'</b>'+Bt('land',L.id,'Acheter',{a:1,dis:full||cash<L.price})+'</div></div></div>').join('')+'</div>';
    h+=nfRest(b,X,'Décisions'); return h; }
};
/* ---- immobilier de bureaux ---- */
FX2.office={
  chip:b=>{ const d=b.m.st||ofDay(b); return 'Occupation '+Math.round((d.lf||0)*100)+' %'; },
  stat:b=>{ const d=b.m.st||ofDay(b); return ['Occupation',Math.round((d.lf||0)*100)+' %']; },
  noRest:true,
  mgmt:{local:'Siège'},
  dlg:{txt:'peut louer les étages et entretenir les immeubles à votre place'},
  body(b,X,U){ const m=b.m, can=x=>mAvail(b)>=x; ['srv','work','sellb','lease','evict','buyb'].forEach(a=>X.get(a));
    const Bt=(lab,act,arg,o)=>{ o=o||{}; return '<button class="btn nf-b'+(o.a?' a':'')+'" data-a="met" data-i="'+b.id+'" data-v="'+act+'"'+(arg!==undefined?' data-j="'+esc(String(arg))+'"':'')+(o.dis?' disabled':'')+'>'+lab+'</button>'; };
    const tower=(B,on)=>{ const wk=B.wk&&B.wk.until>S.day; return '<div class="of2-t'+(on?' on':'')+'"><div class="bd" style="height:'+(16+B.nf*12)+'px">'+B.fl.map(t=>{ const T=t&&m.tn.find(x=>x.id===t); return '<span class="fl'+(wk?' wk':T?(T.sat<40?' bad':' on'):'')+'">'+'<i></i>'.repeat(5)+'</span>'; }).join('')+'</div><b>'+esc(B.n)+'</b><small>'+B.fl.filter(Boolean).length+' / '+B.nf+' étages · '+OF_STD[B.std].toLowerCase()+'</small></div>'; };
    const selB=U.bd? m.bd.find(B=>B.id===+U.bd) : null;
    let h=nfSec('Les immeubles','touchez un immeuble')+'<div class="of2-sky">'+m.bd.map(B=>'<button class="of2-bt" data-a="nfui" data-i="'+b.id+'" data-v="bd" data-j="'+B.id+'" aria-label="'+esc(B.n)+'">'+tower(B,selB&&selB.id===B.id)+'</button>').join('')+'</div>';
    if(selB){ const B=selB, x=B.st||ofBdDay(b,B), wk=ofWorks(B)? OF_WORK[B.wk.k].n+' jusqu’au '+dateL(B.wk.until) : '';
      h+='<div class="nf-card of2-pan"><b class="nm">'+esc(B.n)+(B.main?' (siège)':'')+'</b><small>'+esc(ofDist(b,B.dist).n)+' · '+B.nf+' étages de '+fmtN(Math.round(ofM2f(B)),0)+' m² · standing « '+OF_STD[B.std]+' » · état '+Math.round(B.cond)+' %'+(B.lbl?' · label énergie':'')+'</small>'+
        '<div class="of2-k"><div><small>Loyer de marché</small><b>'+eur(ofMkt(b,B),0)+'</b><small>/ m² / an</small></div><div><small>Résultat</small><b class="'+cls(x.net)+'">'+signed(x.net,0)+'</b><small>par jour</small></div><div><small>État</small><b>'+Math.round(B.cond)+' %</b><small>'+(wk?esc(wk):'entretien')+'</small></div></div>'+
        '<div class="lab">SERVICES</div><div class="of2-ac">'+Object.keys(OF_SRV).map(k=>ofSrvOn(B,k)? Bt('Fermer : '+OF_SRV[k].n.toLowerCase(),'srv',B.id+':'+k) : Bt(OF_SRV[k].n+' · '+eur(ofSrvCost(B,k),0),'srv',B.id+':'+k,{dis:!can(ofSrvCost(B,k))})).join('')+'</div>'+
        (ofWorks(B)? '' : '<div class="lab">TRAVAUX '+helpQ('Travaux dans les immeubles','Rafraîchissement : l’état remonte à 100 %. Rénovation lourde : un cran de standing (loyers plus élevés). Label énergie : charges −15 % et loyers +8 %, dès le standing « Haut de gamme ». Pendant les travaux, aucun nouveau locataire et des occupants moins satisfaits.')+'</div><div class="of2-ac">'+Object.keys(OF_WORK).filter(k=>!(k==='lbl'&&(B.lbl||B.std<3))&&!(k==='reno'&&B.std>=(m.pre?5:4))).map(k=>{ const c=Math.round(OF_WORK[k].c(B)*(m.fm?.9:1)/1000)*1000; return Bt(OF_WORK[k].n+' · '+eur(c,0),'work',B.id+':'+k,{dis:!can(c)}); }).join('')+(B.main?'':Bt('Vendre · '+eur(ofValue(b,B)*.95,0),'sellb',B.id))+'</div>')+'</div>'; }
    h+=nfSec('Les sociétés intéressées',m.pr.length+' en recherche'+(ofEv(m,'tt')?' · télétravail':''))+(m.pr.length? '<div class="nf-mr" data-k="pros" data-n="2">'+m.pr.slice().sort((x,y)=>(y.gc-x.gc)||(y.mult-x.mult)).map(P=>{ const ok=m.bd.filter(B=>!ofWorks(B)&&B.std>=P.std&&ofFree(B).length>=P.k).sort((x,y)=>ofMkt(b,y)-ofMkt(b,x)).slice(0,2);
      return '<div class="of2-pr'+(P.gc?' gc':'')+'"><div class="nf-row"><span><b>'+esc(P.n)+(P.gc?' · grand compte':'')+'</b><small>'+plu(P.k,'étage')+' · standing « '+OF_STD[P.std]+' » au moins · bail de '+P.yrs+' ans · '+OF_RISK[P.risk].toLowerCase()+' · jusqu’au '+dateS(P.exp)+'</small></span></div>'+
        (ok.length? ok.map(B=>{ const r=ofMkt(b,B)*P.mult; return '<div class="of2-l"><span>'+esc(B.n)+' · <b>'+eur(r,0)+'</b> / m² / an ('+Math.round(P.mult*100)+' % du marché)</span><div class="of2-ac">'+Bt('Louer','lease',P.id+':'+B.id+':0',{a:1})+Bt('Négocier +8 %','lease',P.id+':'+B.id+':1')+'</div></div>'; }).join('')
          : '<div class="nf-row" style="margin-top:6px"><small>'+(m.bd.some(B=>B.std>=P.std)? 'Pas assez d’étages libres pour le moment dans vos immeubles « '+OF_STD[P.std]+' » ou plus.' : 'Standing insuffisant : rénovez un immeuble ou achetez-en un « '+OF_STD[P.std]+' ».')+'</small></div>')+'</div>'; }).join('')+'</div>' : '<div class="nf-card"><div class="nf-row"><small>Personne pour le moment : de nouvelles sociétés se présentent régulièrement.</small></div></div>')+
      '<div class="nf-row" style="margin:6px 4px 0"><small>Négocier fait gagner 8 % de loyer, mais une société sur deux refuse. Une société fragile peut faire faillite.</small></div>';
    if(m.tn.length) h+=nfSec('Les locataires',plu(m.tn.length,'bail').replace('bails','baux'))+'<div class="nf-card nf-list">'+'<div class="nf-mr" data-k="ten" data-n="4">'+m.tn.slice().sort((x,y)=>x.until-y.until).map(t=>{ const B=ofBd(b,t.bd); return nfRowH(esc(t.n),esc(B?B.n:'')+' · '+plu(t.fl.length,'étage')+' · '+eur(t.r,0)+' / m² par an · fin le '+dateL(t.until)+' · satisfaction '+Math.round(t.sat),Bt('Faire partir','evict',t.id)); }).join('')+'</div>'+'</div><div class="nf-row" style="margin:6px 4px 0"><small>À la fin du bail, un locataire satisfait renouvelle au loyer du marché. Faire partir un locataire coûte six mois de loyer.</small></div>';
    if(m.bo.length) h+=nfSec('Les immeubles à vendre',esc(D.CITIES[b.city].n))+'<div class="nf-mr" data-k="bo" data-n="1">'+m.bo.map(o=>'<div class="of2-pr"><div class="nf-row"><span><b>'+esc(o.n)+'</b><small>'+esc(ofDist(b,o.dist).n)+' · '+o.nf+' étages · '+fmtN(o.m2,0)+' m² · « '+OF_STD[o.std]+' » · état '+o.cond+' % · '+o.occ+' étage'+(o.occ>1?'s':'')+' déjà loué'+(o.occ>1?'s':'')+' · jusqu’au '+dateS(o.exp)+'</small></span></div><div class="of2-ac" style="margin-top:6px">'+Bt('Acheter · '+eur(o.price,0),'buyb',o.id,{a:1,dis:!can(o.price)||m.bd.length>=8})+'</div></div>').join('')+'</div>';
    h+=nfRest(b,X,'Décisions'); return h; }
};
/* ---- studio ---- */
FX2.studio={
  chip:b=>b.m.prj.length? plu(b.m.prj.length,'projet')+' en production' : plu(b.m.cat.length,'titre')+' au catalogue',
  stat:b=>['Catalogue',plu(b.m.cat.length,'titre')],
  noRest:true,
  mgmt:{local:'Plateaux'},
  dlg:{txt:'peut choisir les projets et les talents à votre place'},
  body(b,X,U){ const m=b.m, Po=NFA.people.poster, L=m.prj.map(p=>Object.assign({prod:1},p)).concat(m.cat.slice(-8).reverse());
    let h=nfSec('L’affiche',m.prj.length? 'en production et au catalogue' : 'au catalogue')+'<div class="sd2-cat">'+(L.length? L.map(x=>'<div class="sd2-p'+(x.prod?' prod':'')+'"><div class="im">'+Po(x.g,x.n,104)+(x.prod? '' : '<em>'+x.sc+'</em>')+'</div><b>'+esc(x.n)+'</b><small>'+(x.prod? 'sortie dans '+plu(x.left,'jour') : esc(SD_GEN[x.g]||''))+'</small></div>').join('') : '<div style="color:#A9A39A;font-size:13px">Aucun titre pour le moment.</div>')+'</div>';
    X.get('start'); const P=sdDraft(b), cost=sdCost(b,P), q=sdQual(b,P), can=nfCan(b,cost*.2), Po2=NFA.people.poster;
    const trend=g=>{ const v=m.gtr[g].v; return v>=1.4?'en vogue':v>=1?'porteur':v>=.7?'calme':'boudé'; };
    if(m.prj.length) h+=nfSec('Les tournages',plu(m.prj.length,'projet'))+m.prj.map(p=>'<div class="sd2-sh"><span class="cl">'+Po2(p.g,p.n,56)+'</span><div class="t"><b>'+esc(p.n)+'</b><small>'+SD_TYPE[p.t].n+' · '+SD_GEN[p.g]+(p.drap?' · tournage difficile':'')+'</small><i><em style="width:'+Math.round((1-p.left/p.dur)*100)+'%"></em></i><small>sortie dans '+plu(p.left,'jour')+'</small></div></div>').join('');
    h+=nfSec('Nouveau projet','qualité attendue '+Math.round(q*100)+' / 100')+'<div class="sd2-new"><div class="lab">FORMAT</div><div class="sd2-ch">'+Object.keys(SD_TYPE).map(k=>{ const lk=SD_TYPE[k].rk&&!mxHas(b,SD_TYPE[k].rk); return '<button class="'+(P.t===k?'on':'')+'" data-a="sdset" data-i="'+b.id+'" data-j="t" data-v="'+k+'"'+(lk?' disabled data-why="Palier '+SD_TYPE[k].rk+' requis."':'')+'>'+esc(SD_TYPE[k].n)+'<small>'+SD_TYPE[k].d+' jours</small></button>'; }).join('')+'</div>'+
      '<div class="lab">GENRE</div><div class="sd2-gen">'+Object.keys(SD_GEN).map(k=>'<button class="'+(P.g===k?'on':'')+'" data-a="sdset" data-i="'+b.id+'" data-j="g" data-v="'+k+'">'+Po2(k,SD_GEN[k],62)+'<small class="'+(m.gtr[k].v>=1?'up':'dn')+'">'+trend(k)+'</small></button>').join('')+'</div>'+
      '<div class="lab">BUDGET</div><div class="sd2-ch">'+SD_BUD.map((x,i)=>'<button class="'+(P.bud===i?'on':'')+'" data-a="sdset" data-i="'+b.id+'" data-j="bud" data-v="'+i+'">'+esc(x.n)+'</button>').join('')+'</div>'+
      '<div class="lab">TALENTS · 2 AU PLUS</div><div class="sd2-tal">'+'<div class="nf-mr" data-k="tal" data-n="6">'+m.tal.map(t=>{ const on=P.tal.includes(t.id), busy=m.prj.some(p=>p.tal.includes(t.id));
        return '<button class="'+(on?'on':'')+'" data-a="sdtal" data-i="'+b.id+'" data-v="'+t.id+'"'+(busy?' disabled data-why="En tournage."':'')+'>'+NFA.people.face(t.id*7919+523,46,'#2A2A32')+'<b>'+esc(t.n)+'</b><small>'+t.role+' · '+'★'.repeat(t.fame)+'<br>à l’aise en '+SD_GEN[t.g].toLowerCase()+'</small><em>'+eur(metR0(b)*SD_FEE[t.fame],0)+'</em></button>'; }).join('')+'</div>'+'</div>'+
      '<div class="sd2-go"><span><b>'+eur(cost,0)+'</b><small>payé au fil du tournage</small></span><button class="btn nf-b a" data-a="met" data-i="'+b.id+'" data-v="start" data-j="'+P.t+':'+P.g+':'+P.bud+':'+(P.tal[0]??'')+':'+(P.tal[1]??'')+'"'+(can?'':' disabled')+'>Lancer le tournage</button></div></div>';
    const top=m.cat.slice().sort((a,c)=>sdRights(b,c)-sdRights(b,a)).slice(0,5);
    if(top.length) h+=nfSec('Les droits','les titres qui rapportent le plus')+'<div class="nf-card nf-list">'+top.map(x=>nfRowH(esc(x.n),SD_TYPE[x.t].n+' · '+SD_GEN[x.g]+' · audience '+x.sc+' / 100','<b style="white-space:nowrap;font-size:13px">'+eur(sdRights(b,x),0)+' / j</b>')).join('')+'</div>';
    h+=nfRest(b,X,'Décisions'); return h; }
};
/* ---- entrepôt ---- */
FX2.warehouse={
  chip:b=>{ const d=b.m.st||whDay(b); return fmtN(d.used,0)+' palettes sur '+fmtN(d.cap,0); },
  stat:b=>{ const d=b.m.st||whDay(b); return ['Remplissage',Math.round(d.occ*100)+' %']; },
  noRest:true,
  mgmt:{local:'Bâtiment'},
  dlg:{role:'chef d’entrepôt', txt:'peut signer les contrats et gérer les camions à votre place'},
  body(b,X,U){ const m=b.m, d=m.st||whDay(b), N=80, cap=Math.max(1,d.cap); let cells=[];
    m.ct.forEach((c,k)=>{ const n=Math.round(c.pal/cap*N); for(let i=0;i<n&&cells.length<N;i++) cells.push(NF2_PAL[k%NF2_PAL.length]); });
    const rows=[0,1,2,3,4].map(r=>'<div class="wh2-ai">'+Array.from({length:16},(_,i)=>{ const c=cells[r*16+i]; return '<i'+(c?' style="background:'+c+'"':'')+'></i>'; }).join('')+'</div>').join('');
    let h=nfSec('Les allées','vue du dessus')+'<div class="wh2-floor">'+rows+'<div class="wh2-dock">'+[1,2,3,4].map(i=>'<span class="'+(i<=m.tr?'on':'')+'">Quai '+i+(i<=m.tr?' · camion':'')+'</span>').join('')+'</div>'+
      '<div class="wh2-lg">'+m.ct.slice(0,8).map((c,k)=>'<span><i style="background:'+NF2_PAL[k%NF2_PAL.length]+'"></i>'+esc(c.n)+'</span>').join('')+'<span><i style="background:#E9EBE4"></i>libre</span></div></div>';
    X.get('sign'); X.get('end'); const capW=whCap(b), usedW=whUsed(b);
    h+='<div class="nf-card wh2-st"><div class="nf-row"><span><b>'+fmtN(usedW,0)+' / '+fmtN(capW,0)+' palettes'+(m.fr?' · froid '+fmtN(whFrUsed(b),0)+' / '+fmtN(whFrCap(b),0):'')+'</b><small>'+WH_EQ[m.eq].n+' · '+fmtN(Math.round(d.mv))+' mouvements par jour'+(d.late>1?' · '+fmtN(Math.round(d.late))+' en retard':'')+'</small></span>'+helpQ('Fonctionnement de l’entrepôt','Chaque client paie ses palettes chaque jour, week-end compris, et chaque entrée ou sortie. Trop de mouvements pour l’équipement : des retards, plus chers et mal vus. Vos usines de la même ville gardent leur stock plus longtemps.')+'</div><i class="wh2-g"><em style="width:'+Math.round(clamp(usedW/Math.max(1,capW),0,1)*100)+'%"></em></i></div>';
    h+=nfSec('Les clients intéressés',plu(m.off.length,'offre'))+(m.off.length? '<div class="nf-mr" data-k="whoff" data-n="2">'+m.off.slice().sort((x,y)=>(y.big-x.big)||(y.p*y.pal-x.p*x.pal)).map(o=>{ const fit=usedW+o.pal<=capW&&(!o.fr||(m.fr&&whFrUsed(b)+o.pal<=whFrCap(b)));
      return '<div class="wh2-of'+(o.big?' big':'')+'"><div class="nf-row"><span><b>'+esc(o.n)+(o.big?' · grand compte':'')+'</b><small>'+esc(o.sec)+(o.fr?' · sous température':'')+' · '+fmtN(o.pal,0)+' palettes · '+o.mo+' mois · jusqu’au '+dateS(o.exp)+'</small></span><span class="px"><b>'+fmtN(o.p,2)+' €</b><small>palette · jour</small></span></div>'+
        (fit? '<div class="wh2-ac"><button class="btn nf-b a" data-a="met" data-i="'+b.id+'" data-v="sign" data-j="'+o.id+':0">Signer</button><button class="btn nf-b" data-a="met" data-i="'+b.id+'" data-v="sign" data-j="'+o.id+':1">Négocier +8 %</button></div>' : '<div class="nf-row" style="margin-top:6px"><small style="color:#C8352A">'+(o.fr&&!m.fr? 'Il faut une zone frigorifique.' : 'Pas assez de place.')+'</small></div>')+'</div>'; }).join('')+'</div>' : '<div class="nf-card"><div class="nf-row"><small>Aucune offre pour le moment.</small></div></div>');
    h+=nfSec('Les contrats de stockage',plu(m.ct.length,'contrat'))+'<div class="nf-card nf-list">'+'<div class="nf-mr" data-k="whct" data-n="4">'+m.ct.slice().sort((x,y)=>x.until-y.until).map(c=>{ const k=m.ct.indexOf(c);
      return nfRowH('<span class="dc2-dot" style="background:'+NF2_PAL[k%NF2_PAL.length]+'"></span>'+esc(c.n),fmtN(c.pal,0)+' palettes'+(c.fr?' sous température':'')+' · '+fmtN(c.p,2)+' € par palette et par jour · fin le '+dateL(c.until)+' · satisfaction '+Math.round(c.sat),'<button class="btn nf-b" data-a="met" data-i="'+b.id+'" data-v="end" data-j="'+c.id+'">Rompre</button>'); }).join('')+'</div>'+'</div>';
    h+=nfRest(b,X,'L’équipement'); return h; }
};
/* ---- compagnie maritime ---- */
FX2.shipping={
  chip:b=>plu(b.m.ln.length,'ligne')+' · '+plu(b.m.fl.length,'navire'),
  stat:b=>['Indice conteneurs',String(Math.round(b.m.ci*100))],
  noRest:true,
  mgmt:{local:'Terminaux'},
  dlg:{role:'directeur de l’armement', txt:'peut ouvrir des lignes, louer des navires et accepter le fret à votre place'},
  body(b,X,U){ const m=b.m, pts={}, R=[], col=['#8ff0bf','#F2C94C','#ffb3a8','#9fd0e6','#c6b3ff'];
    m.tm.forEach(t=>{ const p=shPt(t.id||t); if(p) pts['sh_'+p.id]=nfLL(p.lat,p.lon,p.n,1); });
    m.ln.forEach((l,k)=>{ const a=shPt(l.a), c=shPt(l.b); if(!a||!c) return; pts['sh_'+a.id]=pts['sh_'+a.id]||nfLL(a.lat,a.lon,a.n); pts['sh_'+c.id]=pts['sh_'+c.id]||nfLL(c.lat,c.lon,c.n); R.push(['sh_'+a.id,'sh_'+c.id,col[k%col.length],14,null,'0',k<3?10+k*4:0]); });
    const G={pts:[], routes:[]}; m.tm.forEach(t=>{ const p=shPt(t.id||t); if(p) G.pts.push([p.lat,p.lon,1]); });
    m.ln.forEach((l,k)=>{ const a=shPt(l.a), c=shPt(l.b); if(!a||!c) return; [a,c].forEach(p=>{ if(!G.pts.some(q=>q[0]===p.lat&&q[1]===p.lon)) G.pts.push([p.lat,p.lon,0]); });
      let P; try{ P=glbSeaRoute(shPath(l.a,l.b,m,false).pts); }catch(e){ P=glbArc([a.lat,a.lon],[c.lat,c.lon],40).p; } const n=m.fl.filter(f=>f.ln===l.id&&!(f.down>S.day)).length; G.routes.push({p:P,c:col[k%col.length],n:Math.min(4,n),sp:22+P.length*.08,back:1}); });
    m.fl.filter(f=>f.ch).forEach(f=>{ const a=shPt(f.ch.a), c=shPt(f.ch.b); if(!a||!c) return; let P; try{ P=glbSeaRoute(shPath(f.ch.a,f.ch.b,m,!(SH_TY[f.t]||{}).pan).pts); }catch(e){ P=glbArc([a.lat,a.lon],[c.lat,c.lon],40).p; } G.routes.push({p:P,c:'#ffffff',dash:1,n:1,sp:30}); [a,c].forEach(p=>{ if(!G.pts.some(q=>q[0]===p.lat&&q[1]===p.lon)) G.pts.push([p.lat,p.lon,0]); }); });
    let h=nfSec('La carte des lignes','vos navires en mer')+glbHtml('sh'+b.id,G,{l:'Globe : terminaux et lignes de la compagnie',leg:'<span><i class="h"></i>Terminal</span><span><i></i>Escale</span>'+(m.fl.some(f=>f.ch)?'<span><i class="l" style="background:#fff"></i>Affrètement</span>':'')});
    const kk=t=>{ const T=SH_TY[t]; return !T? 'pc' : T.k==='bulk'? 'vr' : T.k==='tank'? 'pt' : 'pc'; };
    h+=nfSec('La flotte',plu(m.fl.length,'navire'))+'<div class="sh2-fl">'+m.fl.map((f,i)=>{ const T=SH_TY[f.t]||{n:f.t,d:''}, L=m.ln.find(l=>l.id===f.ln);
      return '<div class="sh2-s"><div class="im">'+NFA.ship.ship(kk(f.t),132,i%2?'#C8352A':'#1F4E8A')+'</div><b>'+esc(T.n)+'</b><small>'+esc(T.d)+'</small><small>'+esc(shShipState(m,f))+'</small>'+(f.ch||f.yard>S.day? '' : '<button class="btn nf-b w" style="margin-top:6px;font-size:12px" data-a="met" data-i="'+b.id+'" data-v="drop" data-j="'+f.id+'">'+(f.own?'Revendre · '+eur(shResale(f),0):'Rendre')+'</button>')+(f.own||f.yard>S.day? '' : '<button class="btn nf-b a w" style="margin-top:6px;font-size:12px" data-a="met" data-i="'+b.id+'" data-v="own" data-j="'+f.id+'"'+(mAvail(b)<shBuyOutCost(f)?' disabled':'')+'>Racheter · '+eur(shBuyOutCost(f),0)+'</button>')+'</div>'; }).join('')+'</div>';
    ['price','off','close','drop','own','lease','occ','yard','tm','ext'].forEach(a=>X.get(a)); const can=x=>mAvail(b)>=x;
    const Bt=(lab,act,arg,o)=>{ o=o||{}; return '<button class="btn nf-b'+(o.a?' a':'')+'" data-a="met" data-i="'+b.id+'" data-v="'+act+'"'+(arg!==undefined?' data-j="'+esc(String(arg))+'"':'')+(o.dis?' disabled':'')+'>'+lab+'</button>'; };
    const EV={suez:'Suez fermé · détour par le Cap', pan:'Panama restreint · détour par le cap Horn', fuel:'Fioul 30 % plus cher'};
    const evs=(m.ev||[]).filter(e=>EV[e.k]&&e.until>=S.day);
    h=h.replace('<div class="sh2-map">'+'','<div class="sh2-map">');
    if(evs.length) h+='<div class="sh2-ev">'+evs.map(e=>'<span>'+EV[e.k]+' · '+plu(e.until-S.day+1,'jour')+'</span>').join('')+'</div>';
    /* lignes */
    h+=nfSec('Les lignes régulières',m.ln.length? m.ln.length+' en service' : 'aucune ligne')+'<div class="nf-mr" data-k="shln" data-n="3">'+m.ln.map(l=>{ const x=l.st||shLineDay(b,l), P=m.fl.filter(p=>p.ln===l.id), path=shPath(l.a,l.b,m,false), on=ui.lnG===l.id, lf=x.lf||0;
      return '<div class="sh2-ln"><div class="nf-row"><span><b>'+esc(shPt(l.a).n)+' ⇄ '+esc(shPt(l.b).n)+'</b><small>'+fmtN(x.d||path.d,0)+' km'+(path.canal? ' · canal de '+(path.canal==='suez'?'Suez':'Panama') : '')+(path.aden?' · golfe d’Aden':'')+' · '+(P.length? P.map(p=>SH_TY[p.t].n).join(', ') : 'aucun navire')+'</small></span><span class="px"><b class="'+cls(x.net||0)+'">'+signed(x.net||0,0)+'</b><small>par jour</small></span></div>'+
        '<i class="sh2-lf"><em style="width:'+Math.round(lf*100)+'%;background:'+(lf>.95?'#E0A21B':'#2BB673')+'"></em></i><div class="nf-row"><small>'+fmtN(Math.round(x.teu||0))+' EVP par jour sur '+fmtN(Math.round(x.cap||0))+' · remplissage '+Math.round(lf*100)+' % · demande '+fmtN(Math.round(x.want||0))+' · prix '+Math.round((SH_PRICE[l.p]||1)*100)+' %</small></div>'+
        (on? '<div class="sh2-ac">'+Bt('Prix −','price',l.id+':'+Math.max(0,l.p-1),{dis:l.p<=0})+Bt('Prix +','price',l.id+':'+Math.min(3,l.p+1),{dis:l.p>=3})+'<button class="btn nf-b" data-a="shadd" data-i="'+b.id+'" data-j="'+l.id+'">Ajouter un navire</button>'+(P.length>1? Bt('Retirer un navire','off',P[P.length-1].id) : '')+Bt('Fermer la ligne','close',l.id)+'<button class="btn nf-b a" data-a="lng" data-i="0">Terminé</button></div>' : '<div class="sh2-ac"><button class="btn nf-b" data-a="lng" data-i="'+l.id+'">Gérer la ligne</button></div>')+'</div>'; }).join('')+'</div>'+
      '<button class="btn nf-b a w" style="margin-top:8px" data-a="shnew" data-i="'+b.id+'">Ouvrir une ligne</button>';
    /* affrètement */
    const bulk=m.fl.filter(p=>SH_TY[p.t].k!=='box');
    h+=nfSec('L’affrètement','indice du vrac '+Math.round(m.bi*100)+' · '+bulk.filter(p=>p.ch).length+' voyage(s)')+'<div class="nf-mr" data-k="shof" data-n="2">'+m.off.slice().sort((x,y)=>y.pay/y.days-x.pay/x.days).map(o=>{ const ok=m.fl.some(p=>SH_TY[p.t].k===o.k&&SH_TY[p.t].cap>=o.q&&shFree(m,p));
      return '<div class="sh2-of"><span class="im">'+NFA.ship.ship(o.k==='bulk'?'vr':'pt',64,'#1F4E8A')+'</span><div class="t"><b>'+esc(o.c.charAt(0).toUpperCase()+o.c.slice(1))+' · '+esc(shPt(o.a).n)+' → '+esc(shPt(o.b).n)+'</b><small>'+fmtN(o.q,0)+' t · '+(o.k==='bulk'?'vraquier':'pétrolier')+' · environ '+o.days+' jours · ≈ '+eur(o.pay/o.days,0)+' / j · jusqu’au '+dateS(o.exp)+'</small></div><button class="btn nf-b'+(ok?' a':'')+'" data-a="shch" data-i="'+b.id+'" data-j="'+o.id+'"'+(ok?'':' disabled data-why="Aucun navire libre de ce type."')+'>'+eur(o.pay,0)+'</button></div>'; }).join('')+'</div>'+
      '<div class="nf-row" style="margin:6px 4px 0"><small>Le prix suit l’indice du fret ; les offres changent chaque semaine. Il faut un vraquier ou un pétrolier libre.</small></div>';
    /* acheter ou louer */
    h+=nfSec('Les chantiers navals','louer, occasion ou neuf')+'<div class="sh2-ty">'+'<div class="nf-mr" data-k="shty" data-n="1">'+Object.entries(SH_TY).map(([k,T])=>'<div><span class="im">'+NFA.ship.ship(T.k==='bulk'?'vr':T.k==='tank'?'pt':'pc',120,'#1F4E8A')+'</span><b>'+esc(T.n)+'</b><small>'+esc(T.d)+' · '+(T.k==='box'? fmtN(T.cap,0)+' EVP' : fmtN(T.cap,0)+' t')+' · '+T.kn+' nœuds</small><div class="sh2-ac">'+Bt('Louer · '+eur(T.ls,0)+' / j','lease',k,{a:1,dis:!can(T.ls*30)})+Bt('Occasion · '+eur(T.pr*SH_OCC,0),'occ',k,{dis:!can(T.pr*SH_OCC)})+Bt('Neuf · '+eur(T.pr,0),'yard',k,{dis:!can(T.pr)})+'</div></div>').join('')+'</div>'+'</div>'+
      '<div class="nf-row" style="margin:6px 4px 0"><small>Location : dépôt de 30 jours de loyer, rendu à la fin. Occasion : tout de suite, entretien plus cher, revente 35 %. Neuf : livré en '+SH_YARD+' jours, revente 65 %.</small></div>';
    /* terminaux */
    { const nx=Object.values(SH_PT).filter(a=>a.tm&&!m.tm.includes(a.id)).map(a=>[a,shTmReq(b,a.id)]).filter(x=>x[1]>m.img).sort((x,y)=>x[1]-y[1])[0];
      h+=nfSec('Image de marque','ce que pensent les chargeurs')+nfImgCard(m.img,shImgParts(b),shImgShare,nx? 'Prochain terminal à <b>'+nx[1]+'</b> : encore '+plu(Math.ceil(nx[1]-m.img),'point')+'.' : '','conteneurs'); }
    h+=nfSec('Ports et terminaux','image de marque '+Math.round(m.img)+' / 100')+'<div class="nf-card nf-list">'+'<div class="nf-mr grp" data-k="shrg" data-n="1">'+Object.keys(SH_RG).sort((r1,r2)=>(Object.values(SH_PT).some(a2=>a2.rg===r2&&m.tm.includes(a2.id))?1:0)-(Object.values(SH_PT).some(a2=>a2.rg===r1&&m.tm.includes(a2.id))?1:0)).map(rg=>{ const L=Object.values(SH_PT).filter(a2=>a2.tm&&a2.rg===rg); if(!L.length) return '';
      return '<div class="sh2-rg">'+esc(SH_RG[rg])+'</div>'+L.map(a2=>{ const own=m.tm.includes(a2.id), req=shTmReq(b,a2.id), c=shTmCost(a2.id);
        if(own){ const n=(m.ext&&m.ext[a2.id])||0; return nfRowH(esc(a2.n),'votre terminal · '+shTmUsed(b,a2.id)+' / '+shTmCap(b,a2.id)+' lignes',n<3? Bt('Quais · '+eur(shExtCost(b,a2.id),0),'ext',a2.id,{dis:!can(shExtCost(b,a2.id))}) : '<span class="nf-ok">Au maximum</span>'); }
        return nfRowH(esc(a2.n),fmtN(a2.sz,1)+' M d’EVP par an · image '+req+' requise',Bt(eur(c,0),'tm',a2.id,{dis:m.img<req||!can(c)})); }).join(''); }).join('')+'</div>'+'</div>'+
      '<div class="nf-row" style="margin:6px 4px 0"><small>Un terminal permet d’ouvrir des lignes vers sa région et les régions voisines, et des lignes intercontinentales vers vos autres terminaux. Vos escales y coûtent moitié moins.'+(m.uft?' Fret de vos usines transporté : '+eur(m.uft,0)+'.':'')+'</small></div>';
    h+=nfRest(b,X,'Décisions'); return h; }
};
/* ---- énergies renouvelables ---- */
function rn2Sun(n,x0){ return Array.from({length:n},(_,i)=>{ const x=x0+(i%3)*30, y=56+Math.floor(i/3)*14; return '<g transform="translate('+x+' '+y+')"><path d="M0 10 L26 10 L22 0 L4 0Z" fill="#1d3f7a" stroke="#c9d6ea" stroke-width=".6"/><path d="M8.5 0 L7 10 M13 0 V10 M17.5 0 L19 10 M3 5 H23" stroke="#5f85c4" stroke-width=".5"/><line x1="13" y1="10" x2="13" y2="14" stroke="#9aa2ae" stroke-width="1.4"/></g>'; }).join(''); }
function rn2Wind(x,y,s,d){ return '<g transform="translate('+x+' '+y+') scale('+s+')"><path d="M-1.2 0 L-2.6 46 L2.6 46 L1.2 0Z" fill="#f4f6fa" stroke="#c9ced6" stroke-width=".5"/><g><animateTransform attributeName="transform" type="rotate" from="0" to="360" dur="'+d+'s" repeatCount="indefinite"/>'+[0,120,240].map(a=>'<path d="M0 0 L-2 -2 L-1 -26 L1.2 -26 Z" fill="#fff" stroke="#c9ced6" stroke-width=".5" transform="rotate('+a+')"/>').join('')+'</g><circle r="2.4" fill="#c9ced6"/></g>'; }
const RN2_DAM='<path d="M40 40 L120 40 L112 96 L48 96Z" fill="#c9ced6" stroke="#9aa2ae"/><path d="M0 30 L40 40 L40 70 L0 70Z" fill="#3C8BFF" opacity=".85"/><path d="M48 96 Q80 70 112 96" fill="#7fd3ff" opacity=".8"/><path d="M64 50V90M76 50V90M88 50V90" stroke="#7fd3ff" stroke-width="3" opacity=".8"/><path d="M120 40 L160 30 L160 70 L120 70Z" fill="#5a9a3c"/>';
function rn2Scene(b,k){ const R=RN_REG[k], pl=b.m.pl.filter(p=>p.r===k), ns=pl.filter(p=>p.t==='sol').reduce((a,p)=>a+p.sz,0), nw=pl.filter(p=>p.t==='eol').reduce((a,p)=>a+p.sz,0), nh=pl.filter(p=>p.t==='hyd').length;
  const sea=k==='mer', mount=R.h>=1.2;
  let s='<svg viewBox="0 0 160 110" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><rect width="160" height="110" fill="'+(R.s>=1.25?'#bfe6ff':R.w>=1.3?'#a9c6d8':'#cfe6f5')+'"/>';
  if(R.s>=1.25) s+='<circle cx="132" cy="20" r="11" fill="#ffd36b"/>';
  if(sea) s+='<path d="M0 50 L160 50 L160 110 L0 110Z" fill="#2E6FA8"/><path d="M0 62 q20 -6 40 0 t40 0 t40 0 t40 0" stroke="#fff" stroke-width="1.5" fill="none" opacity=".4"/>';
  else if(mount) s+='<path d="M0 60 L30 20 L50 44 L80 8 L112 46 L134 24 L160 54 L160 110 L0 110Z" fill="#8a9ab0"/><path d="M80 8 L90 20 L84 22 L80 16 L74 20Z M30 20 L38 30 L28 32Z" fill="#fff"/>';
  else s+='<path d="M0 70 Q40 56 80 66 T160 62 L160 110 L0 110Z" fill="'+(R.s>=1.25?'#c9b06a':'#7fae5a')+'"/>';
  if(nh) s+='<g transform="translate(0 12)">'+RN2_DAM+'</g>';
  if(ns) s+=rn2Sun(Math.min(9,ns*3),nw?80:40);
  for(let i=0;i<Math.min(3,nw);i++) s+=rn2Wind(30+i*44,sea?40:50-(i%2)*6,.75,2+i*.4);
  return s+'</svg>'; }
FX2.renew={
  chip:b=>{ const L=b.m.last, R0=metR0(b); return L? 'Production : '+eur(L.rev||0,0)+' de ventes hier' : plu(b.m.pl.length,'centrale'); },
  stat:b=>['Prix du jour',String(b.m.px.toFixed(2)).replace('.',NDEC)],
  noRest:true,
  mgmt:{local:'Terrains'},
  dlg:{role:'directeur de la production', txt:'peut installer les centrales, vendre l’électricité et piloter les batteries à votre place'},
  body(b,X,U){ const m=b.m, P=rnDraft(b); let h=nfSec('Les régions','une autorisation par région')+'<div class="rn2-regs">'+Object.keys(RN_REG).map(k=>{ const R=RN_REG[k], g=m.reg[k], lock=R.rk&&!mxHas(b,R.rk), n=m.pl.filter(p=>p.r===k).length;
      const st= lock? ['lk','palier '+R.rk] : g.auth? ['',n? plu(n,'centrale') : 'autorisée'] : g.req? ['wt','demande en cours'] : g.ban>S.day? ['no','opposition locale'] : ['lk','sans autorisation'];
      return '<button class="rn2-rg'+(lock?' lock':'')+(P.r===k?' sel':'')+'" data-a="rnreg" data-i="'+b.id+'" data-v="'+k+'"'+(lock?' disabled':'')+'><div class="sc">'+rn2Scene(b,k)+'</div><div class="bd"><b>'+esc(R.n)+'</b><div class="rt"><span>Soleil '+Math.round(R.s*2.5)+'</span><span>Vent '+Math.round(R.w*2.5)+'</span>'+(R.h?'<span>Eau '+Math.round(R.h*2.5/1.2)+'</span>':'')+'</div><em class="'+st[0]+'">'+st[1]+'</em></div></button>'; }).join('')+'</div>';
    if(m.bat&&m.bat.cap){ const lv=clamp((m.bat.lvl||0)/m.bat.cap,0,1); h+=nfSec('Les batteries','stocker quand c’est bon marché')+'<div class="nf-card rn2-bat"><span class="cell"><span class="lv" style="height:'+Math.max(4,Math.round(lv*100))+'px"></span><span class="pc">'+Math.round(lv*100)+' %</span></span><span class="nf-row"><span><b>Stockage installé</b><small>réglage '+esc(((RN_POL[m.bat.pol]||{}).n||m.bat.pol||'').toString().toLowerCase())+' · charge quand l’électricité est bon marché, revend aux heures chères</small></span></span></div>'; }
    ['req','build','sell','ctr'].forEach(a=>X.get(a)); const R0=metR0(b), cash=availFor(cityOf(b).ccy);
    if(P.r&&RN_REG[P.r]){ const k=P.r, R=RN_REG[k], g=m.reg[k], w=m.wx[k];
      h+='<div class="nf-card rn2-pan"><div class="nf-row"><span><b>'+esc(R.n)+'</b><small>aujourd’hui : soleil '+Math.round(w.s*100)+' %, vent '+Math.round(w.w*100)+' %</small></span><button class="nf-lnk" data-a="rnreg" data-i="'+b.id+'" data-v="'+k+'">Fermer</button></div>';
      if(!g.auth) h+=nfRowH('Autorisation',g.req? 'réponse dans '+plu(g.req-S.day,'jour') : g.ban>S.day? 'l’opposition locale bloque les demandes pendant '+plu(g.ban-S.day,'jour') : eur(R0,0)+', réponse en 30 à 50 jours ; les riverains peuvent s’y opposer','<button class="btn nf-b a" data-a="met" data-i="'+b.id+'" data-v="req" data-j="'+k+'"'+(g.req||g.ban>S.day||cash<R0?' disabled':'')+'>Demander</button>');
      else { h+='<div class="rn2-bld">'+Object.keys(RN_T).map(t=>{ const T=RN_T[t], e=rnCanBuild(b,t,k); if(e&&(t==='hyd'&&!R.h||t==='sol'&&k==='mer')) return '';
          const res=T.rs==='s'?R.s:T.rs==='w'?R.w:R.h; return (m.big?[1,3]:[1]).map(sz=>{ const c=rnCost(b,t,k,sz), day=R0*T.k*res*sz*(k==='mer'?1.2:1);
            return '<button data-a="met" data-i="'+b.id+'" data-v="build" data-j="'+t+':'+k+':'+sz+'"'+(e||cash<c?' disabled':'')+(e?' data-why="'+esc(e)+'"':'')+'><span class="ic">'+RN_ICO[t]+'</span><b>'+T.n+(sz>1?' géant':'')+'</b><small>≈ '+eur(day,0)+' / j au prix moyen</small><em>'+eur(c,0)+'</em></button>'; }).join(''); }).join('')+'</div>';
        const pl=m.pl.filter(x=>x.r===k); if(pl.length) h+='<div class="nf-list" style="margin-top:10px">'+pl.map(x=>nfRowH(RN_T[x.t].n+(x.sz>1?' géant':''),x.down>S.day? 'à l’arrêt encore '+plu(x.down-S.day,'jour') : 'aujourd’hui : '+eur(rnOut(b,x)*R0*m.px,0),'<button class="btn nf-b" data-a="met" data-i="'+b.id+'" data-v="sell" data-j="'+x.id+'">Revendre</button>')).join('')+'</div>'; }
      h+='</div>'; }
    else h+='<div class="nf-row" style="margin:6px 4px 0"><small>Touchez une région pour demander une autorisation ou y construire.</small></div>';
    const avg=m.pxh.reduce((a,x)=>a+x,0)/m.pxh.length, pc=Math.round(avg*.97*100)/100, L=m.pxh, W=300, H=70, mx=Math.max(1.6,...L), mn=Math.min(.5,...L), xx=i=>i*W/(L.length-1), yy=v=>H-6-(v-mn)/(mx-mn)*(H-12);
    h+=nfSec('La vente de l’électricité','prix moyen sur 60 jours : '+avg.toFixed(2).replace('.',NDEC))+'<div class="rn2-day"><svg viewBox="0 0 '+W+' '+H+'" preserveAspectRatio="none" aria-hidden="true"><line x1="0" x2="'+W+'" y1="'+yy(1)+'" y2="'+yy(1)+'" stroke="rgba(255,255,255,.25)" stroke-dasharray="3 3"/><polyline points="'+L.map((v,i)=>xx(i).toFixed(1)+','+yy(v).toFixed(1)).join(' ')+'" fill="none" stroke="#ff8a6b" stroke-width="2.2"/></svg>'+
      '<div class="lg"><span>il y a 60 jours</span><span>prix du jour : <b>'+m.px.toFixed(2).replace('.',NDEC)+'</b></span></div>'+
      '<div class="nf-row" style="margin-top:8px"><span><b>'+(m.ctr.sh? 'Contrat : '+Math.round(m.ctr.sh*100)+' % à '+m.ctr.p.toFixed(2).replace('.',NDEC)+' jusqu’au '+dateL(m.ctr.until) : 'Contrat d’un an')+'</b><small>une part de la production vendue à prix fixe pendant un an'+(m.ctr.sh?'':' (aujourd’hui : '+String(pc).replace('.',NDEC)+')')+' : protège des jours bon marché, mais prive des flambées</small></span></div>'+
      '<div class="nf-seg">'+[[0,'Aucun'],[.3,'30 %'],[.6,'60 %'],[.9,'90 %']].map(([v,n])=>'<button class="'+(m.ctr.sh===v?'on':'')+'" data-a="met" data-i="'+b.id+'" data-v="ctr" data-j="'+v+'">'+n+'</button>').join('')+'</div></div>';
    h+=nfRest(b,X,'Batteries et décisions'); return h; }
};
/* ---- compagnie aérienne ---- */
FX2.airline={
  chip:b=>{ const d=b.m.st||alDay(b,true); return d.legs+' vols par jour · '+plu(b.m.fl.length,'avion'); },
  stat:b=>{ const d=b.m.st||alDay(b,true); return ['Remplissage',Math.round(d.lf*100)+' %']; },
  noRest:true,
  mgmt:{local:'Aéroports'},
  dlg:{role:'directeur des opérations', txt:'peut fixer les prix, programmer les vols et acheter les avions à votre place'},
  body(b,X,U){ const m=b.m, flap=t=>'<span class="ch">'+t.split('').map(c=>'<i>'+(c===' '?'&nbsp;':esc(c))+'</i>').join('')+'</span>', up=s=>s.normalize('NFD').replace(/[̀-ͯ]/g,'').toUpperCase();
    const L=m.ln.slice(0,6), hh=(i)=>{ const t=6*60+((i*97+S.day*13)%(15*60)); return String(Math.floor(t/60)).padStart(2,'0')+':'+String(t%60).padStart(2,'0'); };
    let h=nfSec('Les départs',m.hubs.length? esc((alAp(m.hubs[0])||{n:''}).n) : '')+'<div class="al2-board"><div class="hd"><span>VOL</span><span>DESTINATION</span><span>HEURE</span><span>ÉTAT</span></div>'+
      (L.length? L.map((l,i)=>{ const a=alAp(l.b)||alAp(l.a)||{n:'?'}, f=m.fl.filter(x=>x.ln===l.id), down=f.length&&f.every(x=>x.down>S.day), st=!f.length?['off','Sans avion']:down?['off','Annulé']:i===0?['bo','Embarquement']:(l.id+S.day)%5===0?['re','Retard 20 mn']:['','À l’heure'];
        return '<div class="al2-fl">'+flap((up(b.name).replace(/[^A-Z]/g,'').slice(0,2)||'AZ')+String(100+l.id*7).slice(-3))+flap(up(a.n).slice(0,9).padEnd(9,' '))+flap(hh(i))+'<span class="st '+st[0]+'">'+st[1]+'</span></div>'; }).join('') : '<div class="al2-fl" style="color:#aaa;font-size:12px;grid-template-columns:1fr">Aucune ligne : ouvrez-en une ci-dessous.</div>')+'</div>';
    const pts={}, R=[];
    m.hubs.forEach(id=>{ const p=alAp(id); if(p) pts['al_'+id]=nfLL(p.lat,p.lon,p.n,1); });
    m.ln.forEach((l,k)=>{ const a=alAp(l.a), c=alAp(l.b); if(!a||!c) return; pts['al_'+a.id]=pts['al_'+a.id]||nfLL(a.lat,a.lon,a.n); pts['al_'+c.id]=pts['al_'+c.id]||nfLL(c.lat,c.lon,c.n); const far=Math.abs(a.lon-c.lon)>40; R.push(['al_'+a.id,'al_'+c.id,far?'#ffb3a8':'#8ff0bf',far?20:6,null,'0',k<4?4+k*2:0]); });
    { const G={pts:[], routes:[]}; m.hubs.forEach(id=>{ const p=alAp(id); if(p) G.pts.push([p.lat,p.lon,1]); });
      m.ln.forEach((l,k)=>{ const a=alAp(l.a), c=alAp(l.b); if(!a||!c) return; [a,c].forEach(p=>{ if(!G.pts.some(q=>q[0]===p.lat&&q[1]===p.lon)) G.pts.push([p.lat,p.lon,0]); });
        const A=glbArc([a.lat,a.lon],[c.lat,c.lon],56), n=m.fl.filter(f=>f.ln===l.id&&!(f.down>S.day)).length; G.routes.push({p:A.p,h:Math.min(.2,.025+A.ang*.16),c:A.ang>.6?'#ffb3a8':A.ang>.2?'#F2C94C':'#8ff0bf',n:Math.min(4,n),sp:6+A.ang*14,back:1}); });
      h+=nfSec('Le réseau',m.ln.length? plu(m.ln.length,'ligne') : 'aucune ligne')+glbHtml('al'+b.id,G,{l:'Globe : plateformes et lignes de la compagnie',leg:'<span><i class="h"></i>Plateforme</span><span><i></i>Destination</span>'}); }
    const kk=t=>t==='r70'?'region':t==='m180'?'moyen':'long';
    h+=nfSec('La flotte',plu(m.fl.length,'avion'))+'<div class="al2-fleet">'+m.fl.map(f=>{ const T=AL_TY[f.t]||{n:f.t,d:'',seats:0}, l=m.ln.find(x=>x.id===f.ln);
      return '<div class="al2-pl"><div class="im">'+NFA.plane.plane(kk(f.t),150,'#C8102E')+'</div><b>'+esc(T.n)+'</b><small>'+esc(T.d)+' · '+T.seats+' sièges</small><small>'+(f.down>S.day?'en maintenance':l&&alAp(l.b)? 'vers '+esc(alAp(l.b).n) : 'au sol')+(f.own?' · acheté':' · loué')+'</small><button class="btn nf-b w" style="margin-top:6px;font-size:12px" data-a="met" data-i="'+b.id+'" data-v="drop" data-j="'+f.id+'">'+(f.own?'Revendre · '+eur(T.pr*.7,0):'Rendre')+'</button>'+(f.own? '' : '<button class="btn nf-b a w" style="margin-top:6px;font-size:12px" data-a="met" data-i="'+b.id+'" data-v="own" data-j="'+f.id+'"'+(mAvail(b)<alBuyOutCost(f)?' disabled':'')+'>Racheter · '+eur(alBuyOutCost(f),0)+'</button>')+'</div>'; }).join('')+'</div>';
    ['price','cab','close','drop','own','lease','buy','hub','ext'].forEach(a=>X.get(a)); const can=x=>mAvail(b)>=x;
    const Bt=(lab,act,arg,o)=>{ o=o||{}; return '<button class="btn nf-b'+(o.a?' a':'')+'" data-a="met" data-i="'+b.id+'" data-v="'+act+'"'+(arg!==undefined?' data-j="'+esc(String(arg))+'"':'')+(o.dis?' disabled':'')+'>'+lab+'</button>'; };
    h+=nfSec('Les lignes',m.ln.length? m.ln.length+' en service' : 'aucune ligne')+'<div class="nf-mr" data-k="alln" data-n="3">'+m.ln.map(l=>{ const x=l.st||alLineDay(b,l,true), P=m.fl.filter(p=>p.ln===l.id), d=alDist(l.a,l.b), on=ui.lnG===l.id, lf=x.lf||0;
      return '<div class="al2-ln"><div class="nf-row"><span><b>'+esc(alAp(l.a).n)+' → '+esc(alAp(l.b).n)+'</b><small>'+fmtN(d,0)+' km · '+P.map(p=>AL_TY[p.t].n).join(', ')+' · '+(x.legs||0)+' vols par jour'+(x.strike?' · grève':'')+'</small></span><span class="px"><b class="'+cls(x.net||0)+'">'+signed(x.net||0,0)+'</b><small>par jour</small></span></div>'+
        '<div class="al2-seats" aria-label="Remplissage '+Math.round(lf*100)+' %">'+Array.from({length:30},(_,i)=>'<i class="'+(i<Math.round(lf*30)?'on':'')+(i<[0,3,5][l.cab]?' biz':'')+'"></i>').join('')+'</div>'+
        '<div class="nf-row"><small>Remplissage '+Math.round(lf*100)+' % · billet éco '+eur(alEco(d)*(AL_PRICE[l.p]||1),0)+' ('+Math.round((AL_PRICE[l.p]||1)*100)+' % du prix habituel) · affaires : '+['aucune','8 % de la cabine','15 % de la cabine'][l.cab]+'</small></div>'+
        (on? '<div class="sh2-ac">'+Bt('Prix −','price',l.id+':'+Math.max(0,l.p-1),{dis:l.p<=0})+Bt('Prix +','price',l.id+':'+Math.min(3,l.p+1),{dis:l.p>=3})+Bt('Cabine affaires : '+['aucune','8 %','15 %'][(l.cab+1)%3],'cab',l.id+':'+((l.cab+1)%3))+'<button class="btn nf-b" data-a="aladd" data-i="'+b.id+'" data-j="'+l.id+'">Ajouter un avion</button>'+Bt('Fermer la ligne','close',l.id)+'<button class="btn nf-b a" data-a="lng" data-i="0">Terminé</button></div>' : '<div class="sh2-ac"><button class="btn nf-b" data-a="lng" data-i="'+l.id+'">Gérer la ligne</button></div>')+'</div>'; }).join('')+'</div>'+
      '<button class="btn nf-b a w" style="margin-top:8px" data-a="alnew" data-i="'+b.id+'">Ouvrir une ligne</button>';
    h+=nfSec('Louer ou acheter','dépôt de 30 jours pour une location')+'<div class="sh2-ty">'+'<div class="nf-mr" data-k="alty" data-n="1">'+Object.entries(AL_TY).map(([k,T])=>'<div><span class="im al">'+NFA.plane.plane(k==='r70'?'region':k==='m180'?'moyen':'long',150,'#C8102E')+'</span><b>'+esc(T.n)+'</b><small>'+esc(T.d)+' · '+T.seats+' places · '+fmtN(T.rg,0)+' km</small><div class="sh2-ac">'+Bt('Louer · '+eur(T.ls,0)+' / j','lease',k,{a:1,dis:!can(T.ls*30)})+Bt('Acheter · '+eur(T.pr,0),'buy',k,{dis:!can(T.pr)})+'</div></div>').join('')+'</div>'+'</div>'+
      '<div class="nf-row" style="margin:6px 4px 0"><small>Un avion acheté ne paie que son entretien et se revend 70 % de son prix.</small></div>';
    { const nx=Object.values(AL_AP).filter(a=>a.hub&&!m.hubs.includes(a.id)).map(a=>[a,alHubReq(b,a.id)]).filter(x=>x[1]>m.img).sort((x,y)=>x[1]-y[1])[0];
      h+=nfSec('Image de marque','ce que pensent les voyageurs')+nfImgCard(m.img,alImgParts(b),alImgShare,nx? 'Prochaine place dans une tour à <b>'+nx[1]+'</b> : encore '+plu(Math.ceil(nx[1]-m.img),'point')+'.' : '',
        'voyageurs'); }
    h+=nfSec('Les tours de contrôle','image de marque '+Math.round(m.img)+' / 100')+'<div class="nf-card nf-list">'+'<div class="nf-mr grp" data-k="alct" data-n="1">'+Object.keys(AL_CT).sort((c1,c2)=>(m.hubs.some(h=>AL_CO[alAp(h).co].ct===c2)?1:0)-(m.hubs.some(h=>AL_CO[alAp(h).co].ct===c1)?1:0)).map(ct=>{ const L=Object.values(AL_AP).filter(a2=>a2.hub&&AL_CO[a2.co].ct===ct); if(!L.length) return '';
      return '<div class="sh2-rg" style="color:#C8102E">'+esc(AL_CT[ct])+'</div>'+L.map(a2=>{ const own=m.hubs.includes(a2.id), req=alHubReq(b,a2.id), c=alHubCost(a2.id);
        if(own){ const n=(m.ext&&m.ext[a2.id])||0; return nfRowH(esc(a2.n),esc(AL_CO[a2.co].n)+' · '+alHubUsed(b,a2.id)+' / '+alHubCap(b,a2.id)+' lignes',n<3? Bt('Créneaux · '+eur(alExtCost(b,a2.id),0),'ext',a2.id,{dis:!can(alExtCost(b,a2.id))}) : '<span class="nf-ok">Au maximum</span>'); }
        return nfRowH(esc(a2.n),esc(AL_CO[a2.co].n)+' · '+a2.sz+' M de passagers par an · image '+req+' requise',Bt(eur(c,0),'hub',a2.id,{dis:m.img<req||!can(c)})); }).join(''); }).join('')+'</div>'+'</div>'+
      '<div class="nf-row" style="margin:6px 4px 0"><small>Une place dans une tour permet d’ouvrir des lignes vers le même pays ou un pays voisin, et du long-courrier vers vos autres plateformes.</small></div>';
    h+=nfRest(b,X,'Carburant et décisions'); return h; }
};

/* les parcours maritimes et aériens restent dans la fiche */
nfFlowWrap(['shnew','shnewa','shnewb','shnewgo','shadd','shaddgo','shch','shchgo','alnew','alnewa','alnewb','alnewgo','aladd','aladdgo']);

/* V2.4.9 : carte « Image de marque » commune aux compagnies aérienne et maritime */
function nfImgCard(img,P,share,next,unit){ const t=imgTarget(P), d30=(t-img)*(1-Math.pow(1-1/400,30)), sh=share(img), up=Math.round(img/10)*10+10<=100? Math.min(100,Math.ceil((img+.01)/10)*10) : 100;
  const col=img>=70?'#2BB673':img>=45?'#F2C94C':'#E07A1F';
  let h='<div class="nf-card im2"><div class="im2-top"><div class="im2-g"><svg viewBox="0 0 64 64" aria-hidden="true"><circle cx="32" cy="32" r="27" fill="none" stroke="rgba(0,0,0,.08)" stroke-width="7"/><circle cx="32" cy="32" r="27" fill="none" stroke="'+col+'" stroke-width="7" stroke-linecap="round" stroke-dasharray="'+(img/100*169.6).toFixed(1)+' 170" transform="rotate(-90 32 32)"/></svg><b>'+Math.round(img)+'</b><small>sur 100</small></div>'+
    '<div class="im2-t"><b>'+(Math.abs(t-img)<.5? 'Stable à '+Math.round(t) : (t>img? 'Monte vers ' : 'Baisse vers ')+Math.round(t))+'</b><small>'+(Math.abs(d30)>=.1? (d30>0?'+':'')+fmtN(d30,1)+' point en 30 jours au rythme actuel' : 'L’image a atteint sa cible.')+'</small>'+
    '<small>Vous attirez <b>'+Math.round(sh*100)+' %</b> des '+unit+' de vos lignes au prix normal'+(up>img&&up<=100? ' ; à '+up+', ce serait '+Math.round(share(up)*100)+' %' : '')+'.</small></div></div>';
  h+='<div class="im2-f">'+P.map(([l,v,on,how])=>{ v=(Math.round(v*10)/10)||0; return '<div class="im2-r'+(on?'':' off')+'"><span>'+esc(l)+(on? '' : '<small>à acheter dans les options</small>')+'</span><b class="'+(v>0?'pos':v<0?'neg':'')+'">'+(on? (v>0?'+':'')+fmtN(v,v%1?1:0) : esc(how))+'</b></div>'; }).join('')+'<div class="im2-r tot"><span>Cible (base 30, plafond 95)</span><b>'+Math.round(t)+'</b></div></div>';
  if(next) h+='<div class="im2-nx">'+next+'</div>';
  return h+'</div>'; }
NF_CSS.push(`
.im2-top{display:flex;gap:14px;align-items:center}
.im2-g{position:relative;width:72px;height:72px;flex:0 0 auto}.im2-g svg{width:100%;height:100%}
.im2-g b{position:absolute;left:0;right:0;top:19px;text-align:center;font:800 22px var(--nf-df,var(--fd));color:var(--nf-h)}.im2-g small{position:absolute;left:0;right:0;top:44px;text-align:center;font:700 9.5px var(--fb);color:var(--ink-3)}
.im2-t{min-width:0}.im2-t>b{display:block;font:800 16px var(--fb);color:var(--nf-h)}.im2-t small{display:block;font-size:12.5px;color:var(--ink-2);margin-top:3px}.im2-t small b{color:var(--nf-h)}
.im2-f{margin-top:12px;border-top:1px solid var(--nf-bg2)}
.im2-r{display:flex;justify-content:space-between;align-items:center;gap:10px;padding:7px 0;border-bottom:1px solid var(--nf-bg2);font-size:13px}
.im2-r small{display:block;font-size:11px;color:var(--ink-3)}.im2-r.off{color:var(--ink-3)}.im2-r.off b{font-weight:700;color:var(--ink-3)}
.im2-r b.pos{color:#16804D}.im2-r b.neg{color:#C8352A}.im2-r.tot{border-bottom:0;font-weight:800}
.im2-nx{margin-top:8px;padding:9px 11px;border-radius:12px;background:var(--nf-bg);font-size:12.5px;color:var(--ink-2)}
`);

