# wodEnhance
针对[WoD](https://delta.world-of-dungeons.org/)的一个增强扩展，主要有如下特性：

- 根据自己的喜好对界面进行了调整；
- 增加了战斗设置的BBcode导出功能；
- 优化了战报界面；
- 角色卡的导出BBcode功能。
- 整合了如下几个content script, 并对应修改使之适合Chrome Manifest V3 的规范要求等:
  - [WoD BBCode Generator](https://update.greasyfork.org/scripts/3800/BBCode%20Generator.user.js) @Tomy/Finargol
  - [Wod Display Skill Rolls](https://update.greasyfork.org/scripts/439870/%5BWoD%5D%20Display%20Skill%20Rolls_CN.meta.js) @Xaerodegreaz
  -[WoD Extra Statistics](https://update.greasyfork.org/scripts/3801/Extra%20Statistics.meta.js) @fenghou,Tomy
  -[WoD Jumpbox Enhancement](https://greasyfork.org/zh-CN/scripts/398732-wod-jumpbox-enhanced) @DotIN13
  -[Wod 耗材单价]( https://greasyfork.org/zh-CN/scripts/8896-wod-%E8%80%97%E6%9D%90%E5%8D%95%E4%BB%B7) @lgg 2
  - [小市场（团商利器）Ver 1.2](https://greasyfork.org/zh-CN/scripts/3797-wod-%E5%B0%8F%E5%B8%82%E5%9C%BA-%E5%9B%A2%E5%95%86%E5%88%A9%E5%99%A8-ver-1-2); @notaflower

非常感谢这些脚本作者！

## Versions
-1.2.11
  - 调整战术设置导出格式（@紫企鹅）

-1.2.10
  - 修正角色卡瑕疵  (@萊莎琳)
  
-1.2.9
  - 增加关于交易消息的解析方便记录和汇总

-1.2.8
  - 修正了Jumper插件表现

-1.2.7
  - 修正了某些select中的空项无法选择的问题  

-1.2.6 
  - 修正了一些问题 (SkillConfig)
  - UI Update

-1.2.5 
  - 修正了一些问题 (SkillConfig)
  - 增加了黑暗模式

-1.2 
  - 在[小市场（团商利器）Ver 1.2](https://greasyfork.org/zh-CN/scripts/3797-wod-%E5%B0%8F%E5%B8%82%E5%9C%BA-%E5%9B%A2%E5%95%86%E5%88%A9%E5%99%A8-ver-1-2)基础上，增强了物品读取显示查找的功能；
  - 为所有物品相关select增加了搜索功能；
  - 其他修正增强等
- v1.0.1:     Minor fix on charCard
- v1.0:       Released